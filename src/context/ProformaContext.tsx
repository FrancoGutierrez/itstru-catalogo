'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CustomerInfo, Product, ProformaItem } from '@/types';

interface ProformaContextType {
  items: ProformaItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearProforma: () => void;
  includeIgv: boolean;
  setIncludeIgv: (include: boolean) => void;
  customer: CustomerInfo;
  updateCustomer: (data: Partial<CustomerInfo>) => void;
  totalItems: number;
  subtotal: number;
  igv: number;
  total: number;
  lastAddedProduct: Product | null;
}

const DEFAULT_CUSTOMER: CustomerInfo = {
  name: '',
  docType: 'RUC',
  docNumber: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

const ProformaContext = createContext<ProformaContextType | undefined>(undefined);

export function ProformaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProformaItem[]>([]);
  const [includeIgv, setIncludeIgv] = useState<boolean>(true);
  const [customer, setCustomer] = useState<CustomerInfo>(DEFAULT_CUSTOMER);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar estado inicial desde localStorage al montar
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('proforma_items_v2');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedIgv = localStorage.getItem('proforma_igv_v2');
      if (savedIgv !== null) {
        setIncludeIgv(JSON.parse(savedIgv));
      }
      const savedCustomer = localStorage.getItem('proforma_customer_v2');
      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
      }
    } catch (e) {
      console.error('Error al cargar proforma desde localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('proforma_items_v2', JSON.stringify(items));
      localStorage.setItem('proforma_igv_v2', JSON.stringify(includeIgv));
      localStorage.setItem('proforma_customer_v2', JSON.stringify(customer));
    } catch (e) {
      console.error('Error al guardar proforma en localStorage:', e);
    }
  }, [items, includeIgv, customer, isLoaded]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: Number((newQty * updated[existingIndex].unitPrice).toFixed(2)),
        };
        return updated;
      } else {
        const newItem: ProformaItem = {
          product,
          quantity,
          unitPrice: Number(product.price),
          subtotal: Number((quantity * product.price).toFixed(2)),
        };
        return [...prevItems, newItem];
      }
    });

    setLastAddedProduct(product);
    // Limpiar toast luego de 3 segundos
    setTimeout(() => {
      setLastAddedProduct((curr) => (curr?.id === product.id ? null : curr));
    }, 3000);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: Number((quantity * item.unitPrice).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearProforma = () => {
    setItems([]);
  };

  const updateCustomer = (data: Partial<CustomerInfo>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  // Cálculos automáticos en tiempo real
  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + item.subtotal, 0);
    return Number(sum.toFixed(2));
  }, [items]);

  const igv = useMemo(() => {
    if (!includeIgv) return 0;
    return Number((subtotal * 0.18).toFixed(2));
  }, [subtotal, includeIgv]);

  const total = useMemo(() => {
    return Number((subtotal + igv).toFixed(2));
  }, [subtotal, igv]);

  return (
    <ProformaContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearProforma,
        includeIgv,
        setIncludeIgv,
        customer,
        updateCustomer,
        totalItems,
        subtotal,
        igv,
        total,
        lastAddedProduct,
      }}
    >
      {children}
    </ProformaContext.Provider>
  );
}

export function useProforma() {
  const context = useContext(ProformaContext);
  if (!context) {
    throw new Error('useProforma debe utilizarse dentro de un ProformaProvider');
  }
  return context;
}
