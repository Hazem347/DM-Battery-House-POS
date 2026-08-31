import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer', error });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const { name, email, phone, address } = req.body;
  try {
    const newCustomer = await prisma.customer.create({
      data: { name, email, phone, address }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create customer', error });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, address }
    });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer', error });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error });
  }
};
