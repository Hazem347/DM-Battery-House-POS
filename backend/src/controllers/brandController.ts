import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brands', error });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const brand = await prisma.brand.create({
      data: { name, description }
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create brand', error });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update brand', error });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.brand.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete brand', error });
  }
};
