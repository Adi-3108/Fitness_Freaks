import Link from "next/link"
import Image from "next/image"

export default function WorkoutPlan() {
  return (
    <body>
      <section className="services" id="services">
        <h2 className="heading">
          WORKOUT <span>PLAN</span>
        </h2>

        <div className="services-content">
          <div className="row">
            <Image src="/absworkout.jpg" alt="Abs Workout" width={400} height={300} />
            <h4>ABS WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>

          <div className="row">
            <Image src="/chestworkout.jpg" alt="Chest Workout" width={400} height={300} />
            <h4>CHEST WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>

          <div className="row">
            <Image src="/armworkout.jpg" alt="Arm Workout" width={400} height={300} />
            <h4>ARM WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>

          <div className="row">
            <Image src="/legworkout.jpg" alt="Leg Workout" width={400} height={300} />
            <h4>LEG WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>

          <div className="row">
            <Image src="/shoulderworkout.jpg" alt="Shoulder Workout" width={400} height={300} />
            <h4>SHOULDER WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>

          <div className="row">
            <Image src="/backworkout.jpg" alt="Back Workout" width={400} height={300} />
            <h4>BACK WORKOUTS</h4>
            <h4>
              <Link href="#">
                <p>View</p>
              </Link>
            </h4>
          </div>
        </div>
      </section>

      <section className="plans" id="plans">
        <h2 className="heading">
          <span></span>
        </h2>

        <div className="plans-content">
          <div className="box">
            <h3>ABS</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Hanging Knees</li>
              <li>Hanging Leg Raises</li>
              <li>Decline Crunch</li>
              <li>Russian Twist</li>
              <li>Abs Rollout</li>
              <li>Plank</li>
            </ul>
          </div>

          <div className="box">
            <h3>CHEST</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Barbell Bench Press </li>
              <li>Dumbbell Bench Press </li>
              <li>Machine Chest Press</li>
              <li>Cable cross-overs</li>
              <li>Push-Up</li>
              <li>Dips</li>
            </ul>
          </div>

          <div className="box">
            <h3>ARM</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Close-grip bench press</li>
              <li>Cable overhead triceps extension</li>
              <li>Triceps Extension</li>
              <li>Barbell Curl</li>
              <li>Standing Biceps Cable Curl</li>
            </ul>
          </div>

          <div className="box">
            <h3>LEG</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Leg extensions</li>
              <li>Leg press</li>
              <li>Adduction machine</li>
              <li>Barbell deadlift</li>
              <li>Squats</li>
            </ul>
          </div>

          <div className="box">
            <h3>SHOULDER</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Push-Press</li>
              <li>Rear Delt Row</li>
              <li>Seated Dumbbell Press</li>
              <li>Lateral Raise</li>
              <li>Front Raise</li>
              <li>Arnold Press</li>
            </ul>
          </div>

          <div className="box">
            <h3>BACK</h3>
            <h2>
              <span>Workouts</span>
            </h2>
            <ul>
              <li>Deadlift</li>
              <li>Bent-over row</li>
              <li>Pull-up</li>
              <li>T-bar row</li>
              <li>Seated row</li>
              <li>Lat pull-down</li>
            </ul>
          </div>
        </div>
      </section>
    </body>
  )
}
