import { Equipment, OrderItem, Order } from "../types/equipment";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchEquipment(): Promise<Equipment[]> {
  const res = await fetch(`${BASE}/api/equipment`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export const placeOrder = async (orderData: any) => {
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to place order');
  }

  return response.json();
};