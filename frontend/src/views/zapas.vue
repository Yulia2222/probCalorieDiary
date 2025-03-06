<template>
  <div class="container">
    <DateSelection v-model="diaryDate" @date-change="fetchUserMealDiary" />

    <div v-if="hasNutritionData" class="total-nutrition-section">
      <h2 class="total-nutrition-title">Итоги за день ({{ formattedDiaryDate }}) </h2>
      <div class="progress-item">
        <p>Калории: {{ totalNutrition.calories.toFixed(2) }} ккал из {{ totalCaloriesNorm }}</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.calories / totalCaloriesNorm) * 100 + '%' }"></div>
        </div>
      </div>
      <div class="progress-item">
        <p>Белки: {{ totalNutrition.protein.toFixed(2) }} г. из {{ totalProteinNorm }}</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.protein / totalProteinNorm) * 100 + '%' }"></div>
        </div>
      </div>
      <div class="progress-item">
        <p>Жиры: {{ totalNutrition.fat.toFixed(2) }} г. из {{ totalFatNorm }}</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.fat / totalFatNorm) * 100 + '%' }"></div>
        </div>
      </div>

      <div class="progress-item">
        <p>Углеводы: {{ totalNutrition.carbs.toFixed(2) }} г. из {{ totalCarbsNorm }}</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (totalNutrition.carbs / totalCarbsNorm) * 100 + '%' }"></div>
        </div>
      </div>
    </div>
    <RecipeSearch/>
    <div class="search">
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
            v-model="weight"
            type="number"
            placeholder="Введите вес продукта"
            class="input"
        />
      </div>

      <div class="input-container">
        <label for="mealType" class="label">Выберите прием пищи</label>
        <select v-model="mealType" id="mealType" class="select-input">
          <option value="breakfast">Завтрак</option>
          <option value="lunch">Обед</option>
          <option value="dinner">Ужин</option>
          <option value="snack">Перекус</option>
        </select>
      </div>

      <button
          @click="fetchFoods"
          class="btn-primary"
      >
        Найти продукт
      </button>
    </div>


    <div v-if="food" class="result-section">
      <div v-if="weight > 0" class="result-box">
        <h4 class="result-title">Итоговые значения для {{ weight }} г:</h4>
        <p class="result-item">Калории: {{ calculateNutrition(food.nutrition.calories.toFixed(2)).toFixed(2) }} ккал</p>
        <p class="result-item">Белки: {{ calculateNutrition(food.nutrition.protein.toFixed(2)).toFixed(2) }} г.</p>
        <p class="result-item">Жиры: {{ calculateNutrition(food.nutrition.fat.toFixed(2)).toFixed(2) }} г.</p>
        <p class="result-item">Углеводы: {{ calculateNutrition(food.nutrition.carbs.toFixed(2)).toFixed(2) }} г.</p>
      </div>

      <button
          @click="addFoodToMeal"
          class="btn-secondary"
      >
        Добавить в прием пищи
      </button>
    </div>

    <div
        v-if="mealDiary.breakfast.length || mealDiary.lunch.length || mealDiary.dinner.length || mealDiary.snack.length"
        class="meal-diary-section">
      <h2 class="meal-diary-title">Дневник питания</h2>

      <div v-if="mealDiary.breakfast.length" class="meal-type">
        <h3 class="meal-type-title">Завтрак:</h3>
        <ul>
          <li v-for="(item, index) in mealDiary.breakfast" :key="index" class="li">
            {{ item.food_name }} - Калории: {{ item.totalCalories.toFixed(2) }} ккал, Белки:
            {{ item.totalProtein.toFixed(2) }} г., Жиры: {{ item.totalFat.toFixed(2) }} г., Углеводы:
            {{ item.totalCarbs.toFixed(2) }} г.
            <button @click="removeFoodFromMeal('breakfast', index)" class="btn-danger">Удалить</button>
          </li>

        </ul>
      </div>

      <div v-if="mealDiary.lunch.length" class="meal-type">
        <h3 class="meal-type-title">Обед:</h3>
        <ul>
          <li v-for="(item, index) in mealDiary.lunch" :key="index" class="li">
            {{ item.food_name }} - Калории: {{ item.totalCalories.toFixed(2) }} ккал, Белки:
            {{ item.totalProtein.toFixed(2) }} г., Жиры: {{ item.totalFat.toFixed(2) }} г., Углеводы:
            {{ item.totalCarbs.toFixed(2) }} г.
            <button @click="removeFoodFromMeal('lunch', index)" class="btn-danger">Удалить</button>
          </li>
        </ul>
      </div>

      <div v-if="mealDiary.dinner.length" class="meal-type">
        <h3 class="meal-type-title">Ужин:</h3>
        <ul>
          <li v-for="(item, index) in mealDiary.dinner" :key="index" class="li">
            {{ item.food_name }} - Калории: {{ item.totalCalories.toFixed(2) }} ккал, Белки:
            {{ item.totalProtein.toFixed(2) }} г., Жиры: {{ item.totalFat.toFixed(2) }} г., Углеводы:
            {{ item.totalCarbs.toFixed(2) }} г.
            <button @click="removeFoodFromMeal('dinner', index)" class="btn-danger">Удалить</button>
          </li>
        </ul>
      </div>

      <div v-if="mealDiary.snack.length" class="meal-type">
        <h3 class="meal-type-title">Перекус:</h3>
        <ul>
          <li v-for="(item, index) in mealDiary.snack" :key="index" class="li">
            {{ item.food_name }} - Калории: {{ item.totalCalories.toFixed(2) }} ккал, Белки:
            {{ item.totalProtein.toFixed(2) }} г., Жиры: {{ item.totalFat.toFixed(2) }} г., Углеводы:
            {{ item.totalCarbs.toFixed(2) }} г.
            <button @click="removeFoodFromMeal('snack', index)" class="btn-danger">Удалить</button>
          </li>
        </ul>
      </div>
    </div>

    <div
        v-if="mealDiary.breakfast.length || mealDiary.lunch.length || mealDiary.dinner.length || mealDiary.snack.length"
        class="additional-nutrition-section">
      <h2 class="additional-nutrition-title">Дополнительные составляющие</h2>
      <div class="additional-category">
        <h3>Вода и клетчатка</h3>
        <ul>
          <li>Вода: {{ additionalNutrition.water.toFixed(2) }} г.</li>
          <li>Клетчатка: {{ additionalNutrition.fiber.toFixed(2) }} г.</li>
        </ul>
      </div>

      <div class="additional-category">
        <h3>Витамины</h3>
        <ul>
          <li
              v-for="key in displayedVitamins"
              :key="key"
          >
            {{ aliases[key] || key }}: {{ additionalNutrition[key].toFixed(2) }} мг.
          </li>
        </ul>
      </div>

      <div class="additional-category">
        <h3>Минералы</h3>
        <ul>
          <li
              v-for="key in displayedMinerals"
              :key="key"
          >
            {{ aliases[key] || key }}: {{ additionalNutrition[key].toFixed(2) }} мг.
          </li>
        </ul>
      </div>

      <div class="additional-category">
        <h3>Жирные кислоты</h3>
        <ul>
          <li
              v-for="key in displayedFats"
              :key="key"
          >
            {{ aliases[key] || key }}: {{ additionalNutrition[key].toFixed(2) }} г.
          </li>
        </ul>
      </div>
    </div>

    <p v-else v-if="searching" class="text-gray-500">Ищем продукт...</p>
    <p v-else v-if="!searching && !food && productNotFound" class="text-red-500">Продукт не найден.</p>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import axios from 'axios';
import {useRoute} from 'vue-router';
import {aliases, displayedMinerals, displayedFats, displayedVitamins} from '../assets/aliases.js';
import RecipeSearch from "../components/RecipeSearch.vue";
import DateSelection from '../components/DateSelection.vue';
import {useNutritionStore} from '../stores/nutritionStore';
import {useMineralsStore} from "../stores/minerals";
import {storeToRefs} from "pinia";

const nutritionStore = useNutritionStore();

const totalCaloriesNorm = computed(() => nutritionStore.bmr);
const totalProteinNorm = computed(() => nutritionStore.protein);
const totalFatNorm = computed(() => nutritionStore.fat);
const totalCarbsNorm = computed(() => nutritionStore.carbs);


const route = useRoute();
const userId = route.params.id;
const productNotFound = ref(false);
const diaryDate = ref(new Date().toISOString().substr(0, 10));
const dishName = ref('');
const weight = ref(0);
const food = ref(null);
const searching = ref(false);
const suggestions = ref([]);
const mineralsStore = useMineralsStore();
const {additionalNutrition} = storeToRefs(mineralsStore);


const mealType = ref<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
const mealDiary = ref({
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: [],
});

const totalNutrition = ref({
  calories: 0,
  fat: 0,
  carbs: 0,
  protein: 0,
});

watch(diaryDate, (newDate) => {
  fetchUserMealDiary();
});


const fetchProductSuggestions = async () => {
  if (dishName.value.trim().length < 2) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/food-items/suggest', {
      params: {query: dishName.value},
    });
    suggestions.value = response.data || [];
  } catch (error) {
    console.error('Ошибка при получении подсказок:', error);
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  dishName.value = suggestion.name;
  suggestions.value = [];
};

const hasNutritionData = computed(() => {
  return totalNutrition.value.calories > 0 || totalNutrition.value.protein > 0 ||
      totalNutrition.value.fat > 0 || totalNutrition.value.carbs > 0;
});

const formattedDiaryDate = computed(() => {
  return new Date(diaryDate.value).toLocaleDateString();
});

function changeDate(days: number) {
  const currentDate = new Date(diaryDate.value);
  currentDate.setDate(currentDate.getDate() + days);
  diaryDate.value = currentDate.toISOString().slice(0, 10);
  fetchUserMealDiary();
}


async function removeFoodFromMeal(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', index: number) {
  const removedItem = mealDiary.value[mealType][index];
  try {
    const url = `http://localhost:8080/products/${userId}/remove-food`;
    await axios.delete(url, {
      data: {
        date: diaryDate.value,
        mealType: mealType,
        foodName: removedItem.food_name,
      },
    });

    totalNutrition.value.calories -= removedItem.totalCalories;
    totalNutrition.value.protein -= removedItem.totalProtein;
    totalNutrition.value.fat -= removedItem.totalFat;
    totalNutrition.value.carbs -= removedItem.totalCarbs;


    mealDiary.value[mealType].splice(index, 1);

    await mineralsStore.recalculateAdditionalNutrition(userId, diaryDate.value);

  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    alert('Не удалось удалить продукт. Пожалуйста, попробуйте еще раз.');
  }
}


async function fetchUserMealDiary() {
  try {
    const url = `http://localhost:8080/products/${userId}/diary`;
    const {data} = await axios.get(url, {
      params: {date: diaryDate.value}
    });

    resetDiaryData();

    data.forEach((item: any) => {
      mealDiary.value[item.type].push({
        food_name: item.name,
        totalCalories: item.calories,
        totalProtein: item.protein,
        totalFat: item.fat,
        totalCarbs: item.carbs,
      });

      totalNutrition.value.calories += item.calories;
      totalNutrition.value.protein += item.protein;
      totalNutrition.value.fat += item.fat;
      totalNutrition.value.carbs += item.carbs;
    });
    data.forEach((item: any) => {
      Object.keys(additionalNutrition.value).forEach((key) => {
        additionalNutrition.value[key] += item[key] || 0;
      });
    });

  } catch (error) {
    console.error('Ошибка при загрузке дневника питания:', error);
  }
}

function resetDiaryData() {
  mealDiary.value = {breakfast: [], lunch: [], dinner: [], snack: []};
  totalNutrition.value = {calories: 0, fat: 0, carbs: 0, protein: 0};
}


onMounted(async () => {
  await fetchUserMealDiary();
  await nutritionStore.initializeNutritionData(userId);
});


async function fetchFoods() {
  if (!dishName.value) {
    alert('Пожалуйста, укажите название продукта.');
    return;
  }

  searching.value = true;
  productNotFound.value = false;
  try {
    const url = 'http://localhost:8080/food-items/search';
    const {data} = await axios.get(url, {
      params: {name: dishName.value},
    });

    if (data) {
      const {name, ...nutritionData} = data;
      food.value = {
        food_name: name,
        nutrition: nutritionData
      };

    } else {
      food.value = null;
      productNotFound.value = true;
    }
  } catch (error) {
    console.error('Ошибка при поиске продукта:', error);
    food.value = null;
    productNotFound.value = true;
  } finally {
    searching.value = false;
  }
}


function calculateNutrition(value: number) {
  return weight.value > 0 ? (value / 100) * weight.value : 0;
}


async function addFoodToMeal() {
  if (!food.value || weight.value <= 0) {
    alert('Убедитесь, что продукт найден и вес указан корректно.');
    return;
  }

  const calculateNutrition = (value) => (value ? (value * weight.value) / 100 : 0);
  const product = {
    ...food.value,
    totalCalories: calculateNutrition(food.value.nutrition.calories),
    totalProtein: calculateNutrition(food.value.nutrition.protein),
    totalFat: calculateNutrition(food.value.nutrition.fat),
    totalCarbs: calculateNutrition(food.value.nutrition.carbs),
    totalFiber: calculateNutrition(food.value.nutrition.fiber),
    totalWater: calculateNutrition(food.value.nutrition.water),
    vitaminA: calculateNutrition(food.value.nutrition.vitaminA),
    vitaminB1: calculateNutrition(food.value.nutrition.vitaminB1),
    vitaminB2: calculateNutrition(food.value.nutrition.vitaminB2),
    vitaminB3: calculateNutrition(food.value.nutrition.vitaminB3),
    vitaminB5: calculateNutrition(food.value.nutrition.vitaminB5),
    vitaminB6: calculateNutrition(food.value.nutrition.vitaminB6),
    vitaminB12: calculateNutrition(food.value.nutrition.vitaminB12),
    vitaminB13: calculateNutrition(food.value.nutrition.vitaminB13),
    vitaminB15: calculateNutrition(food.value.nutrition.vitaminB15),
    vitaminC: calculateNutrition(food.value.nutrition.vitaminC),
    vitaminD: calculateNutrition(food.value.nutrition.vitaminD),
    vitaminE: calculateNutrition(food.value.nutrition.vitaminE),
    vitaminK: calculateNutrition(food.value.nutrition.vitaminK),
    vitaminP: calculateNutrition(food.value.nutrition.vitaminP),
    vitaminT: calculateNutrition(food.value.nutrition.vitaminT),
    calcium: calculateNutrition(food.value.nutrition.calcium),
    iron: calculateNutrition(food.value.nutrition.iron),
    potassium: calculateNutrition(food.value.nutrition.potassium),
    copper: calculateNutrition(food.value.nutrition.copper),
    manganese: calculateNutrition(food.value.nutrition.manganese),
    magnesium: calculateNutrition(food.value.nutrition.magnesium),
    sodium: calculateNutrition(food.value.nutrition.sodium),
    sulfur: calculateNutrition(food.value.nutrition.sulfur),
    silicon: calculateNutrition(food.value.nutrition.silicon),
    zinc: calculateNutrition(food.value.nutrition.zinc),
    selenium: calculateNutrition(food.value.nutrition.selenium),
    chromium: calculateNutrition(food.value.nutrition.chromium),
    iodine: calculateNutrition(food.value.nutrition.iodine),
    saturatedFats: calculateNutrition(food.value.nutrition.saturatedFats),
    monounsaturatedFats: calculateNutrition(food.value.nutrition.monounsaturatedFats),
    polyunsaturatedFats: calculateNutrition(food.value.nutrition.polyunsaturatedFats),
    omega3: calculateNutrition(food.value.nutrition.omega3),
    omega6: calculateNutrition(food.value.nutrition.omega6),
    transFats: calculateNutrition(food.value.nutrition.transFats),

  };

  mealDiary.value[mealType.value].push(product);
  totalNutrition.value.calories += product.totalCalories;
  totalNutrition.value.protein += product.totalProtein;
  totalNutrition.value.fat += product.totalFat;
  totalNutrition.value.carbs += product.totalCarbs;

  try {
    const url = 'http://localhost:8080/products';
    const diaryDateWithTime = new Date(diaryDate.value);
    diaryDateWithTime.setHours(14, 0, 0, 0);

    await axios.post(url, {
      userId,
      name: product.food_name,
      calories: product.totalCalories,
      protein: product.totalProtein,
      fat: product.totalFat,
      carbs: product.totalCarbs,
      fiber: product.totalFiber,
      water: product.totalWater,
      type: mealType.value,
      addedBy: userId,
      weight: weight.value,
      vitaminA: product.vitaminA,
      vitaminB1: product.vitaminB1,
      vitaminB2: product.vitaminB2,
      vitaminB3: product.vitaminB3,
      vitaminB5: product.vitaminB5,
      vitaminB6: product.vitaminB6,
      vitaminB12: product.vitaminB12,
      vitaminB13: product.vitaminB13,
      vitaminB15: product.vitaminB15,
      vitaminC: product.vitaminC,
      vitaminD: product.vitaminD,
      vitaminE: product.vitaminE,
      vitaminK: product.vitaminK,
      vitaminP: product.vitaminP,
      vitaminT: product.vitaminT,
      calcium: product.calcium,
      iron: product.iron,
      potassium: product.potassium,
      copper: product.copper,
      manganese: product.manganese,
      magnesium: product.magnesium,
      sodium: product.sodium,
      sulfur: product.sulfur,
      silicon: product.silicon,
      zinc: product.zinc,
      selenium: product.selenium,
      chromium: product.chromium,
      iodine: product.iodine,
      saturatedFats: product.saturatedFats,
      monounsaturatedFats: product.monounsaturatedFats,
      polyunsaturatedFats: product.polyunsaturatedFats,
      omega3: product.omega3,
      omega6: product.omega6,
      transFats: product.transFats,
      createdAt: diaryDateWithTime.toISOString(),
    });
    console.log('Продукт успешно добавлен.');
    await mineralsStore.recalculateAdditionalNutrition(userId, diaryDate.value);
  } catch (error) {
    console.error('Ошибка при добавлении продукта:', error);
  }

  dishName.value = '';
  weight.value = 0;
  food.value = null;
}


</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
  border: none;
}

.container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.total-nutrition-section {
  background-color: #f7f7f7;
  padding: 30px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 600px;
}

.total-nutrition-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.total-nutrition-item {
  font-size: 1rem;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input, .select-input {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.li {
  display: flex;
  margin: 10px;
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
  margin-top: 2rem;
}

.btn-danger {
  background-color: #4CAF50;
  padding: 5px;
  border-radius: 5px;
}

.btn-danger:hover {
  background-color: #317034;
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

.date-selection {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-secondary {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.result-item {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.meal-diary-section {
  margin-top: 2rem;
  background-color: #eaeaea;
  padding: 30px;
  border-radius: 10px;
}

.meal-type-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.meal-type {
  margin-top: 1rem;
}

.meal-type ul {
  list-style-type: none;
  padding-left: 0;
}

.meal-type li {
  font-size: 1rem;
}

.text-gray-500 {
  color: #999;
}

.text-red-500 {
  color: red;
}

.search {
  padding: 40px;
  background-color: #caefde;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-selection {
  margin-top: 20px;
  margin-left: 30px;
}

.additional-nutrition-section {
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid #ccc;
}

.additional-category {
  margin-bottom: 10px;
}

.additional-category h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.additional-category ul {
  list-style-type: none;
  padding: 0;
}

.additional-category li {
  font-size: 1rem;
  margin: 3px 0;
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
  width: 600px;
  z-index: 10;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}


.progress-item {
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 10px;
  background-color: #76c7c0;
  transition: width 0.3s ease;
}

</style>
