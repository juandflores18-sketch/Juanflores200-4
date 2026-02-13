const Stripe = require('stripe');
const CarritoModel = require('../models/CarritoModel');
const OrdenModel = require('../models/OrdenModel');

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE = process.env.PAYPAL_SANDBOX === 'false' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

class PagosService {
  static async paypalAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64');
    const r = await fetch(PAYPAL_BASE + '/v1/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Basic ' + auth 
      },
      body: 'grant_type=client_credentials'
    });
    const data = await r.json();
    if (!r.ok || !data.access_token) {
      throw new Error(data.error_description || 'PayPal OAuth error');
    }
    return data.access_token;
  }

  static guardarOrdenDesdeCarrito(usuarioId, stripeSessionId = null) {
    const items = CarritoModel.findByUsuarioId(usuarioId);
    if (items.length === 0) {
      return null;
    }

    const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const orden = OrdenModel.create(usuarioId, total, stripeSessionId);
    OrdenModel.createOrdenItems(orden.id, items);
    
    CarritoModel.deleteAllItems(usuarioId);
    return { ordenId: orden.id, total };
  }

  static async crearSesionStripe(usuarioId, frontendUrl = 'http://localhost:3000') {
    if (!stripe) {
      throw new Error('Pagos no configurados. Configure STRIPE_SECRET_KEY en variables de entorno.');
    }

    const items = CarritoModel.findByUsuarioId(usuarioId);
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.nombre,
          description: `Código: ${item.producto_codigo}`
        },
        unit_amount: Math.round(item.precio * 100)
      },
      quantity: item.cantidad
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/carrito`,
      metadata: {
        usuario_id: usuarioId.toString()
      }
    });

    return {
      url: session.url,
      sessionId: session.id
    };
  }

  static async crearOrdenPayPal(usuarioId, frontendUrl = 'http://localhost:3000') {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal no configurado. Configure PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET.');
    }

    const items = CarritoModel.findByUsuarioId(usuarioId);
    if (items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);

    const token = await this.paypalAccessToken();
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'USD', value: total.toFixed(2) },
        description: 'Compra E-Commerce - ' + items.length + ' producto(s)'
      }],
      application_context: {
        return_url: frontendUrl + '/pagos.html?paypal_approved=1',
        cancel_url: frontendUrl + '/pagos.html?paypal_cancel=1'
      }
    };

    const r = await fetch(PAYPAL_BASE + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(orderPayload)
    });
    const data = await r.json();
    
    if (!r.ok) {
      throw new Error(data.message || 'Error al crear orden PayPal');
    }

    const approvalUrl = data.links?.find(l => l.rel === 'approve')?.href;
    if (!approvalUrl) {
      throw new Error('PayPal no devolvió URL de aprobación');
    }

    return {
      orderId: data.id,
      approvalUrl
    };
  }

  static async capturarPagoPayPal(orderId, usuarioId) {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal no configurado.');
    }

    const token = await this.paypalAccessToken();
    const captureRes = await fetch(PAYPAL_BASE + '/v2/checkout/orders/' + encodeURIComponent(orderId) + '/capture', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + token 
      }
    });
    const captureData = await captureRes.json();
    
    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      throw new Error(captureData.message || 'No se pudo capturar el pago PayPal');
    }

    const resultado = this.guardarOrdenDesdeCarrito(usuarioId, null);
    if (!resultado) {
      throw new Error('El carrito está vacío');
    }

    return {
      mensaje: 'Pago PayPal capturado y orden guardada',
      ordenId: resultado.ordenId,
      total: Math.round(resultado.total * 100) / 100
    };
  }

  static confirmarOrden(usuarioId) {
    const resultado = this.guardarOrdenDesdeCarrito(usuarioId, null);
    if (!resultado) {
      throw new Error('El carrito está vacío');
    }
    return {
      mensaje: 'Orden guardada correctamente',
      ordenId: resultado.ordenId,
      total: Math.round(resultado.total * 100) / 100
    };
  }

  static getOrdenes(usuarioId) {
    const ordenes = OrdenModel.findByUsuarioId(usuarioId);
    return ordenes.map(orden => ({
      ...orden,
      items: OrdenModel.findItemsByOrdenId(orden.id)
    }));
  }

  static webhookStripe(req) {
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Webhook no configurado');
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      throw new Error('Falta Stripe-Signature');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const usuarioId = parseInt(session.metadata?.usuario_id, 10);
      if (!usuarioId) {
        throw new Error('metadata.usuario_id faltante');
      }

      const yaProcesada = OrdenModel.findById(session.id);
      if (yaProcesada) {
        return { received: true };
      }

      this.guardarOrdenDesdeCarrito(usuarioId, session.id);
    }

    return { received: true };
  }
}

module.exports = PagosService;