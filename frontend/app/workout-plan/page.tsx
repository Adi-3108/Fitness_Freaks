"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './workout-plan.css';

const WorkoutPlan = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const { email } = JSON.parse(userData);
        setEmail(email);
      }
    }
  }, []);

  const workoutPlans = [
    {
      name: 'ABS',
      exercises: [
        { name: 'Crunches', sets: 3, reps: 15 },
        { name: 'Plank', sets: 3, duration: '30 seconds' },
        { name: 'Russian Twists', sets: 3, reps: 20 },
        { name: 'Leg Raises', sets: 3, reps: 12 }
      ]
    },
    {
      name: 'CHEST',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 15 },
        { name: 'Dumbbell Press', sets: 3, reps: 12 },
        { name: 'Cable Flyes', sets: 3, reps: 15 },
        { name: 'Incline Bench Press', sets: 3, reps: 10 }
      ]
    },
    {
      name: 'ARM',
      exercises: [
        { name: 'Bicep Curls', sets: 3, reps: 12 },
        { name: 'Tricep Dips', sets: 3, reps: 15 },
        { name: 'Hammer Curls', sets: 3, reps: 12 },
        { name: 'Tricep Pushdowns', sets: 3, reps: 15 }
      ]
    },
    {
      name: 'LEG',
      exercises: [
        { name: 'Squats', sets: 3, reps: 15 },
        { name: 'Lunges', sets: 3, reps: 12 },
        { name: 'Leg Press', sets: 3, reps: 12 },
        { name: 'Calf Raises', sets: 3, reps: 20 }
      ]
    },
    {
      name: 'SHOULDER',
      exercises: [
        { name: 'Overhead Press', sets: 3, reps: 12 },
        { name: 'Lateral Raises', sets: 3, reps: 15 },
        { name: 'Front Raises', sets: 3, reps: 15 },
        { name: 'Shrugs', sets: 3, reps: 12 }
      ]
    },
    {
      name: 'BACK',
      exercises: [
        { name: 'Pull-ups', sets: 3, reps: 10 },
        { name: 'Rows', sets: 3, reps: 12 },
        { name: 'Lat Pulldowns', sets: 3, reps: 15 },
        { name: 'Deadlifts', sets: 3, reps: 10 }
      ]
    }
  ];

  const getImagePath = (planName: string) => {
    const imageMap: { [key: string]: string } = {
      'ABS': '/absworkout.jpg',
      'CHEST': '/chestworkout.jpg',
      'ARM': '/armworkout.jpg',
      'LEG': '/legworkout.jpg',
      'SHOULDER': '/shoulderworkout.jpg',
      'BACK': '/backworkout.jpg'
    };
    return imageMap[planName] || '/default-workout.jpg';
  };

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSendWorkout = async () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/workout-plans/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: selectedPlan,
          exercises: workoutPlans.find(plan => plan.name === selectedPlan)?.exercises.map(ex => 
            `${ex.name}: ${ex.sets} sets x ${ex.reps || ex.duration}`
          )
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Workout plan sent successfully!');
        setSelectedPlan('');
      } else {
        alert(data.message || 'Failed to send workout plan. Please try again.');
      }
    } catch (error) {
      console.error('Error sending workout plan:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section className="plans">
      <h1 className="heading">Workout Plans</h1>
      <div className="plans-content">
        {workoutPlans.map((plan) => (
          <div
            key={plan.name}
            className={`box ${selectedPlan === plan.name ? 'selected' : ''}`}
            onClick={() => handlePlanSelect(plan.name)}
          >
            <img src={getImagePath(plan.name)} alt={`${plan.name} workout`} />
            <h3>{plan.name}</h3>
            <h2>Exercises:</h2>
            <ul>
              {plan.exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name}: {exercise.sets} sets x {exercise.reps || exercise.duration}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div className="email-section">
          <button onClick={handleSendWorkout} className="btn">
            Send Workout Plan
          </button>
        </div>
      )}
    </section>
  );
};

export default WorkoutPlan;
