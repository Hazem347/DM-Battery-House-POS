import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { formatCurrency } from '../utils/currency';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

// Receipt PDF Generation
export const generateReceipt = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        customer: true,
        saleItems: {
          include: { product: true }
        }
      }
    });

    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${sale.receiptNumber}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('DM Battery House', { align: 'center' });
    doc.fontSize(12).text('Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Receipt No: ${sale.receiptNumber}`);
    doc.text(`Date: ${sale.createdAt.toLocaleString()}`);
    doc.text(`Cashier: ${sale.user.name}`);
    if (sale.customer) {
      doc.text(`Customer: ${sale.customer.name}`);
    }
    doc.moveDown();

    doc.text('---------------------------------------------------------');
    sale.saleItems.forEach((item) => {
      doc.text(`${item.product.name} x ${item.quantity}  -  ${formatCurrency(item.totalPrice)}`);
    });
    doc.text('---------------------------------------------------------');

    doc.moveDown();
    doc.text(`Total Amount: ${formatCurrency(sale.totalAmount)}`, { align: 'right' });
    doc.text(`Discount: ${formatCurrency(sale.discount)}`, { align: 'right' });
    doc.text(`Tax: ${formatCurrency(sale.tax)}`, { align: 'right' });
    doc.fontSize(12).text(`Final Amount: ${formatCurrency(sale.finalAmount)}`, { align: 'right', bold: true } as any);
    doc.moveDown();
    doc.fontSize(10).text(`Payment Method: ${sale.paymentMethod}`, { align: 'right' });
    doc.text(`Amount Paid: ${formatCurrency(sale.amountPaid)}`, { align: 'right' });
    doc.text(`Change: ${formatCurrency(sale.changeAmount)}`, { align: 'right' });

    doc.moveDown(2);
    doc.text('Thank you for your business!', { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate receipt', error });
  }
};

// Excel Export for Sales
export const exportSalesToExcel = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const data = sales.map((sale) => ({
      'Receipt No': sale.receiptNumber,
      'Date': sale.createdAt.toLocaleDateString(),
      'Time': sale.createdAt.toLocaleTimeString(),
      'Customer': sale.customer ? sale.customer.name : 'Walk-in',
      'Cashier': sale.user.name,
      'Total Amount': sale.totalAmount,
      'Discount': sale.discount,
      'Tax': sale.tax,
      'Final Amount': sale.finalAmount,
      'Payment Method': sale.paymentMethod,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sales');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export sales', error });
  }
};
