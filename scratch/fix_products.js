const fs = require('fs');
const { execSync } = require('child_process');

// 1. Fetch current products
const output = execSync('docker exec -i shop_mysql mysql -u db_user -pdb_password --default-character-set=utf8mb4 shop_db -e "SELECT id, name, category_id FROM products ORDER BY id;"', { encoding: 'utf8' });

const lines = output.trim().split('\n').filter(l => l && !l.startsWith('mysql:') && !l.startsWith('id\t'));

const products = lines.map(line => {
  const parts = line.split('\t');
  return {
    id: parseInt(parts[0], 10),
    name: parts[1],
    currentCategoryId: parseInt(parts[2], 10)
  };
});

console.log(`Loaded ${products.length} products from database.`);

// Image pools (all verified 200 OK)
const imagePools = {
  laptopStandard: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
  ],
  laptopGaming: [
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    "https://images.unsplash.com/photo-1580522151917-c205f257bf8c?w=800",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"
  ],
  monitor: [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800",
    "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800",
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"
  ],
  headphones: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
  ],
  speaker: [
    "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
    "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800"
  ],
  mouse: [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
    "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
    "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800",
    "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?w=800",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800"
  ],
  keyboard: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
    "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"
  ],
  tablet: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
    "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
  ],
  console: [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800",
    "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800"
  ],
  camera: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800"
  ],
  router: [
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800"
  ],
  smartphone: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
    "https://images.unsplash.com/photo-1598327105666-5b89351af9db?w=800",
    "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
  ],
  tv: [
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800"
  ],
  coffee: [
    "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800"
  ],
  hardware: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"
  ]
};

function getCategoryAndPool(product) {
  const name = product.name;
  
  if (name.includes('DeLonghi') || name.toLowerCase().includes('ekspres')) {
    return { categoryId: 21, pool: imagePools.coffee }; // Ekspresy do kawy
  }
  if (name.includes('RTX') || name.includes('GeForce')) {
    return { categoryId: 9, pool: imagePools.hardware }; // Karty graficzne
  }
  if (name.includes('Core i9') || name.includes('Ryzen')) {
    return { categoryId: 10, pool: imagePools.hardware }; // Procesory
  }
  if (name.includes('OLED S95C') || name.includes('Telewizor')) {
    return { categoryId: 20, pool: imagePools.tv }; // Telewizory
  }
  if (
    (name.includes('Laptop') && name.includes('Gaming')) ||
    name.includes('ROG') || name.includes('Blade') ||
    name.includes('Raider') || name.includes('Legion') ||
    name.includes('Helios')
  ) {
    return { categoryId: 8, pool: imagePools.laptopGaming }; // Laptopy gamingowe
  }
  if (
    name.includes('Laptop') || name.includes('MacBook') ||
    name.includes('XPS') || name.includes('ThinkPad') ||
    name.includes('Spectre') || name.includes('Zenbook')
  ) {
    return { categoryId: 1, pool: imagePools.laptopStandard }; // Laptopy i komputery
  }
  if (name.includes('Monitor') || name.includes('UltraGear') || name.includes('UltraSharp')) {
    return { categoryId: 17, pool: imagePools.monitor }; // Monitory
  }
  if (
    name.includes('Headphones') || name.includes('AirPods') ||
    name.includes('WH-1000') || name.includes('Momentum')
  ) {
    return { categoryId: 11, pool: imagePools.headphones }; // Słuchawki
  }
  if (name.includes('Speaker') || name.includes('Boombox') || name.includes('Stanmore')) {
    return { categoryId: 12, pool: imagePools.speaker }; // Głośniki
  }
  if (name.includes('Mouse') || name.includes('Superlight')) {
    return { categoryId: 14, pool: imagePools.mouse }; // Myszki i klawiatury
  }
  if (name.includes('Keyboard') || name.includes('BlackWidow')) {
    return { categoryId: 14, pool: imagePools.keyboard }; // Myszki i klawiatury
  }
  if (name.includes('Tablet') || name.includes('iPad')) {
    return { categoryId: 23, pool: imagePools.tablet }; // Tablety
  }
  if (name.includes('Console') || name.includes('Konsola')) {
    return { categoryId: 24, pool: imagePools.console }; // Konsole do gier
  }
  if (name.includes('Camera') || name.includes('Aparat')) {
    return { categoryId: 26, pool: imagePools.camera }; // Kamery i aparaty
  }
  if (name.includes('Router')) {
    return { categoryId: 25, pool: imagePools.router }; // Urządzenia sieciowe
  }
  if (
    name.includes('Phone') || name.includes('iPhone') ||
    name.includes('Galaxy S') || name.includes('Pixel') ||
    name.includes('Xiaomi') || name.includes('OnePlus') ||
    name.includes('Xperia') || name.includes('Zenfone') ||
    name.includes('Edge 40')
  ) {
    return { categoryId: 2, pool: imagePools.smartphone }; // Smartfony i smartwatche
  }
  
  throw new Error(`Unclassified product: ${name}`);
}

const sqlStatements = [];
sqlStatements.push("START TRANSACTION;");

// Update categories and images
for (const p of products) {
  const { categoryId, pool } = getCategoryAndPool(p);
  
  // Update category
  sqlStatements.push(`UPDATE products SET category_id = ${categoryId} WHERE id = ${p.id};`);
  
  // For products > 33 (which had the placeholder image), replace images with 2 distinct images from pool
  if (p.id > 33) {
    sqlStatements.push(`DELETE FROM product_images WHERE product_id = ${p.id};`);
    const img1 = pool[p.id % pool.length];
    const img2 = pool[(p.id + 1) % pool.length];
    sqlStatements.push(`INSERT INTO product_images (product_id, image_path, created_at) VALUES (${p.id}, '${img1}', NOW());`);
    if (img2 !== img1) {
      sqlStatements.push(`INSERT INTO product_images (product_id, image_path, created_at) VALUES (${p.id}, '${img2}', NOW());`);
    }
  } else {
    // For products 1-33: if product 33 (DeLonghi), add second coffee image if only 1 exists
    if (p.id === 33) {
      sqlStatements.push(`INSERT INTO product_images (product_id, image_path, created_at) SELECT 33, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', NOW() WHERE (SELECT count(*) FROM (SELECT * FROM product_images WHERE product_id = 33) AS t) < 2;`);
    }
  }
}

sqlStatements.push("COMMIT;");

const sqlContent = sqlStatements.join('\n');
fs.writeFileSync('scratch/update_products.sql', sqlContent, 'utf8');
console.log(`Generated scratch/update_products.sql with ${sqlStatements.length} statements.`);
