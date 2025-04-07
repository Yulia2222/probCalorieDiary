<template>
  <div v-if="isSearchVisible" class="search">
    <button @click="closeSearch" class="close-btn">×</button>

    <h2 class="title">Поиск продуктов</h2>

    <div class="input-container">
      <label for="dishName" class="label">Название продукта</label>
      <input
          id="dishName"
          v-model="dishName"
          type="text"
          placeholder="Введите название продукта"
          class="input"
          @input="fetchProductSuggestions"
      />
      <ul v-if="suggestions.length" class="suggestions-list">
        <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.name }}
        </li>
      </ul>
    </div>

    <div class="input-container">
      <label for="weight" class="label">Вес (в граммах)</label>
      <input
          id="weight"
          :value="weight"
          @input="handleWeightInput"
          type="number"
          placeholder="Введите вес продукта"
          class="input"
      />
    </div>

    <button
        @click="fetchFoods"
        class="btn-primary"
    >
      Найти продукт
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="food && !errorMessage" class="result-section">
      <div v-if="weight > 0" class="result-box">
        <h4 class="result-title">Итоговые значения для {{ weight }} г:</h4>
        <p class="result-item">Калории: {{ calculateNutrition(food.nutrition.calories).toFixed(2) }} ккал</p>
        <p class="result-item">Белки: {{ calculateNutrition(food.nutrition.protein).toFixed(2) }} г.</p>
        <p class="result-item">Жиры: {{ calculateNutrition(food.nutrition.fat).toFixed(2) }} г.</p>
        <p class="result-item">Углеводы: {{ calculateNutrition(food.nutrition.carbs).toFixed(2) }} г.</p>
      </div>
      <button @click="emitAddFoodToMeal" class="btn-primary">Добавить в прием пищи</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";

const props = defineProps({
  isSearchVisible: {
    type: Boolean,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  food: {
    type: Object,
    default: null,
  },
  weight: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['fetch-foods', 'select-suggestion', 'close', 'add-food-to-meal', 'update:weight',]);

const dishName = ref('');
const suggestions = ref([]);
const errorMessage = ref('');

const fetchProductSuggestions = async () => {
  if (dishName.value.trim().length < 2) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/food-items/suggest', {
      params: { query: dishName.value },
    });
    suggestions.value = response.data || [];
    errorMessage.value = '';
  } catch (error) {
    console.error('Ошибка при получении подсказок:', error);
    suggestions.value = [];
    errorMessage.value = 'Ошибка при загрузке подсказок';
  }
};

const selectSuggestion = (suggestion) => {
  dishName.value = suggestion.name;
  suggestions.value = [];
  emit('select-suggestion', suggestion);
};

const fetchFoods = async () => {
  if (!dishName.value.trim()) {
    errorMessage.value = 'Введите название продукта';
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/food-items/search', {
      params: { name: dishName.value },
    });

    if (response.data) {
      emit('fetch-foods', { dishName: dishName.value, weight: props.weight, mealType: props.mealType });
      errorMessage.value = '';
    } else {
      errorMessage.value = 'Продукт не найден';
    }
  } catch (error) {
    console.error('Ошибка при поиске продукта:', error);
    errorMessage.value = 'Ошибка при поиске продукта';
  }
};

const closeSearch = () => {
  emit('close');
};

const emitAddFoodToMeal = () => {
  emit('add-food-to-meal');
};

const handleWeightInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update:weight', Number(input.value));
};

const calculateNutrition = (value: number) => {
  return props.weight > 0 ? (value / 100) * props.weight : 0;
};
</script>

<style scoped>
.search {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: 40px;
  background-color: #caefde;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.input-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input{
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.result-section {
  margin-top: 1rem;
}

.result-box {
  background-color: #eef9e8;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.result-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.result-item {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.error-message {
  color: #ff0000;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>