// frontend/types/equipment.ts

export interface Equipment {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  name: string;
  price: number;
}

export interface Order {
  id: number;
  placedAt: string;
  items: OrderItem[];
}
