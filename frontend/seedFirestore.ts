import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load .env.local variables
config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin init error:', error);
    process.exit(1);
  }
}

const db = getFirestore();
const auth = getAuth();

const SEED_USERS = [
  { email: 'admin@dmbatteryhouse.com', password: 'password123', name: 'Super Admin', role: 'ADMIN' },
  { email: 'manager@dmbatteryhouse.com', password: 'password123', name: 'Store Manager', role: 'MANAGER' },
  { email: 'cashier@dmbatteryhouse.com', password: 'password123', name: 'Front Desk Cashier', role: 'CASHIER' }
];

const SEED_CATEGORIES = [
  { name: 'Automotive Batteries', description: 'Car and truck batteries' },
  { name: 'Motorcycle Batteries', description: 'Bike batteries' },
  { name: 'Solar Batteries', description: 'Deep cycle solar storage' },
  { name: 'Inverter Batteries', description: 'Home backup power' },
  { name: 'Marine Batteries', description: 'Boat and RV power' }
];

const SEED_BRANDS = [
  { name: 'Exide', description: 'Premium automotive' },
  { name: 'Osaka', description: 'Reliable and affordable' },
  { name: 'AGS', description: 'High performance' },
  { name: 'Phoenix', description: 'Long life batteries' },
  { name: 'Volta', description: 'Advanced power solutions' }
];

const SEED_CUSTOMERS = Array.from({ length: 10 }).map((_, i) => ({
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+1234567890${i}`,
  address: `${i + 100} Battery Avenue, City`
}));

const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPrice = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

async function clearCollection(collectionPath: string) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Cleared collection: ${collectionPath}`);
}

async function seed() {
  console.log('🌱 Starting Firestore Seed...');

  try {
    // 1. Users
    console.log('Seeding Users...');
    await clearCollection('users');
    
    // Cleanup old Auth users
    const listUsersResult = await auth.listUsers(100);
    for (const u of listUsersResult.users) {
      if (SEED_USERS.find(su => su.email === u.email)) {
        await auth.deleteUser(u.uid);
      }
    }

    const cashierIds: string[] = [];

    for (const userData of SEED_USERS) {
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name,
      });

      await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });

      await db.collection('users').doc(userRecord.uid).set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: FieldValue.serverTimestamp()
      });
      console.log(`Created user: ${userData.email} / ${userData.password}`);
      
      if (userData.role === 'CASHIER') cashierIds.push(userRecord.uid);
    }

    // 2. Categories
    console.log('Seeding Categories...');
    await clearCollection('categories');
    const categoriesData: any[] = [];
    for (const cat of SEED_CATEGORIES) {
      const ref = await db.collection('categories').add({ ...cat, createdAt: FieldValue.serverTimestamp() });
      categoriesData.push({ id: ref.id, name: cat.name });
    }

    // 3. Brands
    console.log('Seeding Brands...');
    await clearCollection('brands');
    const brandsData: any[] = [];
    for (const brand of SEED_BRANDS) {
      const ref = await db.collection('brands').add({ ...brand, createdAt: FieldValue.serverTimestamp() });
      brandsData.push({ id: ref.id, name: brand.name });
    }

    // 4. Products & Inventory
    console.log('Seeding Products (25 total)...');
    await clearCollection('products');
    const productIds: string[] = [];
    
    const capacities = ['40AH', '65AH', '100AH', '150AH', '200AH'];
    
    for (let i = 1; i <= 25; i++) {
      const purchasePrice = randomPrice(10000, 35000); // Realistic PKR prices
      const salePrice = purchasePrice * randomPrice(1.1, 1.3);
      const stock = randomInt(0, 100);
      const brand = random(brandsData);
      const category = random(categoriesData);
      const capacity = random(capacities);
      
      const product = {
        name: `${brand.name} Battery 12V ${capacity}`,
        sku: `BAT-${brand.name.substring(0,3).toUpperCase()}-${capacity}-${i.toString().padStart(4, '0')}`,
        barcode: `890${randomInt(1000000000, 9999999999)}`,
        category: category,
        categoryId: category.id,
        brand: brand,
        brandId: brand.id,
        purchasePrice,
        salePrice,
        pricePKR: salePrice,
        capacity: capacity,
        voltage: '12V',
        warranty: random(['6 Months', '12 Months', '18 Months']),
        description: `High quality sealed lead acid battery from ${brand.name}.`,
        image: 'https://images.unsplash.com/photo-1620283085439-3f6229c66cc2?auto=format&fit=crop&q=80&w=400',
        images: 'https://images.unsplash.com/photo-1620283085439-3f6229c66cc2?auto=format&fit=crop&q=80&w=400',
        minStockLevel: randomInt(2, 10),
        stock: stock,
        status: stock > 0 ? 'In Stock' : 'Out of Stock',
        specifications: {
            terminals: 'Standard',
            maintenance: 'Maintenance Free'
        },
        inventory: {
          quantity: stock
        },
        createdAt: FieldValue.serverTimestamp()
      };
      
      const ref = await db.collection('products').add(product);
      productIds.push(ref.id);
    }

    // 5. Customers
    console.log('Seeding Customers...');
    await clearCollection('customers');
    const customerIds: string[] = [];
    for (const cust of SEED_CUSTOMERS) {
      const ref = await db.collection('customers').add({ ...cust, createdAt: FieldValue.serverTimestamp() });
      customerIds.push(ref.id);
    }

    // 6. Sales
    console.log('Seeding Sales (20 total)...');
    await clearCollection('sales');
    for (let i = 1; i <= 20; i++) {
      const daysAgo = randomInt(0, 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const itemsCount = randomInt(1, 3);
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < itemsCount; j++) {
        const prodId = random(productIds);
        const qty = randomInt(1, 2);
        const unitPrice = randomPrice(100, 200);
        items.push({
          productId: prodId,
          quantity: qty,
          unitPrice: unitPrice
        });
        totalAmount += (qty * unitPrice);
      }

      const tax = totalAmount * 0.085;
      const finalAmount = totalAmount + tax;

      const sale = {
        receiptNumber: `REC-${date.getTime()}-${i}`,
        cashierId: cashierIds[0] || 'unknown',
        customerId: random([...customerIds, null]),
        totalAmount,
        discount: 0,
        tax,
        finalAmount,
        paymentMethod: random(['CASH', 'CARD']),
        amountPaid: finalAmount,
        changeAmount: 0,
        items,
        createdAt: Timestamp.fromDate(date)
      };

      await db.collection('sales').add(sale);
    }

    // 7. Settings
    console.log('Seeding Settings...');
    await clearCollection('settings');
    await db.collection('settings').doc('general').set({
      storeName: 'DM Battery House',
      taxRate: 8.5,
      currency: 'USD',
      contactPhone: '+1234567890',
      address: 'Haripur, Pakistan'
    });

    // 8. Notifications
    console.log('Seeding Notifications...');
    await clearCollection('notifications');
    await db.collection('notifications').add({
      title: 'System Seeded',
      message: 'Initial dummy data successfully loaded into Firebase.',
      read: false,
      createdAt: FieldValue.serverTimestamp()
    });

    console.log('✅ Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
