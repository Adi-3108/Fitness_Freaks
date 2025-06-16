"use client";
import { useEffect, useState } from "react";
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
    ],
    lunch: [
      { item: "Grilled chicken breast", calories: 300, img: "/grilled-chicken.jpg" },
      { item: "Brown rice", calories: 220, img: "/brown-rice.jpg" },
      { item: "Broccoli", calories: 80, img: "/broccoli.jpg" },
      { item: "Quinoa", calories: 200, img: "/quinoa.jpg" },
    ],
    dinner: [
      { item: "Salmon", calories: 350, img: "/salmon.jpg" },
      { item: "Sweet potato", calories: 200, img: "/sweet-potato.jpg" },
      { item: "Spinach salad", calories: 90, img: "/spinach-salad.jpg" },
    ],
    snacks: [
      { item: "Greek yogurt", calories: 120, img: "/greek-yogurt.jpg" },
      { item: "Mixed nuts", calories: 180, img: "/mixed-nuts.jpg" },
      { item: "Protein bar", calories: 210, img: "/protein-bar.jpg" },
    ],
  },
  Cutting: {
    breakfast: [
      { item: "Egg white omelette", calories: 120, img: "/boiled-eggs.jpg" },
      { item: "Oatmeal with berries", calories: 180, img: "/oatmeal.jpg" },
    ],
    lunch: [
      { item: "Grilled tofu", calories: 180, img: "/tofu.jpg" },
      { item: "Steamed vegetables", calories: 90, img: "/broccoli.jpg" },
      { item: "Brown rice (small)", calories: 120, img: "/brown-rice.jpg" },
    ],
    dinner: [
      { item: "Baked salmon", calories: 250, img: "/salmon.jpg" },
      { item: "Spinach salad", calories: 90, img: "/spinach-salad.jpg" },
    ],
    snacks: [
      { item: "Fruit bowl", calories: 80, img: "/fruit-bowl.jpg" },
      { item: "Greek yogurt", calories: 100, img: "/greek-yogurt.jpg" },
    ],
  },
  Dieting: {
    breakfast: [
      { item: "Oatmeal with apple", calories: 200, img: "/oatmeal.jpg" },
      { item: "Boiled eggs", calories: 140, img: "/boiled-eggs.jpg" },
    ],
    lunch: [
      { item: "Turkey sandwich", calories: 330, img: "/sandwich.jpg" },
      { item: "Apple", calories: 95, img: "/apple.jpg" },
    ],
    dinner: [
      { item: "Grilled tofu", calories: 180, img: "/tofu.jpg" },
      { item: "Sweet potato", calories: 200, img: "/sweet-potato.jpg" },
    ],
    snacks: [
      { item: "Protein bar", calories: 210, img: "/protein-bar.jpg" },
      { item: "Fruit Bowl", calories: 50, img: "/fruit-bowl.jpg" },
    ],
  },
};

export default function MyDietPage() {
  const [myDiet, setMyDiet] = useState<DietCategory | null>(null);
  const [customMeals, setCustomMeals] = useState<DietPlans | null>(null);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<'success' | 'info' | 'welcome'>('info');
  const router = useRouter();

  useEffect(() => {
    const fetchUserDietPlan = async () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/login");
          return;
        }
        
        const userObj = JSON.parse(userData);
        setUser(userObj);

        try {
          // Fetch user's diet plan from backend
          const response = await fetch(`http://localhost:8080/api/user-diet-plan?userId=${userObj.id}`);
          
          if (response.ok) {
            const dietPlanData = await response.json();
            const category = dietPlanData.dietCategory as DietCategory;
            
            if (category && (category === "Bulking" || category === "Cutting" || category === "Dieting")) {
              setMyDiet(category);
              
              // Parse the meals JSON if it exists
              if (dietPlanData.mealsJson) {
                try {
                  const parsedMeals = JSON.parse(dietPlanData.mealsJson);
                  setCustomMeals({ 
                    Bulking: category === 'Bulking' ? parsedMeals : dietPlans.Bulking,
                    Cutting: category === 'Cutting' ? parsedMeals : dietPlans.Cutting,
                    Dieting: category === 'Dieting' ? parsedMeals : dietPlans.Dieting
                  });
                } catch (e) {
                  console.error('Error parsing meals JSON:', e);
                }
              }
            }
          } else {
            // Fallback to localStorage if backend doesn't have data
            const cat = localStorage.getItem("myDietCategory");
            if (cat === "Bulking" || cat === "Cutting" || cat === "Dieting") {
              setMyDiet(cat);
            }
          }
        } catch (error) {
          console.error('Error fetching diet plan:', error);
          // Fallback to localStorage
          const cat = localStorage.getItem("myDietCategory");
          if (cat === "Bulking" || cat === "Cutting" || cat === "Dieting") {
            setMyDiet(cat);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDietPlan();
  }, [router]);

  if (loading) {
    return (
      <section className="diet-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="heading">Loading...</h2>
      </section>
    );
  }

  if (!myDiet) {
    return (
      <section className="diet-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="heading">No Diet Plan Selected</h2>
        <p style={{ color: '#fff', fontSize: 22, margin: '2rem 0' }}>Please select your diet plan first on the <b>Diet Plan</b> page.</p>
        <button
          style={{ background: '#ebeb4b', color: '#232526', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 20, fontWeight: 600, cursor: 'pointer', margin: '0 8px', transition: 'background 0.2s, transform 0.2s' }}
          onClick={() => router.push('/diet')}
        >
          Go to Diet Plan Selection
        </button>
      </section>
    );
  }

  const meals = customMeals ? customMeals[myDiet!] : dietPlans[myDiet!];
  if (!meals) return null;

  // Count occurrences of each meal across all meal types
  const mealCountMap: Record<string, number> = {};
  Object.values(meals).forEach((mealArr) => {
    mealArr.forEach((item) => {
      mealCountMap[item.item] = (mealCountMap[item.item] || 0) + 1;
    });
  });

  // Checkbox logic
  const handleMealCheck = (mealType: string, index: number) => {
    setCheckedMeals((prev) => ({ ...prev, [`${mealType}-${index}`]: !prev[`${mealType}-${index}`] }));
  };

  // For each meal type, check if all meals are checked
  const isMealTypeChecked = (mealType: string, items: MealItem[]) => {
    return items.length > 0 && items.every((_, idx) => checkedMeals[`${mealType}-${idx}`]);
  };

  const sendDietPlanToEmail = async () => {
    if (!user || !user.email) {
      setDialogMessage("User email not found. Please log in again.");
      setDialogType('info');
      setShowDialog(true);
      return;
    }
    try {
      const cart = Object.entries(meals).flatMap(([mealType, items]) =>
        items.map(item => ({ item: `${mealType}: ${item.item}`, calories: item.calories }))
      );
      const response = await fetch("http://localhost:8080/api/users/send-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, cart })
      });
      if (response.ok) {
        setDialogMessage("Diet plan sent to your email!");
        setDialogType('success');
        setShowDialog(true);
      } else {
        setDialogMessage("Failed to send email. Please try again.");
        setDialogType('info');
        setShowDialog(true);
      }
    } catch (error) {
      setDialogMessage("Error sending email. Please try again.");
      setDialogType('info');
      setShowDialog(true);
    }
  };

  return (
    <>
      <Dialog 
        isOpen={showDialog}
        message={dialogMessage}
        onClose={() => setShowDialog(false)}
        type={dialogType}
      />
      <section className="diet-section">
        <h2 className="heading">My <span>Diet Plan</span> ({myDiet})</h2>
        <div className="meals-container">
          {Object.entries(meals).map(([mealType, items]) => (
            <div key={mealType} className="meal-box" style={isMealTypeChecked(mealType, items) ? { borderColor: '#27ae60', boxShadow: '0 0 0 4px #27ae6040' } : {}}>
              <h3 className="meal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {mealType.toUpperCase()}
                {isMealTypeChecked(mealType, items) && (
                  <span style={{ color: '#27ae60', fontSize: 24, marginLeft: 4 }} title="All meals eaten">✔️</span>
                )}
              </h3>
              <ul className="meal-list">
                {items.map((item, index) => (
                  <li key={index} className="meal-item">
                    <input
                      type="checkbox"
                      checked={!!checkedMeals[`${mealType}-${index}`]}
                      onChange={() => handleMealCheck(mealType, index)}
                      style={{ width: 22, height: 22, marginRight: 16, accentColor: '#27ae60' }}
                    />
                    <img src={item.img} alt={item.item} className="meal-img" />
                    <div className="meal-info">
                      <span className="meal-name">
                        {item.item}
                        {mealCountMap[item.item] > 1 && (
                          <span style={{ color: '#ebeb4b', fontWeight: 700, marginLeft: 8 }}>
                            x{mealCountMap[item.item]}
                          </span>
                        )}
                      </span>
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
        {/* Send Diet Plan to Email Button */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            onClick={sendDietPlanToEmail}
            style={{
              background: '#ebeb4b',
              color: '#232526',
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              margin: '0 8px',
              transition: 'background 0.2s, transform 0.2s',
            }}
          >
            Send Diet Plan to Email
          </button>
        </div>
      </section>
    </>
  );
} 