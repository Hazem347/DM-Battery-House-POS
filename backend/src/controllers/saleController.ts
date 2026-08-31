import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a sale
export const createSale = async (req: Request, res: Response) => {
  const { 
    items, // Array of { productId, quantity, unitPrice }
    totalAmount, discount, tax, finalAmount, paymentMethod, amountPaid, changeAmount, customerId 
  } = req.body;
  const userId = (req as any).user.id;

  try {
    const sale = await prisma.$transaction(async (tx) => {
      // Create the Sale record
      const newSale = await tx.sale.create({
        data: {
          receiptNumber: `REC-${Date.now()}`,
          totalAmount,
          discount,
          tax,
          finalAmount,
          paymentMethod,
          amountPaid,
          changeAmount,
          userId,
          customerId,
          saleItems: {
            create: items.map((item: any) => ({
              productId: parseInt(item.productId),
              quantity: parseInt(item.quantity),
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice
            }))
          }
        },
        include: {
          saleItems: true
        }
      });

      // Decrement inventory and record history
      for (const item of items) {
        await tx.inventory.update({
          where: { productId: parseInt(item.productId) },
          data: {
            quantity: { decrement: parseInt(item.quantity) }
          }
        });

        await tx.inventoryHistory.create({
          data: {
            productId: parseInt(item.productId),
            action: "SALE",
            quantity: -parseInt(item.quantity),
            reference: newSale.receiptNumber,
            notes: 'Product sold'
          }
        });
      }

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to complete sale', error: error.message || error });
  }
};

// Get all sales
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: { select: { id: true, name: true, role: true } },
        customer: true,
        saleItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error });
  }
};

// Get single sale by ID
export const getSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        user: { select: { id: true, name: true } },
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sale', error });
  }
};
