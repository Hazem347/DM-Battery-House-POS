import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('1234', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'qadeer@dmbh.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'qadeer@dmbh.com',
      password: hashedPassword,
      name: 'Qadeer Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Create Categories
  const catAutomotive = await prisma.category.upsert({
    where: { name: 'Automotive' },
    update: {},
    create: {
      name: 'Automotive',
      description: 'Batteries for cars, trucks, and SUVs',
    },
  });

  const catMarine = await prisma.category.upsert({
    where: { name: 'Marine & RV' },
    update: {},
    create: {
      name: 'Marine & RV',
      description: 'Deep cycle batteries for boats and RVs',
    },
  });

  // 3. Create Brands
  const brandOptima = await prisma.brand.upsert({
    where: { name: 'Optima' },
    update: {},
    create: {
      name: 'Optima',
      description: 'High performance AGM batteries',
    },
  });

  const brandACDelco = await prisma.brand.upsert({
    where: { name: 'ACDelco' },
    update: {},
    create: {
      name: 'ACDelco',
      description: 'Reliable automotive batteries',
    },
  });

  // 4. Create Initial Products
  const prod1 = await prisma.product.upsert({
    where: { sku: 'OPT-RED-34' },
    update: {},
    create: {
      name: 'Optima RedTop 34/78',
      sku: 'OPT-RED-34',
      barcode: '0811234567890',
      description: 'High performance AGM starting battery',
      capacity: '50Ah',
      voltage: '12V',
      warranty: '36 Months',
      purchasePrice: 150.00,
      salePrice: 249.99,
      categoryId: catAutomotive.id,
      brandId: brandOptima.id,
      status: 'ACTIVE',
      inventory: {
        create: {
          quantity: 25
        }
      }
    },
  });

  const prod2 = await prisma.product.upsert({
    where: { sku: 'ACD-GOLD-48' },
    update: {},
    create: {
      name: 'ACDelco Gold 48 AGM',
      sku: 'ACD-GOLD-48',
      barcode: '0810987654321',
      description: 'Premium flooded battery',
      capacity: '70Ah',
      voltage: '12V',
      warranty: '42 Months',
      purchasePrice: 110.00,
      salePrice: 189.99,
      categoryId: catAutomotive.id,
      brandId: brandACDelco.id,
      status: 'ACTIVE',
      inventory: {
        create: {
          quantity: 10
        }
      }
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
