<template>
  <div class="container">
    <button @click="closeComponent" class="close-button">×</button>
    <h2 class="title">Поиск рецепта</h2>

    <div class="input-container">
      <input
          v-model="dishName"
          type="text"
          placeholder="Введите название блюда"
          class="input"
          @input="fetchDishSuggestions"
      />
      <div v-if="dishSuggestions.length" class="suggestions-container">
        <div
            v-for="(suggestion, index) in dishSuggestions"
            :key="index"
            @click="selectDishSuggestion(suggestion)"
            class="suggestion-item"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <label for="userHints" class="label">Подсказки (через запятую)</label>
      <input
          v-model="userHintsInput"
          id="userHints"
          type="text"
          class="input"
          placeholder="Например, курица, картофель, морковь"
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

    <div class="input-container">
      <label for="portionWeight" class="label">Вес порции (г)</label>
      <input
          v-model.number="portionWeight"
          id="portionWeight"
          type="number"
          min="1"
          class="input"
          placeholder="Введите вес порции"
      />
    </div>

    <button
        @click="calculateExpectedNutritionWithBayes"
        :disabled="loading"
        class="button search-button"
    >
      {{ loading ? "Загрузка..." : "Найти" }}
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="nutrition" class="nutrition-container">
      <h3 class="subtitle">Рассчитанное КБЖУ:</h3>
      <div class="nutrition-values">
        <p class="p">Калории: {{ nutrition.calories.toFixed(2) }} ккал</p>
        <p class="p">Белки: {{ nutrition.protein.toFixed(2) }} г</p>
        <p class="p">Жиры: {{ nutrition.fat.toFixed(2) }} г</p>
        <p class="p">Углеводы: {{ nutrition.carbs.toFixed(2) }} г</p>
      </div>
    </div>

    <button
        @click="saveRecipeToDatabase"
        v-if="nutrition"
        class="button save-button"
    >
      Добавить в дневник
    </button>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {defineEmits} from 'vue';

const emit = defineEmits(['close']);
const route = useRoute();
const userId = route.params.id;
const dishSuggestions = ref<string[]>([]);
const API_BASE_URL = "http://localhost:8080";
const mealType = ref<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
const dishName = ref<string>("");
const portionWeight = ref<number>(150);
const userHintsInput = ref<string>("");
const userHints = computed(() => {
  return userHintsInput.value
      .split(",")
      .map((hint) => hint.trim().toLowerCase())
      .filter((hint) => hint.length > 0);
});
const nutrition = ref<{
  calories: number; protein: number; fat: number; carbs: number; vitaminA: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB3: number;
  vitaminB5: number;
  vitaminB6: number;
  vitaminB12: number;
  vitaminB13: number;
  vitaminB15: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  vitaminP: number;
  vitaminT: number;
  calcium: number;
  iron: number;
  potassium: number;
  copper: number;
  manganese: number;
  magnesium: number;
  sodium: number;
  sulfur: number;
  silicon: number;
  zinc: number;
  selenium: number;
  chromium: number;
  iodine: number;
  saturatedFats: number;
  monounsaturatedFats: number;
  polyunsaturatedFats: number;
  omega3: number;
  omega6: number;
  transFats: number;
  water: number;
  fiber: number;
} | null>(null);
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

function closeComponent() {
  emit('close');
}

async function fetchDishSuggestions() {
  if (dishName.value.length < 2) {
    dishSuggestions.value = [];
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/suggest`, {
      params: {query: dishName.value},
    });
    dishSuggestions.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке подсказок для блюд:", error);
    dishSuggestions.value = [];
  }
}

function selectDishSuggestion(suggestion: string) {
  dishName.value = suggestion;
  dishSuggestions.value = [];
}


async function fetchRecipe(name: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${name}`);
    console.log("res", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке рецепта:", error);
    return [];
  }
}

async function fetchIngredientInfo(ingredientName: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/food-items/search`, {
      params: {name: ingredientName},
    });

    return response.data;

  } catch (error) {
    console.error(`Ошибка при загрузке данных для ${ingredientName}:`, error);
    return {calories: 0, protein: 0, fat: 0, carbs: 0};
  }
}


async function calculateRecipeNutrition(ingredients: { name: string; quantity: string; unit: string }[]) {
  let totalCalories = 0,
      totalProtein = 0,
      totalFat = 0,
      totalCarbs = 0,
      totalWeight = 0,
      totalVitaminA = 0,
      totalVitaminB1 = 0,
      totalVitaminB2 = 0,
      totalVitaminB3 = 0,
      totalVitaminB5 = 0,
      totalVitaminB6 = 0,
      totalVitaminB12 = 0,
      totalVitaminB13 = 0,
      totalVitaminB15 = 0,
      totalVitaminC = 0,
      totalVitaminD = 0,
      totalVitaminE = 0,
      totalVitaminK = 0,
      totalVitaminP = 0,
      totalVitaminT = 0,
      totalCalcium = 0,
      totalIron = 0,
      totalPotassium = 0,
      totalCopper = 0,
      totalManganese = 0,
      totalMagnesium = 0,
      totalSodium = 0,
      totalSulfur = 0,
      totalSilicon = 0,
      totalZinc = 0,
      totalSelenium = 0,
      totalChromium = 0,
      totalIodine = 0,
      totalSaturatedFats = 0,
      totalMonounsaturatedFats = 0,
      totalPolyunsaturatedFats = 0,
      totalOmega3 = 0,
      totalOmega6 = 0,
      totalTransFats = 0,
      totalWater = 0,
      totalFiber = 0;

  for (const ingredient of ingredients) {
    const quantity = parseFloat(ingredient.quantity);
    const info = await fetchIngredientInfo(ingredient.name);

    totalCalories += (info.calories / 100) * quantity;
    totalProtein += (info.protein / 100) * quantity;
    totalFat += (info.fat / 100) * quantity;
    totalCarbs += (info.carbs / 100) * quantity;
    totalWeight += quantity;
    totalVitaminA += (info.vitaminA / 100) * quantity;
    totalVitaminB1 += (info.vitaminB1 / 100) * quantity;
    totalVitaminB2 += (info.vitaminB2 / 100) * quantity;
    totalVitaminB3 += (info.vitaminB3 / 100) * quantity;
    totalVitaminB5 += (info.vitaminB5 / 100) * quantity;
    totalVitaminB6 += (info.vitaminB6 / 100) * quantity;
    totalVitaminB12 += (info.vitaminB12 / 100) * quantity;
    totalVitaminB13 += (info.vitaminB13 / 100) * quantity;
    totalVitaminB15 += (info.vitaminB15 / 100) * quantity;
    totalVitaminC += (info.vitaminC / 100) * quantity;
    totalVitaminD += (info.vitaminD / 100) * quantity;
    totalVitaminE += (info.vitaminE / 100) * quantity;
    totalVitaminK += (info.vitaminK / 100) * quantity;
    totalVitaminP += (info.vitaminP / 100) * quantity;
    totalVitaminT += (info.vitaminT / 100) * quantity;
    totalCalcium += (info.calcium / 100) * quantity;
    totalIron += (info.iron / 100) * quantity;
    totalPotassium += (info.potassium / 100) * quantity;
    totalCopper += (info.copper / 100) * quantity;
    totalManganese += (info.manganese / 100) * quantity;
    totalMagnesium += (info.magnesium / 100) * quantity;
    totalSodium += (info.sodium / 100) * quantity;
    totalSulfur += (info.sulfur / 100) * quantity;
    totalSilicon += (info.silicon / 100) * quantity;
    totalZinc += (info.zinc / 100) * quantity;
    totalSelenium += (info.selenium / 100) * quantity;
    totalChromium += (info.chromium / 100) * quantity;
    totalIodine += (info.iodine / 100) * quantity;
    totalSaturatedFats += (info.saturatedFats / 100) * quantity;
    totalMonounsaturatedFats += (info.monounsaturatedFats / 100) * quantity;
    totalPolyunsaturatedFats += (info.polyunsaturatedFats / 100) * quantity;
    totalOmega3 += (info.omega3 / 100) * quantity;
    totalOmega6 += (info.omega6 / 100) * quantity;
    totalTransFats += (info.transFats / 100) * quantity;
    totalWater += (info.water / 100) * quantity;
    totalFiber += (info.fiber / 100) * quantity;
  }
  return {
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    totalWeight,
    totalVitaminA,
    totalVitaminB1,
    totalVitaminB2,
    totalVitaminB3,
    totalVitaminB5,
    totalVitaminB6,
    totalVitaminB12,
    totalVitaminB13,
    totalVitaminB15,
    totalVitaminC,
    totalVitaminD,
    totalVitaminE,
    totalVitaminK,
    totalVitaminP,
    totalVitaminT,
    totalCalcium,
    totalIron,
    totalPotassium,
    totalCopper,
    totalManganese,
    totalMagnesium,
    totalSodium,
    totalSulfur,
    totalSilicon,
    totalZinc,
    totalSelenium,
    totalChromium,
    totalIodine,
    totalSaturatedFats,
    totalMonounsaturatedFats,
    totalPolyunsaturatedFats,
    totalOmega3,
    totalOmega6,
    totalTransFats,
    totalWater,
    totalFiber
  };

}


async function saveRecipeToDatabase() {
  try {
    if (!nutrition.value) return;

    const diaryDateWithTime = new Date();
    diaryDateWithTime.setHours(14, 0, 0, 0);
    console.log("SEND", dishName.value, nutrition.value.calories, mealType.value, portionWeight)
    await axios.post(`${API_BASE_URL}/products`, {
      userId,
      name: dishName.value,
      calories: nutrition.value.calories,
      protein: nutrition.value.protein,
      fat: nutrition.value.fat,
      carbs: nutrition.value.carbs,
      fiber: nutrition.value.fiber,
      water: nutrition.value.water,
      type: mealType.value,
      addedBy: userId,
      weight: portionWeight.value,
      vitaminA: nutrition.value.vitaminA,
      vitaminB1: nutrition.value.vitaminB1,
      vitaminB2: nutrition.value.vitaminB2,
      vitaminB3: nutrition.value.vitaminB3,
      vitaminB5: nutrition.value.vitaminB5,
      vitaminB6: nutrition.value.vitaminB6,
      vitaminB12: nutrition.value.vitaminB12,
      vitaminB13: nutrition.value.vitaminB13,
      vitaminB15: nutrition.value.vitaminB15,
      vitaminC: nutrition.value.vitaminC,
      vitaminD: nutrition.value.vitaminD,
      vitaminE: nutrition.value.vitaminE,
      vitaminK: nutrition.value.vitaminK,
      vitaminP: nutrition.value.vitaminP,
      vitaminT: nutrition.value.vitaminT,
      calcium: nutrition.value.calcium,
      iron: nutrition.value.iron,
      potassium: nutrition.value.potassium,
      copper: nutrition.value.copper,
      manganese: nutrition.value.manganese,
      magnesium: nutrition.value.magnesium,
      sodium: nutrition.value.sodium,
      sulfur: nutrition.value.sulfur,
      silicon: nutrition.value.silicon,
      zinc: nutrition.value.zinc,
      selenium: nutrition.value.selenium,
      chromium: nutrition.value.chromium,
      iodine: nutrition.value.iodine,
      saturatedFats: nutrition.value.saturatedFats,
      monounsaturatedFats: nutrition.value.monounsaturatedFats,
      polyunsaturatedFats: nutrition.value.polyunsaturatedFats,
      omega3: nutrition.value.omega3,
      omega6: nutrition.value.omega6,
      transFats: nutrition.value.transFats,
      createdAt: diaryDateWithTime.toISOString(),
    });
    location.reload();
    console.log("Рецепт успешно добавлен в базу данных.");
  } catch (error) {
    console.error("Ошибка при добавлении рецепта в базу данных:", error);
  }
}


async function calculatePortionNutritionForRecipe(
    ingredients: { name: string; quantity: string; unit: string }[],
    portionWeight: number
) {
  const {
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    totalWeight,
    totalVitaminA,
    totalVitaminB1,
    totalVitaminB2,
    totalVitaminB3,
    totalVitaminB5,
    totalVitaminB6,
    totalVitaminB12,
    totalVitaminB13,
    totalVitaminB15,
    totalVitaminC,
    totalVitaminD,
    totalVitaminE,
    totalVitaminK,
    totalVitaminP,
    totalVitaminT,
    totalCalcium,
    totalIron,
    totalPotassium,
    totalCopper,
    totalManganese,
    totalMagnesium,
    totalSodium,
    totalSulfur,
    totalSilicon,
    totalZinc,
    totalSelenium,
    totalChromium,
    totalIodine,
    totalSaturatedFats,
    totalMonounsaturatedFats,
    totalPolyunsaturatedFats,
    totalOmega3,
    totalOmega6,
    totalTransFats,
    totalWater,
    totalFiber
  } =
      await calculateRecipeNutrition(ingredients);
  console.log("Total weight:", totalWeight, totalVitaminC);
  if (totalWeight === 0) return {
    calories: 0, protein: 0, fat: 0, carbs: 0, vitaminA: 0,
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB5: 0,
    vitaminB6: 0,
    vitaminB12: 0,
    vitaminB13: 0,
    vitaminB15: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    vitaminP: 0,
    vitaminT: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    copper: 0,
    manganese: 0,
    magnesium: 0,
    sodium: 0,
    sulfur: 0,
    silicon: 0,
    zinc: 0,
    selenium: 0,
    chromium: 0,
    iodine: 0,
    saturatedFats: 0,
    monounsaturatedFats: 0,
    polyunsaturatedFats: 0,
    omega3: 0,
    omega6: 0,
    transFats: 0,
    water: 0,
    fiber: 0,
  };

  return {
    calories: (totalCalories / totalWeight) * portionWeight,
    protein: (totalProtein / totalWeight) * portionWeight,
    fat: (totalFat / totalWeight) * portionWeight,
    carbs: (totalCarbs / totalWeight) * portionWeight,
    vitaminA: (totalVitaminA / totalWeight) * portionWeight,
    vitaminB1: (totalVitaminB1 / totalWeight) * portionWeight,
    vitaminB2: (totalVitaminB2 / totalWeight) * portionWeight,
    vitaminB3: (totalVitaminB3 / totalWeight) * portionWeight,
    vitaminB5: (totalVitaminB5 / totalWeight) * portionWeight,
    vitaminB6: (totalVitaminB6 / totalWeight) * portionWeight,
    vitaminB12: (totalVitaminB12 / totalWeight) * portionWeight,
    vitaminB13: (totalVitaminB13 / totalWeight) * portionWeight,
    vitaminB15: (totalVitaminB15 / totalWeight) * portionWeight,
    vitaminC: (totalVitaminC / totalWeight) * portionWeight,
    vitaminD: (totalVitaminD / totalWeight) * portionWeight,
    vitaminE: (totalVitaminE / totalWeight) * portionWeight,
    vitaminK: (totalVitaminK / totalWeight) * portionWeight,
    vitaminP: (totalVitaminP / totalWeight) * portionWeight,
    vitaminT: (totalVitaminT / totalWeight) * portionWeight,
    calcium: (totalCalcium / totalWeight) * portionWeight,
    iron: (totalIron / totalWeight) * portionWeight,
    potassium: (totalPotassium / totalWeight) * portionWeight,
    copper: (totalCopper / totalWeight) * portionWeight,
    manganese: (totalManganese / totalWeight) * portionWeight,
    magnesium: (totalMagnesium / totalWeight) * portionWeight,
    sodium: (totalSodium / totalWeight) * portionWeight,
    sulfur: (totalSulfur / totalWeight) * portionWeight,
    silicon: (totalSilicon / totalWeight) * portionWeight,
    zinc: (totalZinc / totalWeight) * portionWeight,
    selenium: (totalSelenium / totalWeight) * portionWeight,
    chromium: (totalChromium / totalWeight) * portionWeight,
    iodine: (totalIodine / totalWeight) * portionWeight,
    saturatedFats: (totalSaturatedFats / totalWeight) * portionWeight,
    monounsaturatedFats: (totalMonounsaturatedFats / totalWeight) * portionWeight,
    polyunsaturatedFats: (totalPolyunsaturatedFats / totalWeight) * portionWeight,
    omega3: (totalOmega3 / totalWeight) * portionWeight,
    omega6: (totalOmega6 / totalWeight) * portionWeight,
    transFats: (totalTransFats / totalWeight) * portionWeight,
    water: (totalWater / totalWeight) * portionWeight,
    fiber: (totalFiber / totalWeight) * portionWeight,
  };
}

function updateProbabilities(
    recipes: { name: string, quantity: string, unit: string }[][],
    priorProbabilities: number[],
    userHints: string[]
) {
  const updatedProbabilities = priorProbabilities.map((prior, index) => {
    const recipe = recipes[index];

    const likelihood = recipe.some((ingredient) =>
        userHints.includes(ingredient.name.toLowerCase())
    )
        ? 1
        : 0.5;

    return prior * likelihood;
  });

  const total = updatedProbabilities.reduce((acc, prob) => acc + prob, 0);
  return updatedProbabilities.map((prob) => prob / total);
}


async function calculateExpectedNutritionWithBayes() {
  loading.value = true;
  errorMessage.value = "";
  nutrition.value = null;

  try {
    const recipes = await fetchRecipe(dishName.value);

    if (!recipes.length) {
      errorMessage.value = "Рецепты не найдены";
      return;
    }

    let probabilities = Array(recipes.length).fill(1 / recipes.length);

    probabilities = updateProbabilities(recipes, probabilities, userHints.value);

    let totalNutrition = {
      calories: 0, protein: 0, fat: 0, carbs: 0, vitaminA: 0,
      vitaminB1: 0,
      vitaminB2: 0,
      vitaminB3: 0,
      vitaminB5: 0,
      vitaminB6: 0,
      vitaminB12: 0,
      vitaminB13: 0,
      vitaminB15: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      vitaminP: 0,
      vitaminT: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
      copper: 0,
      manganese: 0,
      magnesium: 0,
      sodium: 0,
      sulfur: 0,
      silicon: 0,
      zinc: 0,
      selenium: 0,
      chromium: 0,
      iodine: 0,
      saturatedFats: 0,
      monounsaturatedFats: 0,
      polyunsaturatedFats: 0,
      omega3: 0,
      omega6: 0,
      transFats: 0,
      water: 0,
      fiber: 0
    };

    for (let i = 0; i < recipes.length; i++) {
      const recipeNutrition = await calculatePortionNutritionForRecipe(
          recipes[i],
          portionWeight.value
      );
      console.log("totALLLLLLLLLLLLL", recipeNutrition.calories, recipeNutrition.vitaminA);
      totalNutrition.calories += recipeNutrition.calories * probabilities[i];
      totalNutrition.protein += recipeNutrition.protein * probabilities[i];
      totalNutrition.fat += recipeNutrition.fat * probabilities[i];
      totalNutrition.carbs += recipeNutrition.carbs * probabilities[i];
      totalNutrition.vitaminA += recipeNutrition.vitaminA * probabilities[i];
      totalNutrition.vitaminB1 += recipeNutrition.vitaminB1 * probabilities[i];
      totalNutrition.vitaminB2 += recipeNutrition.vitaminB2 * probabilities[i];
      totalNutrition.vitaminB3 += recipeNutrition.vitaminB3 * probabilities[i];
      totalNutrition.vitaminB5 += recipeNutrition.vitaminB5 * probabilities[i];
      totalNutrition.vitaminB6 += recipeNutrition.vitaminB6 * probabilities[i];
      totalNutrition.vitaminB12 += recipeNutrition.vitaminB12 * probabilities[i];
      totalNutrition.vitaminB13 += recipeNutrition.vitaminB13 * probabilities[i];
      totalNutrition.vitaminB15 += recipeNutrition.vitaminB15 * probabilities[i];
      totalNutrition.vitaminC += recipeNutrition.vitaminC * probabilities[i];
      totalNutrition.vitaminD += recipeNutrition.vitaminD * probabilities[i];
      totalNutrition.vitaminE += recipeNutrition.vitaminE * probabilities[i];
      totalNutrition.vitaminK += recipeNutrition.vitaminK * probabilities[i];
      totalNutrition.vitaminP += recipeNutrition.vitaminP * probabilities[i];
      totalNutrition.vitaminT += recipeNutrition.vitaminT * probabilities[i];
      totalNutrition.calcium += recipeNutrition.calcium * probabilities[i];
      totalNutrition.iron += recipeNutrition.iron * probabilities[i];
      totalNutrition.potassium += recipeNutrition.potassium * probabilities[i];
      totalNutrition.copper += recipeNutrition.copper * probabilities[i];
      totalNutrition.manganese += recipeNutrition.manganese * probabilities[i];
      totalNutrition.magnesium += recipeNutrition.magnesium * probabilities[i];
      totalNutrition.sodium += recipeNutrition.sodium * probabilities[i];
      totalNutrition.sulfur += recipeNutrition.sulfur * probabilities[i];
      totalNutrition.silicon += recipeNutrition.silicon * probabilities[i];
      totalNutrition.zinc += recipeNutrition.zinc * probabilities[i];
      totalNutrition.selenium += recipeNutrition.selenium * probabilities[i];
      totalNutrition.chromium += recipeNutrition.chromium * probabilities[i];
      totalNutrition.iodine += recipeNutrition.iodine * probabilities[i];
      totalNutrition.saturatedFats += recipeNutrition.saturatedFats * probabilities[i];
      totalNutrition.monounsaturatedFats += recipeNutrition.monounsaturatedFats * probabilities[i];

      totalNutrition.polyunsaturatedFats += recipeNutrition.polyunsaturatedFats * probabilities[i];
      totalNutrition.omega3 += recipeNutrition.omega3 * probabilities[i];
      totalNutrition.omega6 += recipeNutrition.omega6 * probabilities[i];
      totalNutrition.transFats += recipeNutrition.transFats * probabilities[i];
      totalNutrition.water += recipeNutrition.water * probabilities[i];
      totalNutrition.fiber += recipeNutrition.fiber * probabilities[i];
    }
    nutrition.value = totalNutrition;
    console.log("555", nutrition.value);
  } catch (error) {
    errorMessage.value = "Ошибка при расчете КБЖУ";
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: 20px;
  background-color: #caefde;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input,
.select-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}

.input-container {
  margin-bottom: 0.75rem;
  position: relative;
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 6px 12px;
  cursor: pointer;
  line-height: 1.2;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: white;
  text-align: center;
  margin-top: 0.5rem;
}

.search-button {
  background-color: #71cd8c;
}

.save-button {
  background-color: #10b981;
  margin-top: 0.5rem;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.error-message {
  color: #dc2626;
  margin-top: 0.5rem;
  line-height: 1.2;
}

.nutrition-container {
  margin-top: 0.75rem;
}

.nutrition-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.2;
}

.p {
  margin: 0px;
}

.subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
