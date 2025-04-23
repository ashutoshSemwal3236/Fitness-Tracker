// Initialize localStorage
function initializeStorage() {
  try {
    if (!localStorage.getItem("users"))
      localStorage.setItem("users", JSON.stringify([]));
    if (!localStorage.getItem("currentUser"))
      localStorage.setItem("currentUser", "");
    if (!localStorage.getItem("workouts"))
      localStorage.setItem("workouts", JSON.stringify([]));
    if (!localStorage.getItem("dailyStats")) {
      localStorage.setItem(
        "dailyStats",
        JSON.stringify({
          steps: 0,
          water: 0,
          calorieIntake: 0,
          stepCalories: 0,
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
  } catch (e) {
    console.error("Failed to initialize localStorage:", e);
    alert("Error initializing storage. Please check browser settings.");
  }
}

// Screen Navigation
function showLogin() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("signup-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.add("hidden");
}

function showSignup() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("signup-screen").classList.remove("hidden");
  document.getElementById("main-screen").classList.add("hidden");
}

function showMain() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("signup-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
  showSection("dashboard");
}

function showSection(sectionId) {
  document
    .querySelectorAll("main > div")
    .forEach((div) => div.classList.add("hidden"));
  document.getElementById(`${sectionId}-section`).classList.remove("hidden");
  updateCharts();
  toggleSidebar();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

// Authentication
function login() {
  try {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      alert("Invalid email or password");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    showMain();
    updateProfile();
    updateDashboard();
    updateGoals();
    updateWorkoutList();
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
  } catch (e) {
    console.error("Login error:", e);
    alert("An error occurred during login. Please try again.");
  }
}

function signup() {
  try {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const height = parseFloat(document.getElementById("signup-height").value);
    const weight = parseFloat(document.getElementById("signup-weight").value);
    if (
      !name ||
      !email ||
      !password ||
      isNaN(height) ||
      isNaN(weight) ||
      height <= 0 ||
      weight <= 0
    ) {
      alert(
        "Please fill all fields with valid data (height and weight must be positive numbers)"
      );
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    const user = { name, email, password, height, weight, bmi };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));
    showMain();
    updateProfile();
    updateDashboard();
    updateGoals();
    updateWorkoutList();
    document.getElementById("signup-name").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    document.getElementById("signup-height").value = "";
    document.getElementById("signup-weight").value = "";
  } catch (e) {
    console.error("Signup error:", e);
    alert("An error occurred during signup. Please try again.");
  }
}

function logout() {
  localStorage.setItem("currentUser", "");
  showLogin();
}

// Profile Management
function updateProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    document.getElementById("profile-name").textContent = user.name || "N/A";
    document.getElementById("profile-email").textContent = user.email || "N/A";
    document.getElementById("profile-height").textContent =
      user.height || "N/A";
    document.getElementById("profile-weight").textContent =
      user.weight || "N/A";
    document.getElementById("profile-bmi").textContent = user.bmi || "N/A";
  } catch (e) {
    console.error("Update profile error:", e);
  }
}

function editProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  document.getElementById("edit-name").value = user.name || "";
  document.getElementById("edit-height").value = user.height || "";
  document.getElementById("edit-weight").value = user.weight || "";
  document.getElementById("edit-profile-form").classList.remove("hidden");
}

function saveProfile() {
  try {
    const name = document.getElementById("edit-name").value.trim();
    const height = parseFloat(document.getElementById("edit-height").value);
    const weight = parseFloat(document.getElementById("edit-weight").value);
    if (!name || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert(
        "Please fill all fields with valid data (height and weight must be positive numbers)"
      );
      return;
    }
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUser = { ...user, name, height, weight, bmi };
    const userIndex = users.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
    document.getElementById("edit-profile-form").classList.add("hidden");
    updateProfile();
  } catch (e) {
    console.error("Save profile error:", e);
    alert("An error occurred while saving profile. Please try again.");
  }
}

function calculateBMI() {
  try {
    const height = parseFloat(document.getElementById("bmi-height").value);
    const weight = parseFloat(document.getElementById("bmi-weight").value);
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert("Please enter valid height and weight");
      return;
    }
    const bmi = (weight / (height / 100) ** 2).toFixed(1);
    let category, color;
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-yellow-400";
    } else if (bmi < 25) {
      category = "Normal";
      color = "text-green-400";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-orange-400";
    } else {
      category = "Obese";
      color = "text-red-400";
    }
    document.getElementById("bmi-result").textContent = bmi;
    document.getElementById(
      "bmi-result"
    ).className = `text-xl font-bold ${color}`;
    document.getElementById("bmi-category").textContent = category;
    document.getElementById("bmi-category").className = color;
    document.getElementById("bmi-result-card").classList.remove("hidden");
  } catch (e) {
    console.error("Calculate BMI error:", e);
    alert("An error occurred while calculating BMI. Please try again.");
  }
}

// Dashboard Management
function checkDailyReset() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      lastReset: "",
    };
    const today = new Date().toDateString();
    if (stats.lastReset !== today) {
      stats.steps = 0;
      stats.water = 0;
      stats.calorieIntake = 0;
      stats.stepCalories = 0;
      stats.lastReset = today;
      localStorage.setItem("dailyStats", JSON.stringify(stats));
    }
  } catch (e) {
    console.error("Check daily reset error:", e);
  }
}

function updateDashboard() {
  try {
    checkDailyReset();
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    const goals = JSON.parse(localStorage.getItem("goals")) || {
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
      calorieGoal: 0,
    };
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const today = new Date().toDateString();
    const dailyWorkouts = workouts.filter(
      (w) => new Date(w.date).toDateString() === today
    );
    const dailyWorkoutCalories = dailyWorkouts.reduce(
      (sum, w) => sum + w.calories,
      0
    );
    const totalCaloriesBurned = dailyWorkoutCalories + stats.stepCalories;

    // Steps
    document.getElementById("daily-steps").textContent = stats.steps || 0;
    const stepProgress = goals.stepGoal
      ? Math.min((stats.steps / goals.stepGoal) * 100, 100)
      : 0;
    document.getElementById("steps-progress").style.width = `${stepProgress}%`;
    document.getElementById(
      "steps-progress-percent"
    ).textContent = `${Math.round(stepProgress)}%`;
    document.getElementById("steps-remaining").textContent = Math.max(
      goals.stepGoal - stats.steps,
      0
    );

    // Water
    document.getElementById("water-intake").textContent = `${
      stats.water || 0
    } ml`;
    const waterProgress = goals.waterGoal
      ? Math.min((stats.water / goals.waterGoal) * 100, 100)
      : 0;
    document.getElementById("water-progress").style.width = `${waterProgress}%`;
    document.getElementById(
      "water-progress-percent"
    ).textContent = `${Math.round(waterProgress)}%`;
    document.getElementById("water-remaining").textContent = Math.max(
      goals.waterGoal - stats.water,
      0
    );

    // Calorie Intake
    document.getElementById("calorie-intake").textContent = `${
      stats.calorieIntake || 0
    } cal`;
    const calorieIntakeProgress = goals.calorieIntakeGoal
      ? Math.min((stats.calorieIntake / goals.calorieIntakeGoal) * 100, 100)
      : 0;
    document.getElementById(
      "calorie-intake-progress"
    ).style.width = `${calorieIntakeProgress}%`;
    document.getElementById(
      "calorie-intake-progress-percent"
    ).textContent = `${Math.round(calorieIntakeProgress)}%`;
    document.getElementById("calorie-intake-remaining").textContent = Math.max(
      goals.calorieIntakeGoal - stats.calorieIntake,
      0
    );

    // Calories Burned
    document.getElementById(
      "total-calories-burned"
    ).textContent = `${Math.round(totalCaloriesBurned)} cal`;
    const caloriesBurnedProgress = goals.calorieGoal
      ? Math.min((totalCaloriesBurned / goals.calorieGoal) * 100, 100)
      : 0;
    document.getElementById(
      "calories-burned-progress"
    ).style.width = `${caloriesBurnedProgress}%`;
    document.getElementById(
      "calories-burned-progress-percent"
    ).textContent = `${Math.round(caloriesBurnedProgress)}%`;
    document.getElementById("calories-burned-remaining").textContent = Math.max(
      goals.calorieGoal - totalCaloriesBurned,
      0
    );

    updateCharts();
  } catch (e) {
    console.error("Update dashboard error:", e);
  }
}

function logSteps() {
  try {
    const steps = parseInt(document.getElementById("step-input").value);
    if (isNaN(steps) || steps < 0) {
      alert("Please enter a valid number of steps");
      return;
    }
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    const weight = user.weight || 70;
    const calories = Math.round((steps * 0.04 * weight) / 1000);
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.steps += steps;
    stats.stepCalories += calories;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    document.getElementById("step-input").value = "";
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Log steps error:", e);
    alert("An error occurred while logging steps. Please try again.");
  }
}

function resetSteps() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.steps = 0;
    stats.stepCalories = 0;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Reset steps error:", e);
  }
}

function logWater() {
  try {
    const water = parseInt(document.getElementById("water-input").value);
    if (isNaN(water) || water < 0) {
      alert("Please enter a valid amount of water");
      return;
    }
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.water += water;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    document.getElementById("water-input").value = "";
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Log water error:", e);
    alert("An error occurred while logging water. Please try again.");
  }
}

function resetWater() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.water = 0;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Reset water error:", e);
  }
}

function logCalorieIntake() {
  try {
    const calories = parseInt(
      document.getElementById("calorie-intake-input").value
    );
    if (isNaN(calories) || calories < 0) {
      alert("Please enter a valid number of calories");
      return;
    }
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.calorieIntake += calories;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    document.getElementById("calorie-intake-input").value = "";
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Log calorie intake error:", e);
    alert("An error occurred while logging calories. Please try again.");
  }
}

function resetCalorieIntake() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    stats.calorieIntake = 0;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    updateDashboard();
    updateGoals();
  } catch (e) {
    console.error("Reset calorie intake error:", e);
  }
}

// Workout Management
function toggleCustomWorkout() {
  const workoutType = document.getElementById("workout-type").value;
  document
    .getElementById("custom-workout")
    .classList.toggle("hidden", workoutType !== "custom");
}

function calculateCalories(workoutType, duration, sets) {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    const weight = user.weight || 70;
    const metValues = {
      "Bench Press": 6.0,
      "Push-Ups": 8.0,
      "Chest Fly": 5.0,
      "Incline Press": 6.0,
      "Pull-Ups": 8.0,
      Deadlift: 6.0,
      "Bent-Over Row": 5.5,
      "Lat Pulldown": 5.0,
      Squats: 5.0,
      Lunges: 6.0,
      "Leg Press": 5.0,
      "Calf Raises": 4.0,
      "Bicep Curls": 4.0,
      "Tricep Dips": 5.0,
      "Hammer Curls": 4.0,
      "Skull Crushers": 4.0,
      Plank: 4.0,
      Crunches: 4.0,
      "Russian Twists": 4.5,
      "Leg Raises": 4.0,
      custom: 5.0,
    };
    const met = metValues[workoutType] || 5.0;
    const durationHours = duration / 60;
    const setsModifier = sets > 0 ? 1 + (sets - 1) * 0.1 : 1;
    const calories = Math.round(met * weight * durationHours * setsModifier);
    return calories > 0 ? calories : 0;
  } catch (e) {
    console.error("Calculate calories error:", e);
    return 0;
  }
}

function calculateAndAddWorkout() {
  try {
    let type = document.getElementById("workout-type").value;
    const customWorkout = document
      .getElementById("custom-workout")
      .value.trim();
    const category = document.getElementById("workout-category").value;
    const duration = parseInt(
      document.getElementById("workout-duration").value
    );
    const sets = parseInt(document.getElementById("workout-sets").value);
    if (type === "custom" && customWorkout) type = customWorkout;
    if (
      !type ||
      !category ||
      isNaN(duration) ||
      isNaN(sets) ||
      duration <= 0 ||
      sets <= 0
    ) {
      alert("Please fill all fields with valid data");
      return;
    }
    const calories = calculateCalories(type, duration, sets);
    document.getElementById("calorie-value").textContent = calories;
    document.getElementById("calorie-result").classList.remove("hidden");
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const workout = {
      type,
      category,
      duration,
      calories,
      sets,
      date: new Date().toLocaleString(),
    };
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    document.getElementById("workout-type").value = "";
    document.getElementById("custom-workout").value = "";
    document.getElementById("workout-category").value = "Strength";
    document.getElementById("workout-duration").value = "";
    document.getElementById("workout-sets").value = "";
    updateWorkoutList();
    updateCharts();
    updateGoals();
    updateDashboard();
  } catch (e) {
    console.error("Add workout error:", e);
    alert("An error occurred while adding workout. Please try again.");
  }
}

function deleteWorkout(index) {
  try {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.splice(index, 1);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    updateWorkoutList();
    updateCharts();
    updateGoals();
    updateDashboard();
  } catch (e) {
    console.error("Delete workout error:", e);
    alert("An error occurred while deleting workout. Please try again.");
  }
}

function updateWorkoutList() {
  try {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";
    workouts.forEach((workout, index) => {
      const li = document.createElement("li");
      li.className =
        "bg-gray-800 p-4 rounded-lg flex justify-between items-center";
      li.innerHTML = `
                    <span><strong>${workout.type}</strong> (${workout.category}) - ${workout.duration} min, ${workout.calories} cal, ${workout.sets} sets on ${workout.date}</span>
                    <button onclick="deleteWorkout(${index})" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                `;
      workoutList.appendChild(li);
    });
  } catch (e) {
    console.error("Update workout list error:", e);
  }
}

// Goals Management
function saveGoals() {
  try {
    const stepGoal = parseInt(document.getElementById("step-goal").value) || 0;
    const waterGoal =
      parseInt(document.getElementById("water-goal").value) || 0;
    const calorieIntakeGoal =
      parseInt(document.getElementById("calorie-intake-goal").value) || 0;
    const calorieGoal =
      parseInt(document.getElementById("calorie-goal").value) || 0;
    if (
      stepGoal < 0 ||
      waterGoal < 0 ||
      calorieIntakeGoal < 0 ||
      calorieGoal < 0
    ) {
      alert("Goals cannot be negative");
      return;
    }
    const goals = { stepGoal, waterGoal, calorieIntakeGoal, calorieGoal };
    localStorage.setItem("goals", JSON.stringify(goals));
    document.getElementById("step-goal").value = "";
    document.getElementById("water-goal").value = "";
    document.getElementById("calorie-intake-goal").value = "";
    document.getElementById("calorie-goal").value = "";
    updateGoals();
    updateDashboard();
  } catch (e) {
    console.error("Save goals error:", e);
    alert("An error occurred while saving goals. Please try again.");
  }
}

function resetGoals() {
  try {
    const goals = {
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
      calorieGoal: 0,
    };
    localStorage.setItem("goals", JSON.stringify(goals));
    updateGoals();
    updateDashboard();
  } catch (e) {
    console.error("Reset goals error:", e);
  }
}

function updateGoals() {
  try {
    checkDailyReset();
    const goals = JSON.parse(localStorage.getItem("goals")) || {
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
      calorieGoal: 0,
    };
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const today = new Date().toDateString();
    const dailyWorkouts = workouts.filter(
      (w) => new Date(w.date).toDateString() === today
    );
    const dailyWorkoutCalories = dailyWorkouts.reduce(
      (sum, w) => sum + w.calories,
      0
    );
    const totalCaloriesBurnedDaily = dailyWorkoutCalories + stats.stepCalories;
    const totalCaloriesBurnedWeekly =
      workouts.reduce((sum, w) => sum + w.calories, 0) + stats.stepCalories;

    // Step Goal
    document.getElementById("current-step-goal").textContent = goals.stepGoal;
    const stepProgress = goals.stepGoal
      ? Math.min((stats.steps / goals.stepGoal) * 100, 100)
      : 0;
    document.getElementById(
      "steps-progress-percent-goal"
    ).textContent = `${Math.round(stepProgress)}%`;
    document.getElementById("steps-remaining-goal").textContent = Math.max(
      goals.stepGoal - stats.steps,
      0
    );
    document.getElementById(
      "steps-goal-progress"
    ).style.width = `${stepProgress}%`;

    // Water Goal
    document.getElementById("current-water-goal").textContent = goals.waterGoal;
    const waterProgress = goals.waterGoal
      ? Math.min((stats.water / goals.waterGoal) * 100, 100)
      : 0;
    document.getElementById(
      "water-progress-percent-goal"
    ).textContent = `${Math.round(waterProgress)}%`;
    document.getElementById("water-remaining-goal").textContent = Math.max(
      goals.waterGoal - stats.water,
      0
    );
    document.getElementById(
      "water-goal-progress"
    ).style.width = `${waterProgress}%`;

    // Calorie Intake Goal
    document.getElementById("current-calorie-intake-goal").textContent =
      goals.calorieIntakeGoal;
    const calorieIntakeProgress = goals.calorieIntakeGoal
      ? Math.min((stats.calorieIntake / goals.calorieIntakeGoal) * 100, 100)
      : 0;
    document.getElementById(
      "calorie-intake-progress-percent-goal"
    ).textContent = `${Math.round(calorieIntakeProgress)}%`;
    document.getElementById("calorie-intake-remaining-goal").textContent =
      Math.max(goals.calorieIntakeGoal - stats.calorieIntake, 0);
    document.getElementById(
      "calorie-intake-goal-progress"
    ).style.width = `${calorieIntakeProgress}%`;

    // Calorie Burn Goal (Daily)
    document.getElementById("current-calorie-goal").textContent =
      goals.calorieGoal;
    const calorieProgressDaily = goals.calorieGoal
      ? Math.min((totalCaloriesBurnedDaily / goals.calorieGoal) * 100, 100)
      : 0;
    document.getElementById(
      "calories-progress-percent-goal"
    ).textContent = `${Math.round(calorieProgressDaily)}%`;
    document.getElementById("calories-remaining-goal").textContent = Math.max(
      goals.calorieGoal - totalCaloriesBurnedDaily,
      0
    );
    document.getElementById(
      "calories-goal-progress"
    ).style.width = `${calorieProgressDaily}%`;

    // Calorie Burn Goal (Weekly)
    document.getElementById("current-calorie-goal-weekly").textContent =
      goals.calorieGoal * 7;
    const calorieProgressWeekly =
      goals.calorieGoal * 7
        ? Math.min(
            (totalCaloriesBurnedWeekly / (goals.calorieGoal * 7)) * 100,
            100
          )
        : 0;
    document.getElementById(
      "calories-progress-percent-goal-weekly"
    ).textContent = `${Math.round(calorieProgressWeekly)}%`;
    document.getElementById("calories-remaining-goal-weekly").textContent =
      Math.max(goals.calorieGoal * 7 - totalCaloriesBurnedWeekly, 0);
    document.getElementById(
      "calories-goal-progress-weekly"
    ).style.width = `${calorieProgressWeekly}%`;
  } catch (e) {
    console.error("Update goals error:", e);
  }
}

// Chart Management
let progressChart, workoutCategoryChart, workoutStatsChart;

function updateCharts() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
      stepCalories: 0,
    };
    const goals = JSON.parse(localStorage.getItem("goals")) || {
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
      calorieGoal: 0,
    };
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const today = new Date().toDateString();
    const dailyWorkouts = workouts.filter(
      (w) => new Date(w.date).toDateString() === today
    );
    const dailyWorkoutCalories = dailyWorkouts.reduce(
      (sum, w) => sum + w.calories,
      0
    );
    const totalCaloriesBurned = dailyWorkoutCalories + stats.stepCalories;

    // Progress Chart (Daily Goals)
    const progressData = [
      goals.stepGoal > 0
        ? Math.min((stats.steps / goals.stepGoal) * 100, 100)
        : 0,
      goals.waterGoal > 0
        ? Math.min((stats.water / goals.waterGoal) * 100, 100)
        : 0,
      goals.calorieIntakeGoal > 0
        ? Math.min((stats.calorieIntake / goals.calorieIntakeGoal) * 100, 100)
        : 0,
      goals.calorieGoal > 0
        ? Math.min((totalCaloriesBurned / goals.calorieGoal) * 100, 100)
        : 0,
    ];
    console.log("Progress Chart Data:", progressData); // Debug log
    if (progressChart) progressChart.destroy();
    const progressCanvas = document.getElementById("progress-chart");
    if (!progressCanvas) {
      console.error("Progress chart canvas not found");
      return;
    }
    progressChart = new Chart(progressCanvas, {
      type: "bar",
      data: {
        labels: ["Steps", "Water", "Calorie Intake", "Calories Burned"],
        datasets: [
          {
            label: "Progress (%)",
            data: progressData,
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: "Progress (%)", color: "#e5e7eb" },
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          x: { ticks: { color: "#e5e7eb" }, grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Daily Goal Progress",
            color: "#e5e7eb",
            font: { size: 16 },
          },
        },
      },
    });

    // Workout Category Chart (Daily)
    const categoryCounts = { Strength: 0, Cardio: 0, Flexibility: 0 };
    dailyWorkouts.forEach((w) => (categoryCounts[w.category] += w.calories));
    if (workoutCategoryChart) workoutCategoryChart.destroy();
    workoutCategoryChart = new Chart(
      document.getElementById("workout-category-chart"),
      {
        type: "doughnut",
        data: {
          labels: ["Strength", "Cardio", "Flexibility"],
          datasets: [
            {
              data: [
                categoryCounts.Strength,
                categoryCounts.Cardio,
                categoryCounts.Flexibility,
              ],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { color: "#e5e7eb" } },
            title: {
              display: true,
              text: "Workout Categories",
              color: "#e5e7eb",
              font: { size: 16 },
            },
          },
        },
      }
    );

    // Workout Stats Chart (Calories by Source)
    if (workoutStatsChart) workoutStatsChart.destroy();
    workoutStatsChart = new Chart(
      document.getElementById("workout-stats-chart"),
      {
        type: "bar",
        data: {
          labels: ["Workout Calories", "Step Calories"],
          datasets: [
            {
              label: "Calories Burned",
              data: [dailyWorkoutCalories, stats.stepCalories],
              backgroundColor: ["#3b82f6", "#ef4444"],
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Calories", color: "#e5e7eb" },
              ticks: { color: "#e5e7eb" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
            x: { ticks: { color: "#e5e7eb" }, grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Calories Burned by Source",
              color: "#e5e7eb",
              font: { size: 16 },
            },
          },
        },
      }
    );
  } catch (e) {
    console.error("Update charts error:", e);
  }
}

// Initialize App
function init() {
  try {
    initializeStorage();
    checkDailyReset();
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser && currentUser !== "") {
      showMain();
      updateProfile();
      updateDashboard();
      updateGoals();
      updateWorkoutList();
    } else {
      showLogin();
    }
  } catch (e) {
    console.error("Initialization error:", e);
    alert("An error occurred while initializing the app. Please try again.");
  }
}

init();
