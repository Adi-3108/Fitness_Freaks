"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Equipment, OrderItem } from "../../types/equipment";
import { fetchEquipment } from "../../services/api";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const calculateExpectedDelivery = (orderDate: string) => {
  if (!orderDate) return "";
  const date = new Date(orderDate);
  date.setDate(date.getDate() + 4); // Add 5 days
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const getDeliveryStatus = (orderDate: string) => {
  if (!orderDate) return "";
  const orderDateTime = new Date(orderDate);
  const expectedDate = new Date(orderDateTime);
  expectedDate.setDate(expectedDate.getDate() + 4);
  const currentDate = new Date();

  if (currentDate >= expectedDate) {
    return "Delivered ✅";
  } else {
    return `Expected Delivery: ${expectedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }
};
export default function BuyEquipmentPage() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);

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
      if (!user.id) throw new Error("Please log in to place an order");

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

    // Store cart items in localStorage for after payment confirmation
    localStorage.setItem("equipmentCart", JSON.stringify(cartItems));
    localStorage.setItem("equipmentUserEmail", user.email);
    localStorage.setItem("equipmentUserId", user.id);
    
    // Redirect to payment page with cart total
    router.push(`/payments?amount=${total}&email=${user.email}`);
  };

  const fetchUserOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `http://localhost:8080/api/orders/user/${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setUserOrders(data);
      setOrdersVisible(true);
    } catch (error: any) {
      alert(error.message || "Failed to load your orders.");
      console.error("Error fetching orders:", error);
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

        <button
          className="yourorders"
          onClick={fetchUserOrders}
          id="yourorders"
        >
          <p style={{ display: "inline" }}>Your Orders</p>
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

      {/* 🛒 CART SECTION */}
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
        <h3 id="totalprice">
          {cartItems.length > 0
            ? `Total Price - ₹${total}`
            : "Your Cart Is Empty"}
        </h3>
        <br />
        <button
          id="placeorder"
          style={{ display: cartItems.length > 0 ? "block" : "none" }}
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      {/* 📦 ✨ YOUR ORDERS SECTION - styled like cart */}
      {ordersVisible && (
        <div className="cartsection" style={{ display: "block" }}>
          <button onClick={() => setOrdersVisible(false)} className="close">
            Close
          </button>
          <h2>Your Orders</h2>
          {userOrders.length === 0 ? (
            <p>No past orders found.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {userOrders.map((order, index) => (
                // <li key={order.id} style={{ marginBottom: "20px", fontSize: "18px" }}>
                //   <strong>Order {index + 1} </strong>
                //   <span style={{ color: "#666" }}>
                //     ({formatDate(order.placedAt)})
                //   </span>
                //   <ul style={{ marginLeft: "15px", marginTop: "5px" }}>
                //     {order.items.map((item: any, index: number) => (
                //       <li key={index}>
                //         {item.name} - ₹{item.price}
                //       </li>
                //     ))}
                //   </ul>
                // </li>
                // <li
                //   key={order.id}
                //   style={{ marginBottom: "20px", fontSize: "18px" }}
                // >
                //   <strong>Order {index + 1} </strong>
                //   <div style={{ color: "#666", marginTop: "5px" }}>
                //     Ordered: {formatDate(order.placedAt)}
                //   </div>
                //   <div
                //     style={{
                //       color: "#4CAF50",
                //       marginTop: "5px",
                //       fontSize: "16px",
                //     }}
                //   >
                //     Expected Delivery:{" "}
                //     {calculateExpectedDelivery(order.placedAt)}
                //   </div>
                //   <ul style={{ marginLeft: "15px", marginTop: "10px" }}>
                //     {order.items.map((item: any, index: number) => (
                //       <li key={index}>
                //         {item.name} - ₹{item.price}
                //       </li>
                //     ))}
                //   </ul>
                // </li>
                <li
                  key={order.id}
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <strong>Order {index + 1} </strong>
                  <div style={{ color: "#666", marginTop: "5px" }}>
                    Ordered: {formatDate(order.placedAt)}
                  </div>
                  <div
                    style={{
                      color: "#4CAF50",
                      marginTop: "5px",
                      fontSize: "16px",
                    }}
                  >
                    {getDeliveryStatus(order.placedAt)}
                  </div>
                  <ul style={{ marginLeft: "15px", marginTop: "10px" }}>
                    {order.items.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name} - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
