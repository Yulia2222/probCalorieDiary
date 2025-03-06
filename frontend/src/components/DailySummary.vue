<template>
  <div v-if="hasNutritionData" class="nutrition-summary">
    <div class="calories-progress">
      <div class="circle-progress">
        <svg viewBox="0 0 100 100" class="progress-circle">
          <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              stroke-width="5"
          />
          <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#76c7c0"
              stroke-width="5"
              stroke-dasharray="282.7"
              :stroke-dashoffset="caloriesProgressOffset"
              transform="rotate(-90 50 50)"
          />
        </svg>
        <div class="progress-text">
          <span class="value">{{ totalNutrition.calories.toFixed(0) }} / {{ totalCaloriesNorm }}</span>
          <span class="label">ККАЛ</span>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat-item">
        <span class="label">Углеводы</span>
        <span class="value">{{ totalNutrition.carbs.toFixed(0) }} / {{ totalCarbsNorm }}г</span>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.carbs / totalCarbsNorm) * 100 + '%' }"></div>
        </div>
      </div>
      <div class="stat-item">
        <span class="label">Белки</span>
        <span class="value">{{ totalNutrition.protein.toFixed(0) }} / {{ totalProteinNorm }}г</span>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.protein / totalProteinNorm) * 100 + '%' }"></div>
        </div>
      </div>
      <div class="stat-item">
        <span class="label">Жиры</span>
        <span class="value">{{ totalNutrition.fat.toFixed(0) }} / {{ totalFatNorm }}г</span>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.fat / totalFatNorm) * 100 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  totalNutrition: {
    type: Object,
    required: true,
  },
  totalCaloriesNorm: {
    type: Number,
    required: true,
  },
  totalProteinNorm: {
    type: Number,
    required: true,
  },
  totalFatNorm: {
    type: Number,
    required: true,
  },
  totalCarbsNorm: {
    type: Number,
    required: true,
  },
  formattedDiaryDate: {
    type: String,
    required: true,
  },
});

const hasNutritionData = computed(() => {
  return (
      props.totalNutrition.calories > 0 ||
      props.totalNutrition.protein > 0 ||
      props.totalNutrition.fat > 0 ||
      props.totalNutrition.carbs > 0
  );
});

const caloriesProgressOffset = computed(() => {
  const circumference = 2 * Math.PI * 45;
  const progress = (props.totalNutrition.calories / props.totalCaloriesNorm);
  return circumference * (1 - progress);
});
</script>

<style scoped>
.nutrition-summary {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.calories-progress {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.circle-progress {
  position: relative;
  width: 130px;
  height: 130px;
}

.progress-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.progress-circle-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #76c7c0;
  clip: rect(0, 50px, 100px, 0);
  border-radius: 50%;
  transform-origin: center;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-text .value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.progress-text .label {
  font-size: 12px;
  color: #666;
}

.consumption, .remaining, .expenditure {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.consumption .label, .remaining .label, .expenditure .label {
  font-size: 14px;
  color: #666;
}

.consumption .value, .remaining .value, .expenditure .value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.remaining {
  text-align: center;
}

.remaining .value {
  font-size: 24px;
  color: #4CAF50;
}

.stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
}

.stat-item .value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 5px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s ease;
}
</style>