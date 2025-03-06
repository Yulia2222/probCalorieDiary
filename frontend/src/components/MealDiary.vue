<template>
  <div class="meal-diary-section">
    <div class="header">
      <h2 class="meal-diary-title">Дневник питания</h2>
      <button @click="openRecipeSearch" class="btn-recipe">Добавить блюдо</button>
    </div>
    <div class="meal-type">
      <div class="meal-type-header">
        <h3 class="meal-type-title">Завтрак</h3>
        <button @click="openSearch('breakfast')" class="btn-add">+</button>
      </div>
      <div class="meal-items">
        <div v-for="(item, index) in mealDiary.breakfast" :key="index" class="meal-item">
          <div class="meal-item-content">
            <span>{{ item.food_name }} - {{ item.totalCalories.toFixed(2) }} ккал</span>
            <p>{{ item.totalWeight }} г, Б: {{ item.totalProtein.toFixed(2) }} г, Ж: {{ item.totalFat.toFixed(2) }} г, У: {{ item.totalCarbs.toFixed(2) }} г</p>
          </div>
          <div class="meal-item-actions">
            <button @click="removeFoodFromMeal('breakfast', index)" class="btn-danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div class="meal-type">
      <div class="meal-type-header">
        <h3 class="meal-type-title">Обед</h3>
        <button @click="openSearch('lunch')" class="btn-add">+</button>
      </div>
      <div class="meal-items">
        <div v-for="(item, index) in mealDiary.lunch" :key="index" class="meal-item">
          <div class="meal-item-content">
            <span>{{ item.food_name }} - {{ item.totalCalories.toFixed(2) }} ккал</span>
            <p>{{ item.totalWeight }} г, Б: {{ item.totalProtein.toFixed(2) }} г, Ж: {{ item.totalFat.toFixed(2) }} г, У: {{ item.totalCarbs.toFixed(2) }} г</p>
          </div>
          <div class="meal-item-actions">
            <button @click="removeFoodFromMeal('lunch', index)" class="btn-danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div class="meal-type">
      <div class="meal-type-header">
        <h3 class="meal-type-title">Ужин</h3>
        <button @click="openSearch('dinner')" class="btn-add">+</button>
      </div>
      <div class="meal-items">
        <div v-for="(item, index) in mealDiary.dinner" :key="index" class="meal-item">
          <div class="meal-item-content">
            <span>{{ item.food_name }} - {{ item.totalCalories.toFixed(2) }} ккал</span>
            <p>{{ item.totalWeight }} г, Б: {{ item.totalProtein.toFixed(2) }} г, Ж: {{ item.totalFat.toFixed(2) }} г, У: {{ item.totalCarbs.toFixed(2) }} г</p>
          </div>
          <div class="meal-item-actions">
            <button @click="removeFoodFromMeal('dinner', index)" class="btn-danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div class="meal-type">
      <div class="meal-type-header">
        <h3 class="meal-type-title">Перекус</h3>
        <button @click="openSearch('snack')" class="btn-add">+</button>
      </div>
      <div class="meal-items">
        <div v-for="(item, index) in mealDiary.snack" :key="index" class="meal-item">
          <div class="meal-item-content">
            <span>{{ item.food_name }} - {{ item.totalCalories.toFixed(2) }} ккал</span>
            <p>{{ item.totalWeight }} г, Б: {{ item.totalProtein.toFixed(2) }} г, Ж: {{ item.totalFat.toFixed(2) }} г, У: {{ item.totalCarbs.toFixed(2) }} г</p>
          </div>
          <div class="meal-item-actions">
            <button @click="removeFoodFromMeal('snack', index)" class="btn-danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  mealDiary: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open-search', 'remove-food', 'open-recipe-search']);

const openSearch = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
  emit('open-search', type);
};

const removeFoodFromMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', index: number) => {
  emit('remove-food', mealType, index);
};

const openRecipeSearch = () => {
  emit('open-recipe-search');
};
</script>

<style scoped>
.meal-diary-section {
  margin-top: 2rem;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meal-diary-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.btn-recipe {
  background-color: #87b38d;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-recipe:hover {
  background-color: #324c2f;
}

.meal-type {
  margin-top: 1.5rem;
}

.meal-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meal-type-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.btn-add {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #45a049;
}

.meal-items {
  margin-top: 12px;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.meal-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.meal-item-content {
  flex: 1;
}

.meal-item span {
  font-size: 1rem;
  color: #555;
}

.meal-item-actions {
  display: flex;
  align-items: center;
}

.btn-danger {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #e53935;
}
</style>
