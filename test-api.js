const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const randomEmail = `test${Date.now()}@example.com`;

async function testAuth() {
  console.log('🧪 Pruebas de Autenticación');
  try {
    // Prueba de registro con email único
    console.log('1. Registro de usuario');
    const registroRes = await axios.post(`${API_BASE}/auth/registro`, {
      nombre: 'Test User',
      email: randomEmail,
      password: '123456',
      nivel: 'usuario'
    });
    console.log('✅ Registro exitoso:', registroRes.data.usuario.nombre);

    // Prueba de login
    console.log('2. Inicio de sesión');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: randomEmail,
      password: '123456'
    });
    const token = loginRes.data.token;
    console.log('✅ Login exitoso');

    // Prueba de perfil
    console.log('3. Obtener perfil');
    const perfilRes = await axios.get(`${API_BASE}/auth/perfil`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Perfil obtenido:', perfilRes.data.nombre);

    return token;
  } catch (error) {
    console.error('❌ Error en auth:', error.response?.data?.error || error.message);
    return null;
  }
}

async function testProductos(token) {
  console.log('\n🧪 Pruebas de Productos');
  try {
    // Prueba de obtener productos
    console.log('1. Obtener productos');
    const productosRes = await axios.get(`${API_BASE}/productos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Productos obtenidos: ${productosRes.data.length}`);

    return productosRes.data;
  } catch (error) {
    console.error('❌ Error en productos:', error.response?.data?.error || error.message);
    return null;
  }
}

async function testCarrito(token) {
  console.log('\n🧪 Pruebas de Carrito');
  try {
    // Prueba de obtener carrito
    console.log('1. Obtener carrito');
    const carritoRes = await axios.get(`${API_BASE}/carrito`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Carrito: ${carritoRes.data.items.length} items`);

    return carritoRes.data;
  } catch (error) {
    console.error('❌ Error en carrito:', error.response?.data?.error || error.message);
    return null;
  }
}

async function testPagos(token) {
  console.log('\n🧪 Pruebas de Pagos');
  try {
    // Prueba de obtener ordenes
    console.log('1. Obtener ordenes');
    const ordenesRes = await axios.get(`${API_BASE}/pagos/ordenes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Ordenes: ${ordenesRes.data.length}`);

    return ordenesRes.data;
  } catch (error) {
    console.error('❌ Error en pagos:', error.response?.data?.error || error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de API');
  console.log('=' . repeat(50));

  const token = await testAuth();
  if (!token) {
    console.log('\n❌ Pruebas fallidas - no se pudo autenticar');
    return;
  }

  await testProductos(token);
  await testCarrito(token);
  await testPagos(token);

  console.log('\n✅ Pruebas completadas exitosamente!');
  console.log('=' . repeat(50));
}

main().catch(error => {
  console.error('❌ Error en pruebas:', error);
});