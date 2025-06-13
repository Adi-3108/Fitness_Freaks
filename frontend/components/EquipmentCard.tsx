"use client";
import Image from "next/image";
import { Equipment } from "../types/equipment";

interface Props { eq: Equipment; onAdd: (eq: Equipment) => void; }

export default function EquipmentCard({ eq, onAdd }: Props) {
  return (
    <div className="border p-4 rounded shadow">
      <Image src={eq.imageUrl} alt={eq.name} width={400} height={300} />
      <h4 className="mt-2">{eq.name}</h4>
      <p>₹{eq.price}</p>
      <button onClick={() => onAdd(eq)}>Add to Cart</button>
    </div>
  );
}
