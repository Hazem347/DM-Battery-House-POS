import { db, storage, auth } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, Timestamp, runTransaction, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper to convert Firestore docs to objects with ID
const mapDoc = (docSnap: any) => {
  const data = docSnap.data();
  return { 
    id: docSnap.id, 
    ...data,
    // Convert Firestore Timestamp to ISO string if it exists
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
  };
};

// --- Product API ---
export const getProducts = async () => {
  const q = query(collection(db, 'products'));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(mapDoc);
  // Sort descending by createdAt locally to avoid Firestore index requirement
  return products.sort((a: any, b: any) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getProductById = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return mapDoc(docSnap);
  throw new Error("Product not found");
};

export const createProduct = async (productData: any) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    inventory: { quantity: 10 }, // Default starting stock
    createdAt: Timestamp.now()
  });
  return { id: docRef.id, ...productData };
};

export const updateProduct = async (id: string | number, productData: any) => {
  const docRef = doc(db, 'products', String(id));
  await updateDoc(docRef, productData);
  return { id, ...productData };
};

export const deleteProduct = async (id: string | number) => {
  await deleteDoc(doc(db, 'products', String(id)));
  return { success: true };
};

// --- Inventory API ---
export const getInventory = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(mapDoc).map(p => ({
    productId: p.id,
    quantity: p.inventory?.quantity || 0,
    minStockLevel: p.minStockLevel || 0
  }));
};

// --- Sale API ---
export const getSales = async (cashierId?: string) => {
  const q = cashierId 
    ? query(collection(db, 'sales'), where('cashierId', '==', cashierId))
    : query(collection(db, 'sales'));
  const snapshot = await getDocs(q);
  const sales = snapshot.docs.map(mapDoc);
  return sales.sort((a: any, b: any) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const createSale = async (saleData: any) => {
  const saleRef = doc(collection(db, 'sales'));
  const receiptNumber = 'REC-' + Date.now();
  
  await runTransaction(db, async (transaction) => {
    // 1. Verify stock for all items
    const productRefs = saleData.items.map((item: any) => doc(db, 'products', String(item.productId)));
    const productDocs = await Promise.all(productRefs.map((ref: any) => transaction.get(ref)));
    
    productDocs.forEach((pDoc: any, index) => {
      if (!pDoc.exists()) throw new Error(`Product ${saleData.items[index].productId} not found`);
      const data = pDoc.data();
      const newStock = (data.inventory?.quantity || 0) - saleData.items[index].quantity;
      if (newStock < 0) throw new Error(`Insufficient stock for ${data.name}`);
      
      transaction.update(pDoc.ref, { 'inventory.quantity': newStock });
    });

    // 2. Create Sale Record
    const finalSaleData = {
      ...saleData,
      receiptNumber,
      cashierId: auth.currentUser?.uid || null,
      createdAt: Timestamp.now()
    };
    
    transaction.set(saleRef, finalSaleData);
  });
  
  return { id: saleRef.id, receiptNumber, ...saleData };
};

// --- Customer API ---
export const getCustomers = async () => {
  const snapshot = await getDocs(collection(db, 'customers'));
  return snapshot.docs.map(mapDoc);
};

export const createCustomer = async (customerData: any) => {
  const docRef = await addDoc(collection(db, 'customers'), { ...customerData, createdAt: Timestamp.now() });
  return { id: docRef.id, ...customerData };
};

export const updateCustomer = async (id: string | number, customerData: any) => {
  const docRef = doc(db, 'customers', String(id));
  await updateDoc(docRef, customerData);
  return { id, ...customerData };
};

export const deleteCustomer = async (id: string | number) => {
  await deleteDoc(doc(db, 'customers', String(id)));
  return { success: true };
};

// --- Users API ---
export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(mapDoc);
};

export const createUser = async (data: any) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user');
  }
  return response.json();
};

export const updateUser = async (id: string, data: any) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user');
  }
  return response.json();
};

// --- Categories API ---
export const getCategories = async () => {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(mapDoc);
};

export const createCategory = async (data: any) => {
  const docRef = await addDoc(collection(db, 'categories'), { ...data, createdAt: Timestamp.now() });
  return { id: docRef.id, ...data };
};

export const updateCategory = async (id: string, data: any) => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteCategory = async (id: string | number) => {
  await deleteDoc(doc(db, 'categories', String(id)));
  return { success: true };
};

// --- Brands API ---
export const getBrands = async () => {
  const snapshot = await getDocs(collection(db, 'brands'));
  return snapshot.docs.map(mapDoc);
};

export const createBrand = async (data: any) => {
  const docRef = await addDoc(collection(db, 'brands'), { ...data, createdAt: Timestamp.now() });
  return { id: docRef.id, ...data };
};

export const updateBrand = async (id: string, data: any) => {
  const docRef = doc(db, 'brands', id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteBrand = async (id: string | number) => {
  await deleteDoc(doc(db, 'brands', String(id)));
  return { success: true };
};

// --- Settings API ---
export const getSettings = async () => {
  const docRef = doc(db, 'settings', 'store_config');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return mapDoc(docSnap);
  return null;
};

export const updateSettings = async (data: any) => {
  const docRef = doc(db, 'settings', 'store_config');
  // Use setDoc with merge: true to create or update
  await setDoc(docRef, data, { merge: true });
  return data;
};

// --- Upload API ---
export const uploadImage = async (file: File) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `products/images/${fileName}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return { url: downloadURL };
  } catch (error: any) {
    console.error("Firebase Storage Upload Error [FULL STACK]:", error);
    throw new Error(`Storage Error: ${error.message || "Failed to upload image"}`);
  }
};

// --- Inquiries API ---
export const getInquiries = async () => {
  const q = query(collection(db, 'inquiries'));
  const snapshot = await getDocs(q);
  const inquiries = snapshot.docs.map(mapDoc);
  return inquiries.sort((a: any, b: any) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const createInquiry = async (data: any) => {
  const docRef = await addDoc(collection(db, 'inquiries'), { ...data, createdAt: Timestamp.now() });
  return { id: docRef.id, ...data };
};

export const updateInquiry = async (id: string, data: any) => {
  const docRef = doc(db, 'inquiries', id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
};

export const deleteInquiry = async (id: string) => {
  const docRef = doc(db, 'inquiries', id);
  await deleteDoc(docRef);
};

export default {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getInventory, getSales, createSale,
  getCustomers, createCustomer, updateCustomer, deleteCustomer,
  getUsers, createUser, updateUser,
  getCategories, createCategory, updateCategory, deleteCategory,
  getBrands, createBrand, updateBrand, deleteBrand, 
  getSettings, updateSettings, uploadImage,
  getInquiries, createInquiry, updateInquiry, deleteInquiry
};
