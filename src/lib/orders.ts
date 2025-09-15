export interface StoredOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  canteenName?: string;
}

export interface StoredOrder {
  id: string; // token or order id
  date: string; // ISO date
  time: string; // human readable time
  items: StoredOrderItem[];
  total: number;
  status: 'completed' | 'in-progress' | 'cancelled';
  canteen: string;
}

const KEY = 'ce.orders.v1';

export function loadOrders(): StoredOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data as StoredOrder[];
    return [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: StoredOrder[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function addOrder(order: StoredOrder) {
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
}
