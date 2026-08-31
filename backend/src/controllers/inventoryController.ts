import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get inventory for all products
export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true
      }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error });
  }
};

// Add stock (STOCK_IN)
export const addStock = async (req: Request, res: Response) => {
  const { productId, quantity, reference, notes } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.update({
        where: { productId: parseInt(productId) },
        data: {
          quantity: {
            increment: parseInt(quantity)
          }
        }
      });

      await tx.inventoryHistory.create({
        data: {
          productId: parseInt(productId),
          action: "STOCK_IN",
          quantity: parseInt(quantity),
          reference,
          notes
        }
      });

      return inventory;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add stock', error });
  }
};

// Adjust stock (ADJUSTMENT)
export const adjustStock = async (req: Request, res: Response) => {
  const { productId, newQuantity, notes } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const currentInventory = await tx.inventory.findUnique({ where: { productId: parseInt(productId) } });
      if (!currentInventory) throw new Error('Inventory not found');
      
      const difference = parseInt(newQuantity) - currentInventory.quantity;

      const inventory = await tx.inventory.update({
        where: { productId: parseInt(productId) },
        data: {
          quantity: parseInt(newQuantity)
        }
      });

      await tx.inventoryHistory.create({
        data: {
          productId: parseInt(productId),
          action: "ADJUSTMENT",
          quantity: difference,
          notes
        }
      });

      return inventory;
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to adjust stock', error: error.message || error });
  }
};

// Get inventory history for a product
export const getInventoryHistory = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  try {
    const history = await prisma.inventoryHistory.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory history', error });
  }
};
