// Initialize localStorage
function initializeStorage() {
  try {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    if (!localStorage.getItem("currentUser")) {
      localStorage.setItem("currentUser", "");
    }
    if (!localStorage.getItem("workouts")) {
      localStorage.setItem("workouts", JSON.stringify([]));
    }
    if (!localStorage.getItem("dailyStats")) {
      localStorage.setItem(
        "dailyStats",
        JSON.stringify({ steps: 0, water: 0, calorieIntake: 0 })
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
    // Clear login inputs
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
    // Clear signup inputs
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
function updateDashboard() {
  try {
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
    };
    const goals = JSON.parse(localStorage.getItem("goals")) || {
      stepGoal: 0,
      waterGoal: 0,
      calorieIntakeGoal: 0,
    };

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
    const stats = JSON.parse(localStorage.getItem("dailyStats")) || {
      steps: 0,
      water: 0,
      calorieIntake: 0,
    };
    stats.steps += steps;
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
    };
    stats.steps = 0;
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

function addWorkout() {
  try {
    let type = document.getElementById("workout-type").value;
    const customWorkout = document
      .getElementById("custom-workout")
      .value.trim();
    const category = document.getElementById("workout-category").value;
    const duration = parseInt(
      document.getElementById("workout-duration").value
    );
    const calories = parseInt(
      document.getElementById("workout-calories").value
    );
    const sets = parseInt(document.getElementById("workout-sets").value);

    if (type === "custom" && customWorkout) {
      type = customWorkout;
    }

    if (
      !type ||
      !category ||
      isNaN(duration) ||
      isNaN(calories) ||
      isNaN(sets) ||
      duration <= 0 ||
      calories <= 0 ||
      sets <= 0
    ) {
      alert("Please fill all fields with valid data");
      return;
    }

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
    document.getElementById("workout-calories").value = "";
    document.getElementById("workout-sets").value = "";
    updateWorkoutList();
    updateCharts();
    updateGoals();
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
    };
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const totalCaloriesBurned = workouts.reduce(
      (sum, w) => sum + w.calories,
      0
    );

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

    // Calorie Burn Goal
    document.getElementById("current-calorie-goal").textContent =
      goals.calorieGoal;
    const calorieProgress = goals.calorieGoal
      ? Math.min((totalCaloriesBurned / goals.calorieGoal) * 100, 100)
      : 0;
    document.getElementById(
      "calories-progress-percent-goal"
    ).textContent = `${Math.round(calorieProgress)}%`;
    document.getElementById("calories-remaining-goal").textContent = Math.max(
      goals.calorieGoal - totalCaloriesBurned,
      0
    );
    document.getElementById(
      "calories-goal-progress"
    ).style.width = `${calorieProgress}%`;
  } catch (e) {
    console.error("Update goals error:", e);
  }
}

// Chart Initialization
let workoutCategoryChart, workoutStatsChart;

function updateCharts() {
  try {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || {
      calorieGoal: 0,
    };

    // Workout Category Chart (Bar)
    const categories = { Strength: 0, Cardio: 0, Flexibility: 0 };
    workouts.forEach((w) => categories[w.category]++);

    if (workoutCategoryChart) workoutCategoryChart.destroy();
    workoutCategoryChart = new Chart(
      document.getElementById("workout-category-chart"),
      {
        type: "bar",
        data: {
          labels: ["Strength", "Cardio", "Flexibility"],
          datasets: [
            {
              label: "Number of Workouts",
              data: [
                categories.Strength,
                categories.Cardio,
                categories.Flexibility,
              ],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              borderColor: "#1f2937",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#e5e7eb", stepSize: 1 },
              grid: { color: "#374151" },
            },
            x: { ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Workout Category Distribution",
              color: "#e5e7eb",
              font: { size: 16 },
            },
          },
        },
      }
    );

    // Workout Stats Chart (Bar)
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);

    if (workoutStatsChart) workoutStatsChart.destroy();
    workoutStatsChart = new Chart(
      document.getElementById("workout-stats-chart"),
      {
        type: "bar",
        data: {
          labels: [
            "Total Duration (min)",
            "Total Calories Burned",
            "Total Sets",
          ],
          datasets: [
            {
              label: "Workout Stats",
              data: [totalDuration, totalCalories, totalSets],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              borderColor: "#1f2937",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#e5e7eb" },
              grid: { color: "#374151" },
            },
            x: { ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Workout Statistics",
              color: "#e5e7eb",
              font: { size: 16 },
            },
          },
        },
      }
    );

    // Daily Progress Chart (Bar)
    const ctx = document.getElementById("progress-chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Steps", "Water", "Calorie Intake"],
        datasets: [
          {
            label: "Daily Progress",
            data: [
              JSON.parse(localStorage.getItem("dailyStats"))?.steps || 0,
              JSON.parse(localStorage.getItem("dailyStats"))?.water || 0,
              JSON.parse(localStorage.getItem("dailyStats"))?.calorieIntake ||
                0,
            ],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
            borderColor: "#1f2937",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#e5e7eb" },
            grid: { color: "#374151" },
          },
          x: { ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Daily Progress", color: "#e5e7eb" },
        },
      },
    });
  } catch (e) {
    console.error("Update charts error:", e);
  }
}

// Initialize App
initializeStorage();
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser && currentUser.email) {
  showMain();
  updateProfile();
  updateDashboard();
  updateGoals();
  updateWorkoutList();
  updateCharts();
} else {
  showLogin();
}
