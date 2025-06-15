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

export async function sendWorkoutPlan(email: string, category: string): Promise<any> {
  const res = await fetch(`${BASE}/api/workout-plans/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, category }),
  });
  if (!res.ok) throw new Error("Failed to send workout plan");
  return res.json();
}

export async function sendDietPlan(email: string, category: string): Promise<any> {
  const res = await fetch(`${BASE}/api/diet-plans/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, category }),
  });
  if (!res.ok) throw new Error("Failed to send diet plan");
  return res.json();
}