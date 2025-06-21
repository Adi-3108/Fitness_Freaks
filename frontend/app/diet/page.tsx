"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dialog from "../components/Dialog";

type MealItem = { item: string; calories: number; img: string };
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
type DietCategory = 'Bulking' | 'Cutting' | 'Dieting';
type DietPlans = {
  [key in DietCategory]: {
    [key in MealType]: MealItem[];
  };
};

type User = {
  email: string;
  username: string;
  phoneNumber?: string;
  plan?: string;
  address?: string;
  createdAt?: string;
  id?: string | number;
};

const dietPlans: DietPlans = {
  Bulking: {
    breakfast: [
      { item: "Oatmeal with banana & peanut butter", calories: 350, img: "/oatmeal.jpg" },
      { item: "Boiled eggs", calories: 140, img: "/boiled-eggs.jpg" },
      { item: "Protein smoothie", calories: 250, img: "/protein-smoothie.jpg" },
      { item: "Greek yogurt parfait", calories: 180, img: "/greek-yogurt.jpg" },
    ],
    lunch: [
      { item: "Grilled chicken breast", calories: 300, img: "/grilled-chicken.jpg" },
      { item: "Brown rice", calories: 220, img: "/brown-rice.jpg" },
      { item: "Quinoa", calories: 200, img: "/quinoa.jpg" },
      { item: "Sweet potato", calories: 200, img: "/sweet-potato.jpg" },
    ],
    dinner: [
      { item: "Salmon", calories: 350, img: "/salmon.jpg" },
      { item: "Steak with brown rice", calories: 400, img: "/brown-rice.jpg" },
      { item: "Paneer curry", calories: 320, img: "/tofu.jpg" },
      { item: "Chicken stir fry", calories: 340, img: "/grilled-chicken.jpg" },
    ],
    snacks: [
      { item: "Greek yogurt", calories: 120, img: "/greek-yogurt.jpg" },
      { item: "Mixed nuts", calories: 180, img: "/mixed-nuts.jpg" },
      { item: "Peanut butter sandwich", calories: 250, img: "/sandwich.jpg" },
    ],
  },
  Cutting: {
    breakfast: [
      { item: "Egg white omelette", calories: 120, img: "/boiled-eggs.jpg" },
      { item: "Oatmeal with berries", calories: 180, img: "/oatmeal.jpg" },
      { item: "Green smoothie", calories: 110, img: "/protein-smoothie.jpg" },
    ],
    lunch: [
      { item: "Grilled tofu", calories: 180, img: "/tofu.jpg" },
      { item: "Steamed vegetables", calories: 90, img: "/broccoli.jpg" },
      { item: "Chicken salad", calories: 210, img: "/grilled-chicken.jpg" },
      { item: "Lentil soup", calories: 160, img: "/quinoa.jpg" },
    ],
    dinner: [
      { item: "Baked salmon", calories: 250, img: "/salmon.jpg" },
      { item: "Spinach salad", calories: 90, img: "/spinach-salad.jpg" },
      { item: "Vegetable stir fry", calories: 140, img: "/broccoli.jpg" },
    ],
    snacks: [
      { item: "Fruit bowl", calories: 80, img: "/fruit-bowl.jpg" },
      { item: "Greek yogurt", calories: 100, img: "/greek-yogurt.jpg" },
      { item: "Carrot sticks", calories: 40, img: "/carrot.jpg" },
    ],
  },
  Dieting: {
    breakfast: [
      { item: "Oatmeal with apple", calories: 200, img: "/oatmeal.jpg" },
      { item: "Boiled eggs", calories: 140, img: "/boiled-eggs.jpg" },
      { item: "Fruit smoothie", calories: 120, img: "/protein-smoothie.jpg" },
    ],
    lunch: [
      { item: "Turkey sandwich", calories: 330, img: "/sandwich.jpg" },
      { item: "Apple", calories: 95, img: "/apple.jpg" },
      { item: "Vegetable soup", calories: 110, img: "/quinoa.jpg" },
      { item: "Brown rice", calories: 220, img: "/brown-rice.jpg" },
    ],
    dinner: [
      { item: "Grilled tofu", calories: 180, img: "/tofu.jpg" },
      { item: "Sweet potato", calories: 200, img: "/sweet-potato.jpg" },
      { item: "Vegetable curry", calories: 160, img: "/broccoli.jpg" },
    ],
    snacks: [
      { item: "Protein bar", calories: 210, img: "/protein-bar.jpg" },
      { item: "Fruit Bowl", calories: 50, img: "/fruit-bowl.jpg" },
      { item: "Carrot sticks", calories: 40, img: "/carrot.jpg" },
    ],
  },
};

const CALORIE_LIMIT = 2000;

export default function DietPlan() {
  const [selectedCategory, setSelectedCategory] = useState<DietCategory>("Bulking");
  const [user, setUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<'success' | 'info'>('info');
  const router = useRouter();

  const setAsMyDietPlan = async () => {
    if (!user || !user.id) {
      setDialogMessage("Please log in to set your diet plan!");
      setDialogType('info');
      setShowDialog(true);
      return;
    }

    try {
      // Prepare the diet plan data
      const dietPlanData = {
        userId: user.id,
        dietCategory: selectedCategory,
        mealsJson: JSON.stringify(dietPlans[selectedCategory])
      };

      // Send to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-diet-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietPlanData)
      });

      if (response.ok) {
        // Also save to localStorage for immediate UI feedback
        localStorage.setItem("myDietCategory", selectedCategory);
        setDialogMessage(`Your ${selectedCategory} diet plan has been saved successfully!`);
        setDialogType('success');
        setShowDialog(true);
      } else {
        const errorData = await response.json();
        setDialogMessage(`Failed to save diet plan: ${errorData.message || 'Unknown error'}`);
        setDialogType('info');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error saving diet plan:', error);
      setDialogMessage('Failed to save diet plan. Please try again.');
      setDialogType('info');
      setShowDialog(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
      } else {
        setUser(JSON.parse(userData));
      }
    }
  }, [router]);

  const meals = dietPlans[selectedCategory];

  if (!user) return null;

  return (
    <>
      <Dialog isOpen={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} type={dialogType} />
      <section className="diet-section">
        <h2 className="heading">DIET <span>PLAN</span></h2>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <button
            style={{
              background: '#ebeb4b',
              color: '#232526',
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontSize: 20,
              fontWeight: 600,
              cursor: 'pointer',
              margin: '0 8px',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onClick={setAsMyDietPlan}
          >
            Set as My Diet Plan
          </button>
          <span style={{ color: '#ebeb4b', marginLeft: 12,fontSize:18 }}>
            (Currently selected: <b>{selectedCategory}</b>)
          </span>
        </div>

        <div className="day-selector">
          {Object.keys(dietPlans).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as DietCategory)}
              className={`day-btn ${selectedCategory === category ? "active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="meals-container">
          {Object.entries(meals).map(([mealType, items]) => (
            <div key={mealType} className="meal-box">
              <h3 className="meal-title">{mealType.toUpperCase()}</h3>
              <ul className="meal-list">
                {items.map((item, index) => (
                  <li key={index} className="meal-item">
                    <img src={item.img} alt={item.item} className="meal-img" />
                    <div className="meal-info">
                      <span className="meal-name">{item.item}</span>
                    </div>
                    <div>
                      <span className="meal-calories">{item.calories} kcal</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <style jsx>{`
          :root {
            --gradient-start: #232526;
            --gradient-middle: #414345;
            --gradient-end: #000;
            --text-color: #ebeb4b;
          }

          .diet-section {
            min-height: 100vh;
            padding: 2rem 1rem;
            max-width: 1200px;
            margin: auto;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end));
            color: var(--text-color);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .heading {
            font-size: 3.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .heading span {
            color: #ebeb4b;
          }

          .day-selector {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin: 1.5rem 0;
            flex-wrap: wrap;
          }

          .day-btn {
            background: #181818;
            color: var(--text-color);
            padding: 0.75rem 2rem;
            border: 2px solid var(--text-color);
            border-radius: 12px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: 600;
            transition: background 0.2s, color 0.2s, transform 0.2s;
          }

          .day-btn:hover {
            background: var(--text-color);
            color: #000;
            transform: scale(1.05);
          }

          .day-btn.active {
            background: var(--text-color);
            color: #000;
          }

          .meals-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            width: 100%;
            max-width: 900px;
            margin: 2rem auto 0 auto;
          }

          .meal-box {
            background: #181818;
            padding: 1.5rem;
            border: 2px solid var(--text-color);
            border-radius: 12px;
            min-height: 420px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
          }

          .meal-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(235, 235, 75, 0.3);
          }

          .meal-title {
            font-size: 2rem;
            font-weight: 600;
            color: #ebeb4b;
            border-bottom: 1px solid var(--text-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            text-transform: uppercase;
          }

          .meal-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .meal-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .meal-img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #333;
            display: block;
            margin: 0 auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            background: #222;
            max-width: 100%;
            max-height: 100%;
          }

          .meal-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          }

          .meal-name {
            font-size: 1.2rem;
            font-weight: 500;
            color: #ebeb4b;
          }

          .meal-calories {
            font-size: 1.1rem;
            color: #ccc;
          }

          @media (max-width: 900px) {
            .meals-container {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
          }

          @media (max-width: 768px) {
            .diet-section {
              padding: 1rem;
            }

            .heading {
              font-size: 2rem;
            }

            .day-selector {
              gap: 1rem;
              margin: 1rem 0;
            }

            .day-btn {
              padding: 0.5rem 1.5rem;
              font-size: 1rem;
            }

            .meal-box {
              padding: 1rem;
              min-height: 320px;
            }

            .meal-title {
              font-size: 1.2rem;
            }

            .meal-img {
              width: 70px;
              height: 70px;
            }

            .meal-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
          }

          @media (max-width: 480px) {
            .heading {
              font-size: 1.3rem;
            }

            .meal-img {
              width: 50px;
              height: 50px;
            }
          }
        `}</style>
      </section>
    </>
  );
}