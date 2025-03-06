<template>
  <div class="container">
    <DateSelection v-model="diaryDate" @date-change="fetchUserMealDiary"/>
    <DailySummary
        :total-nutrition="totalNutrition"
        :total-calories-norm="totalCaloriesNorm"
        :total-protein-norm="totalProteinNorm"
        :total-fat-norm="totalFatNorm"
        :total-carbs-norm="totalCarbsNorm"
        :formatted-diary-date="formattedDiaryDate"
    />
    <RecipeSearch v-if="isRecipeSearchVisible" @close="closeRecipeSearch"/>
    <ProductSearch
        v-if="isSearchVisible"
        :is-search-visible="isSearchVisible"
        :meal-type="mealType"
        :food="food"
        :weight="weight"
        @update:weight="weight = $event"
        @fetch-foods="handleFetchFoods"
        @select-suggestion="handleSelectSuggestion"
        @close="closeSearch"
        @add-food-to-meal="addFoodToMeal"
    />

    <MealDiary
        :meal-diary="mealDiary"
        @open-search="openSearch"
        @remove-food="removeFoodFromMeal"
        @open-recipe-search="openRecipeSearch"
    />

    <AdditionalNutrition
        :additionalNutrition="additionalNutrition"
        :aliases="aliases"
        :displayedVitamins="displayedVitamins"
        :displayedMinerals="displayedMinerals"
        :displayedFats="displayedFats"
        :mealDiary="mealDiary"
    />

  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import axios from 'axios';
import {useRoute} from 'vue-router';
import {aliases, displayedMinerals, displayedFats, displayedVitamins} from '../assets/aliases.js';
import RecipeSearch from "../components/RecipeSearch.vue";
import DateSelection from '../components/DateSelection.vue';
import DailySummary from '../components/DailySummary.vue';
import MealDiary from '../components/MealDiary.vue';
import {useNutritionStore} from '../stores/nutritionStore';
import {useMineralsStore} from "../stores/minerals";
import {storeToRefs} from "pinia";
import ProductSearch from "../components/ProductSearch.vue";
import AdditionalNutrition from '../components/AdditionalNutrition.vue';

const isSearchVisible = ref(false);
const isRecipeSearchVisible = ref(false);

const openRecipeSearch = () => {
  isRecipeSearchVisible.value = true;
};

const closeRecipeSearch = () => {
  isRecipeSearchVisible.value = false;
};

const handleFetchFoods = ({dishName, weight, mealType}) => {
  fetchFoods(dishName, weight, mealType);
};

const handleSelectSuggestion = (suggestion) => {
  selectSuggestion(suggestion);
};

const openSearch = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
  mealType.value = type;
  console.log("type", mealType.value)
  isSearchVisible.value = true;
};

const closeSearch = () => {
  isSearchVisible.value = false;
};

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


const selectSuggestion = (suggestion) => {
  dishName.value = suggestion.name;
  suggestions.value = [];
};


const formattedDiaryDate = computed(() => {
  return new Date(diaryDate.value).toLocaleDateString();
});


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
        totalWeight: item.weight
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


const fetchFoods = async (dishName: string, weight1: number, mealType1: string) => {
  if (!dishName) {
    alert('Пожалуйста, укажите название продукта.');
    return;
  }

  searching.value = true;
  productNotFound.value = false;
  try {
    const url = 'http://localhost:8080/food-items/search';
    const {data} = await axios.get(url, {
      params: {name: dishName},
    });

    if (data) {
      weight.value = weight1;
      mealType.value = mealType1 as "breakfast" | "lunch" | "dinner" | "snack";
      const {name, ...nutritionData} = data;
      food.value = {
        food_name: name,
        nutrition: nutritionData,
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
};


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
    totalWeight: weight.value,

  };
  console.log("type2", mealType.value)
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
  isSearchVisible.value = false;
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

.result-section {
  margin-top: 2rem;
}

.btn-recipe {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
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

.meal-type ul {
  list-style-type: none;
  padding-left: 0;
}

.meal-type li {
  font-size: 1rem;
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

</style>
