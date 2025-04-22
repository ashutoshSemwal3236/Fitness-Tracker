if (!localStorage.getItem("user")) {
  localStorage.setItem("user", JSON.stringify({}));
}
if (!localStorage.getItem("workouts")) {
  localStorage.setItem("workouts", JSON.stringify([]));
}
if (!localStorage.getItem("dailyStats")) {
  localStorage.setItem(
    "dailyStats",
    JSON.stringify({
      steps: 0,
      water: 0,
      calorieIntake: 0,
      lastReset: new Date().toDateString(),
    })
  );
}
if (!localStorage.getItem("goals")) {
  localStorage.setItem(
    "goals",
    JSON.stringify({
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
      calorieGoal: 0,
    })
  );
}

// User Authentication
function signup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const height = parseFloat(document.getElementById("signup-height").value);
  const weight = parseFloat(document.getElementById("signup-weight").value);
  if (name && email && password && height && weight) {
    const user = { name, email, password, height, weight };
    try {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Signup successful! Please login.");
      showLogin();
    } catch (e) {
      alert("Error saving user data. Please try again.");
      console.error(e);
    }
  } else {
    alert("Please fill in all fields.");
  }
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === email && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      showMain();
    } else {
      alert("Invalid email or password.");
    }
  } catch (e) {
    alert("Error accessing user data. Please try again.");
    console.error(e);
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  showLogin();
}

// Screen Navigation
function showLogin() {
  console.log("Showing login screen");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("signup-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.add("hidden");
}

function showSignup() {
  console.log("Showing signup screen");
  document.getElementById("signup-screen").classList.remove("hidden");
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.add("hidden");
}

function showMain() {
  console.log("Showing main screen");
  document.getElementById("main-screen").classList.remove("hidden");
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("signup-screen").classList.add("hidden");
  showSection("dashboard");
  loadProfile();
  loadWorkouts();
  loadGoals();
  loadDailyStats();
}

function showSection(section) {
  console.log(`Showing section: ${section}`);
  ["profile", "dashboard", "workouts", "goals"].forEach((s) => {
    const sectionEl = document.getElementById(`${s}-section`);
    if (sectionEl) sectionEl.classList.add("hidden");
  });
  const targetSection = document.getElementById(`${section}-section`);
  if (targetSection) targetSection.classList.remove("hidden");
  toggleSidebar(false); // Close sidebar on mobile after selection
}

function toggleSidebar(show = null) {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    if (show === null) {
      sidebar.classList.toggle("sidebar-hidden");
    } else {
      sidebar.classList.toggle("sidebar-hidden", !show);
    }
  }
}

// Profile Management
function loadProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    document.getElementById("profile-name").textContent = user.name || "N/A";
    document.getElementById("profile-email").textContent = user.email || "N/A";
    document.getElementById("profile-height").textContent =
      user.height || "N/A";
    document.getElementById("profile-weight").textContent =
      user.weight || "N/A";
    const bmi =
      user.weight && user.height
        ? (user.weight / (user.height / 100) ** 2).toFixed(1)
        : "N/A";
    document.getElementById("profile-bmi").textContent = bmi;
  } catch (e) {
    console.error("Error loading profile:", e);
  }
}

function editProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    document.getElementById("edit-name").value = user.name || "";
    document.getElementById("edit-height").value = user.height || "";
    document.getElementById("edit-weight").value = user.weight || "";
    document.getElementById("edit-profile-form").classList.remove("hidden");
  } catch (e) {
    console.error("Error editing profile:", e);
  }
}

function saveProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    user.name = document.getElementById("edit-name").value;
    user.height =
      parseFloat(document.getElementById("edit-height").value) || user.height;
    user.weight =
      parseFloat(document.getElementById("edit-weight").value) || user.weight;
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("edit-profile-form").classList.add("hidden");
    loadProfile();
  } catch (e) {
    alert("Error saving profile. Please try again.");
    console.error("Error saving profile:", e);
  }
}

function calculateBMI() {
  const height = parseFloat(document.getElementById("bmi-height").value);
  const weight = parseFloat(document.getElementById("bmi-weight").value);
  if (height > 0 && weight > 0) {
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    document.getElementById(
      "bmi-result"
    ).textContent = `${bmi} (Category: ${getBMICategory(bmi)})`;
  } else {
    alert("Please enter valid height and weight.");
    document.getElementById("bmi-result").textContent = "N/A";
  }
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Workout Management
let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

function addWorkout() {
  const type = document.getElementById("workout-type").value;
  const duration = parseInt(document.getElementById("workout-duration").value);
  const calories = parseInt(document.getElementById("workout-calories").value);
  if (type && duration && calories) {
    const workout = {
      type,
      duration,
      calories,
      date: new Date().toLocaleString(),
    };
    workouts.push(workout);
    try {
      localStorage.setItem("workouts", JSON.stringify(workouts));
      document.getElementById("workout-type").value = "";
      document.getElementById("workout-duration").value = "";
      document.getElementById("workout-calories").value = "";
      loadWorkouts();
    } catch (e) {
      alert("Error saving workout. Please try again.");
      console.error(e);
    }
  } else {
    alert("Please fill in all workout fields.");
  }
}

function loadWorkouts() {
  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = "";
  let totalDuration = 0;
  let totalCalories = 0;

  workouts.forEach((workout, index) => {
    const li = document.createElement("li");
    li.className =
      "border-b border-gray-600 py-3 flex justify-between items-center text-gray-300";
    li.innerHTML = `
                    <span>${workout.type} - ${workout.duration} min, ${workout.calories} cal (${workout.date})</span>
                    <button onclick="deleteWorkout(${index})" class="text-red-400 hover:text-red-500 transition">Delete</button>
                `;
    workoutList.appendChild(li);
    totalDuration += workout.duration;
    totalCalories += workout.calories;
  });

  document.getElementById("total-workouts").textContent = workouts.length;
  document.getElementById("total-duration").textContent = totalDuration;
  document.getElementById("total-calories").textContent = totalCalories;
  updateGoalProgress();
}

function deleteWorkout(index) {
  workouts.splice(index, 1);
  try {
    localStorage.setItem("workouts", JSON.stringify(workouts));
    loadWorkouts();
  } catch (e) {
    alert("Error deleting workout. Please try again.");
    console.error(e);
  }
}

// Daily Stats (Steps, Water, Calorie Intake)
let dailyStats = JSON.parse(localStorage.getItem("dailyStats")) || {
  steps: 0,
  water: 0,
  calorieIntake: 0,
  lastReset: new Date().toDateString(),
};

function loadDailyStats() {
  const today = new Date().toDateString();
  if (dailyStats.lastReset !== today) {
    dailyStats = { steps: 0, water: 0, calorieIntake: 0, lastReset: today };
    try {
      localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
    } catch (e) {
      console.error(e);
    }
  }
  document.getElementById("daily-steps").textContent = dailyStats.steps;
  document.getElementById("water-intake").textContent =
    dailyStats.water + " ml";
  document.getElementById("calorie-intake").textContent =
    dailyStats.calorieIntake + " cal";
  updateGoalProgress();
}

function logSteps() {
  const steps = parseInt(document.getElementById("step-input").value);
  if (steps >= 0) {
    dailyStats.steps += steps;
    try {
      localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
      document.getElementById("step-input").value = "";
      loadDailyStats();
    } catch (e) {
      alert("Error logging steps. Please try again.");
      console.error(e);
    }
  } else {
    alert("Please enter a valid number of steps.");
  }
}

function resetSteps() {
  dailyStats.steps = 0;
  try {
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
    loadDailyStats();
  } catch (e) {
    alert("Error resetting steps. Please try again.");
    console.error(e);
  }
}

function logWater() {
  const water = parseInt(document.getElementById("water-input").value);
  if (water >= 0) {
    dailyStats.water += water;
    try {
      localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
      document.getElementById("water-input").value = "";
      loadDailyStats();
    } catch (e) {
      alert("Error logging water. Please try again.");
      console.error(e);
    }
  } else {
    alert("Please enter a valid amount of water.");
  }
}

function resetWater() {
  dailyStats.water = 0;
  try {
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
    loadDailyStats();
  } catch (e) {
    alert("Error resetting water. Please try again.");
    console.error(e);
  }
}

function logCalorieIntake() {
  const calories = parseInt(
    document.getElementById("calorie-intake-input").value
  );
  if (calories >= 0) {
    dailyStats.calorieIntake += calories;
    try {
      localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
      document.getElementById("calorie-intake-input").value = "";
      loadDailyStats();
    } catch (e) {
      alert("Error logging calorie intake. Please try again.");
      console.error(e);
    }
  } else {
    alert("Please enter a valid amount of calories.");
  }
}

function resetCalorieIntake() {
  dailyStats.calorieIntake = 0;
  try {
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
    loadDailyStats();
  } catch (e) {
    alert("Error resetting calorie intake. Please try again.");
    console.error(e);
  }
}

// Goals Management
let goals = JSON.parse(localStorage.getItem("goals")) || {
  stepGoal: 0,
  waterGoal: 0,
  calorieIntakeGoal: 0,
  calorieGoal: 0,
};

function loadGoals() {
  document.getElementById("step-goal").value = goals.stepGoal || "";
  document.getElementById("water-goal").value = goals.waterGoal || "";
  document.getElementById("calorie-intake-goal").value =
    goals.calorieIntakeGoal || "";
  document.getElementById("calorie-goal").value = goals.calorieGoal || "";
  document.getElementById("current-step-goal").textContent =
    goals.stepGoal || 0;
  document.getElementById("current-water-goal").textContent =
    goals.waterGoal || 0;
  document.getElementById("current-calorie-intake-goal").textContent =
    goals.calorieIntakeGoal || 0;
  document.getElementById("current-calorie-goal").textContent =
    goals.calorieGoal || 0;
  updateGoalProgress();
}

function saveGoals() {
  goals.stepGoal = parseInt(document.getElementById("step-goal").value) || 0;
  goals.waterGoal = parseInt(document.getElementById("water-goal").value) || 0;
  goals.calorieIntakeGoal =
    parseInt(document.getElementById("calorie-intake-goal").value) || 0;
  goals.calorieGoal =
    parseInt(document.getElementById("calorie-goal").value) || 0;
  try {
    localStorage.setItem("goals", JSON.stringify(goals));
    loadGoals();
    alert("Goals saved successfully!");
  } catch (e) {
    alert("Error saving goals. Please try again.");
    console.error(e);
  }
}

function updateGoalProgress() {
  // Steps progress
  const stepProgress =
    goals.stepGoal > 0 ? (dailyStats.steps / goals.stepGoal) * 100 : 0;
  const stepRemaining = goals.stepGoal - dailyStats.steps;
  const stepsProgressEl = document.getElementById("steps-progress");
  if (stepsProgressEl)
    stepsProgressEl.style.width = `${Math.min(stepProgress, 100)}%`;
  const stepsGoalProgressEl = document.getElementById("steps-goal-progress");
  if (stepsGoalProgressEl)
    stepsGoalProgressEl.style.width = `${Math.min(stepProgress, 100)}%`;
  document.getElementById("steps-progress-percent").textContent = `${Math.round(
    stepProgress
  )}%`;
  document.getElementById(
    "steps-progress-percent-goal"
  ).textContent = `${Math.round(stepProgress)}%`;
  document.getElementById("steps-remaining").textContent =
    stepRemaining > 0 ? stepRemaining : 0;
  document.getElementById("steps-remaining-goal").textContent =
    stepRemaining > 0 ? stepRemaining : 0;

  // Water progress
  const waterProgress =
    goals.waterGoal > 0 ? (dailyStats.water / goals.waterGoal) * 100 : 0;
  const waterRemaining = goals.waterGoal - dailyStats.water;
  const waterProgressEl = document.getElementById("water-progress");
  if (waterProgressEl)
    waterProgressEl.style.width = `${Math.min(waterProgress, 100)}%`;
  const waterGoalProgressEl = document.getElementById("water-goal-progress");
  if (waterGoalProgressEl)
    waterGoalProgressEl.style.width = `${Math.min(waterProgress, 100)}%`;
  document.getElementById("water-progress-percent").textContent = `${Math.round(
    waterProgress
  )}%`;
  document.getElementById(
    "water-progress-percent-goal"
  ).textContent = `${Math.round(waterProgress)}%`;
  document.getElementById("water-remaining").textContent =
    waterRemaining > 0 ? waterRemaining : 0;
  document.getElementById("water-remaining-goal").textContent =
    waterRemaining > 0 ? waterRemaining : 0;

  // Calorie Intake progress
  const calorieIntakeProgress =
    goals.calorieIntakeGoal > 0
      ? (dailyStats.calorieIntake / goals.calorieIntakeGoal) * 100
      : 0;
  const calorieIntakeRemaining =
    goals.calorieIntakeGoal - dailyStats.calorieIntake;
  const calorieIntakeProgressEl = document.getElementById(
    "calorie-intake-progress"
  );
  if (calorieIntakeProgressEl)
    calorieIntakeProgressEl.style.width = `${Math.min(
      calorieIntakeProgress,
      100
    )}%`;
  const calorieIntakeGoalProgressEl = document.getElementById(
    "calorie-intake-goal-progress"
  );
  if (calorieIntakeGoalProgressEl)
    calorieIntakeGoalProgressEl.style.width = `${Math.min(
      calorieIntakeProgress,
      100
    )}%`;
  document.getElementById(
    "calorie-intake-progress-percent"
  ).textContent = `${Math.round(calorieIntakeProgress)}%`;
  document.getElementById(
    "calorie-intake-progress-percent-goal"
  ).textContent = `${Math.round(calorieIntakeProgress)}%`;
  document.getElementById("calorie-intake-remaining").textContent =
    calorieIntakeRemaining > 0 ? calorieIntakeRemaining : 0;
  document.getElementById("calorie-intake-remaining-goal").textContent =
    calorieIntakeRemaining > 0 ? calorieIntakeRemaining : 0;

  // Calorie Burn progress
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const calorieProgress =
    goals.calorieGoal > 0 ? (totalCalories / goals.calorieGoal) * 100 : 0;
  const calorieRemaining = goals.calorieGoal - totalCalories;
  const caloriesGoalProgressEl = document.getElementById(
    "calories-goal-progress"
  );
  if (caloriesGoalProgressEl)
    caloriesGoalProgressEl.style.width = `${Math.min(calorieProgress, 100)}%`;
  document.getElementById(
    "calories-progress-percent"
  ).textContent = `${Math.round(calorieProgress)}%`;
  document.getElementById(
    "calories-progress-percent-goal"
  ).textContent = `${Math.round(calorieProgress)}%`;
  document.getElementById("calories-remaining").textContent =
    calorieRemaining > 0 ? calorieRemaining : 0;
  document.getElementById("calories-remaining-goal").textContent =
    calorieRemaining > 0 ? calorieRemaining : 0;
}

// Initial Load
try {
  console.log("Initial load: Checking login status");
  if (localStorage.getItem("isLoggedIn") === "true") {
    showMain();
  } else {
    showLogin();
  }
} catch (e) {
  console.error("Error during initial load:", e);
  showLogin();
}
