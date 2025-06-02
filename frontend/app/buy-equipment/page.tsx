"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function BuyEquipment() {
  const [cartItems, setCartItems] = useState<{ name: string; price: number }[]>([])
  const [cartVisible, setCartVisible] = useState(false)
  const [total, setTotal] = useState(0)

  const showcartitems = () => {
    setCartVisible(true)
  }

  const closecartitems = () => {
    setCartVisible(false)
  }

  const addtocart = (itemName: string, itemPrice: number) => {
    const newItem = { name: itemName, price: itemPrice }
    setCartItems([...cartItems, newItem])
    setTotal((prevTotal) => prevTotal + itemPrice)
  }

  const removeFromCart = (index: number) => {
    const newCartItems = [...cartItems]
    const removedItem = newCartItems.splice(index, 1)[0]
    setCartItems(newCartItems)
    setTotal((prevTotal) => prevTotal - removedItem.price)
  }

  return (
    <div className="BUY" id="BUY">
      <div id="header">
        <Link href="/">
          <Image src="/logo.jpeg.jpg" id="logoimage" alt="Logo" width={60} height={60} />
        </Link>
        <Link href="/" className="logo">
          Fitness <span>Freaks</span>
        </Link>
        <h6 className="logo">
          Buy <span>Equipments</span>
        </h6>
        <button id="cartlink" onClick={showcartitems} className="cartlink">
          {/* <Image src="/cartimage.png" id="cartimage" alt="Cart" width={40} height={40} /> */}
          <p style={{ display: "inline" }}>Cart (</p>
          <p style={{ display: "inline" }} id="itemcount">
            {cartItems.length}
          </p>
          <p style={{ display: "inline" }}>)</p>
        </button>
      </div>

      <div className="BUY-content">
        <div className="row">
          <Image src="/HANDGRIPPER.webp" alt="Hand Gripper" width={400} height={300} />
          <h4>Hand Gripper </h4>
          <h4>₹125</h4>
          <button className="addtocart" onClick={() => addtocart("Hand Gripper", 125)}>
            Add to Cart
          </button>
        </div>
        <div className="row">
          <Image src="/dumbbel.webp" alt="Dumbbells" width={400} height={300} />
          <h4>Dumbbells (3kg * 2) </h4>
          <h4>₹369</h4>
          <button className="addtocart" onClick={() => addtocart("Dumbbells", 369)}>
            Add to Cart
          </button>
        </div>
        <div className="row">
          <Image src="/pushupbar.jpg" alt="Push Up Bar" width={400} height={300} />
          <h4>Push Up Bar</h4>
          <h4>₹349</h4>
          <button className="addtocart" onClick={() => addtocart("Push Up Bar", 349)}>
            Add to Cart
          </button>
        </div>
        <div className="row">
          <Image src="/kettleball.jpg" alt="Kettlebell" width={400} height={300} />
          <h4>Kettlebell</h4>
          <h4>₹1519</h4>
          <button className="addtocart" onClick={() => addtocart("Kettlebell", 1519)}>
            Add to Cart
          </button>
        </div>
        <div className="row">
          <Image src="/tummytrimmer.jpg" alt="Tummy Trimmer" width={400} height={300} />
          <h4>Tummy Trimmer</h4>
          <h4>₹999</h4>
          <button className="addtocart" onClick={() => addtocart("Tummy Trimmer", 999)}>
            Add to Cart
          </button>
        </div>
        <div className="row">
          <Image src="/tredmill.jpg" alt="Treadmill" width={400} height={300} />
          <h4>Treadmill</h4>
          <h4>₹24,999</h4>
          <button className="addtocart" onClick={() => addtocart("Treadmill", 24999)}>
            Add to Cart
          </button>
        </div>
      </div>

      <div id="cartsection" className="cartsection" style={{ display: cartVisible ? "block" : "none" }}>
        <button onClick={closecartitems} className="close">
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
        <h3 id="totalprice">{cartItems.length > 0 ? `Total Price - ₹${total}` : "Your Cart Is Empty"}</h3>
        <br />
        <br />
        <button id="placeorder" style={{ display: cartItems.length > 0 ? "block" : "none" }}>
          Place Order
        </button>
      </div>
    </div>
  )
}
