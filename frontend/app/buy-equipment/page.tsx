"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Equipment, OrderItem } from "../../types/equipment";
import { fetchEquipment, placeOrder } from "../../services/api";

export default function BuyEquipmentPage() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    fetchEquipment()
      .then(setEquipment)
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));


  }, [router]);

  const addToCart = (eq: Equipment) => {
    setCartItems((prev) => [...prev, { name: eq.name, price: eq.price }]);
  };

  const removeFromCart = (i: number) =>
    setCartItems((prev) => prev.filter((_, idx) => idx !== i));

  const total = cartItems.reduce((s, x) => s + x.price, 0);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        throw new Error("Please log in to place an order");
      }

      const orderData = {
        user: { id: user.id },
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
        })),
      };

      const order = await placeOrder(orderData);
      alert(`Order #${order.id} placed!`);
      setCartItems([]);
      setCartVisible(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="BUY" id="BUY">
      <div id="header">
        <Link href="/">
          <Image
            src="/logo.jpeg.jpg"
            id="logoimage"
            alt="Logo"
            width={60}
            height={60}
          />
        </Link>
        <Link href="/" className="logo">
          Fitness <span>Freaks</span>
        </Link>
        <h6 className="logo">
          Buy <span>Equipments</span>
        </h6>
        <button
          id="cartlink"
          onClick={() => setCartVisible(true)}
          className="cartlink"
        >
          <img src="/cartimage.png" id="cartimage" alt="" />
          <p style={{ display: "inline" }}>Cart (</p>
          <p style={{ display: "inline" }} id="itemcount">
            {cartItems.length}
          </p>
          <p style={{ display: "inline" }}>)</p>
        </button>
      </div>

      <div className="BUY-content">
        {equipment.map((eq) => (
          <div key={eq.id} className="row">
            <Image src={eq.imageUrl} alt={eq.name} width={400} height={300} />
            <h4>{eq.name}</h4>
            <h4>₹{eq.price}</h4>
            <button className="addtocart" onClick={() => addToCart(eq)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div
        id="cartsection"
        className="cartsection"
        style={{ display: cartVisible ? "block" : "none" }}
      >
        <button onClick={() => setCartVisible(false)} className="close">
          Close
        </button>
        <h2>Your Cart</h2>
        <ul id="list">
          {cartItems.map((item, index) => (
            <li key={index} style={{ fontSize: "18px" }}>
              {item.name} ₹{item.price}
              <button
                onClick={() => removeFromCart(index)}
                style={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  color: "var(--main-color)",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <br />
        <br />
        <h3 id="totalprice">
          {cartItems.length > 0
            ? `Total Price - ₹${total}`
            : "Your Cart Is Empty"}
        </h3>
        <br />
        <br />
        <button
          id="placeorder"
          style={{ display: cartItems.length > 0 ? "block" : "none" }}
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
