const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  // Agregar columna imagen si no existe
  db.exec(`
    ALTER TABLE productos ADD COLUMN imagen TEXT;
  `);
  console.log('✅ Columna imagen agregada exitosamente');
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('ℹ️  La columna imagen ya existe');
  } else {
    console.error('❌ Error:', error.message);
  }
}

// Actualizar productos con imágenes
const productosConImagenes = [
  { codigo: 'MNG-001', imagen: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=500&fit=crop' },
  { codigo: 'YGA-002', imagen: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop' },
  { codigo: 'BND-003', imagen: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop' },
  { codigo: 'BRR-004', imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop' },
  { codigo: 'PLT-005', imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=500&fit=crop' },
  { codigo: 'RPE-006', imagen: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&h=500&fit=crop' },
  { codigo: 'BNC-007', imagen: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&h=500&fit=crop' },
  { codigo: 'TRD-008', imagen: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&h=500&fit=crop' },
  { codigo: 'WRK-009', imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop' },
  { codigo: 'KNP-010', imagen: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=500&h=500&fit=crop' }
];

const updateStmt = db.prepare('UPDATE productos SET imagen = ? WHERE codigo = ?');

productosConImagenes.forEach(({ codigo, imagen }) => {
  try {
    updateStmt.run(imagen, codigo);
    console.log(`✅ Imagen actualizada para ${codigo}`);
  } catch (error) {
    console.error(`❌ Error actualizando ${codigo}:`, error.message);
  }
});

console.log('\n✅ Base de datos actualizada correctamente');
db.close();
