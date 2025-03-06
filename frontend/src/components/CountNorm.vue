<template>
  <div class="profile-container">
    <p>Ваш BMR: {{ bmr }} ккал</p>
    <p>Норма белков: {{ protein }} г</p>
    <p>Норма жиров: {{ fat }} г</p>
    <p>Норма углеводов: {{ carbs }} г</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useNutritionStore } from '../stores/nutritionStore';

const nutritionStore = useNutritionStore();

const route = useRoute();

const userAge = ref<number>();
const userWeight = ref<number>();
const userHeight = ref<number>();
const userGender = ref<string>();
const userActivityIndex = ref<number>();
const userGoal = ref<string>();

const activityMultipliers = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

const goalMultipliers = {
  Lose: 0.8,
  Maintain: 1,
  Gain: 1.2,
};

const bmr = computed(() => {
  if (userAge.value && userWeight.value && userHeight.value && userGender.value && userActivityIndex.value && userGoal.value) {
    let baseBMR: number;

    if (userGender.value === 'male') {
      baseBMR = 88.36 + (13.4 * userWeight.value) + (4.8 * userHeight.value) - (5.7 * userAge.value);
    } else {
      baseBMR = 447.6 + (9.2 * userWeight.value) + (3.1 * userHeight.value) - (4.3 * userAge.value);
    }

    const activityMultiplier = activityMultipliers[userActivityIndex.value] || 1.2;
    let finalBMR = baseBMR * activityMultiplier;

    const goalMultiplier = goalMultipliers[userGoal.value] || 1;
    finalBMR *= goalMultiplier;
    nutritionStore.setBMR(Math.round(finalBMR));
    return Math.round(finalBMR);
  }

  return 0;
});

const protein = computed(() => {
  if (userWeight.value && bmr.value) {
    let proteinRatio = 1.5;

    if (userGoal.value === 'Gain') {
      proteinRatio = 2.0;
    } else if (userGoal.value === 'Lose') {
      proteinRatio = 1.2;
    }

    if (userActivityIndex.value && userActivityIndex.value > 3) {
      proteinRatio += 0.2;
    }

    const proteinAmount = userWeight.value * proteinRatio;
    nutritionStore.setProtein(Math.round(proteinAmount));
    return Math.round(proteinAmount);
  }
  return 0;
});

const fat = computed(() => {
  if (bmr.value) {
    let fatRatio = 0.25;

    if (userGoal.value === 'Gain') {
      fatRatio = 0.3;
    } else if (userGoal.value === 'Lose') {
      fatRatio = 0.2;
    }

    const fatCalories = bmr.value * fatRatio;
    const fatAmount = fatCalories / 9;
    nutritionStore.setFat(Math.round(fatAmount));
    return Math.round(fatAmount);
  }
  return 0;
});

const carbs = computed(() => {
  if (bmr.value) {
    const proteinCalories = protein.value * 4;
    const fatCalories = fat.value * 9;
    const remainingCalories = bmr.value - (proteinCalories + fatCalories);

    let carbsRatio = 0.55;
    if (userGoal.value === 'Gain') {
      carbsRatio = 0.6;
    } else if (userGoal.value === 'Lose') {
      carbsRatio = 0.5;
    }

    const carbsAmount = remainingCalories * carbsRatio / 4;
    nutritionStore.setCarbs(Math.round(carbsAmount));
    return Math.round(carbsAmount);
  }
  return 0;
});

onMounted(async () => {
  const userId = route.params.id;
  try {
    const response = await axios.get(`http://localhost:8080/users/${userId}`);
    userAge.value = response.data.age;
    userWeight.value = response.data.weight;
    userHeight.value = response.data.height;
    userGender.value = response.data.gender;
    userActivityIndex.value = response.data.activityIndex;
    userGoal.value = response.data.target;
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

h2 {
  font-size: 2rem;
  color: #2f855a;
}

p {
  font-size: 1.25rem;
  color: #333;
}
</style>
