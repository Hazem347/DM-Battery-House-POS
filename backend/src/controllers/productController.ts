import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        inventory: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        category: true,
        brand: true,
        inventory: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name, sku, barcode, description, capacity, voltage, warranty,
      purchasePrice, salePrice, minStockLevel, images, status, categoryId, brandId
    } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name, sku, barcode, description, capacity, voltage, warranty,
        purchasePrice, salePrice, minStockLevel, images, status, categoryId, brandId,
        inventory: {
          create: {
            quantity: 0
          }
        }
      },
      include: {
        inventory: true
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id as string) },
      data: req.body
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id as string) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
