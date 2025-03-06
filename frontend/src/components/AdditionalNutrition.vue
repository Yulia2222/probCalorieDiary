<template>
  <div v-if="hasNutrition" class="additional-nutrition-section">
    <div class="nutrition-wrapper">
      <h2 class="additional-nutrition-title">Дополнительные составляющие</h2>

      <div class="categories-container">
        <div
            v-for="(items, category) in categories"
            :key="category"
            class="additional-category"
        >
          <h3 class="category-title">{{ category }}</h3>
          <ul class="category-list">
            <li v-for="key in items" :key="key" class="category-item">
              <span class="item-name">{{ aliases[key] || key }}:</span>

              <div class="progress-bar-container" :title="getTooltipText(key, category)">
                <div
                    class="progress-bar"
                    :style="{
                    width: getProgressPercentage(key) + '%'
                  }"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNutritionStore } from '../stores/nutritionStore';
export default {
  name: 'AdditionalNutrition',
  props: {
    additionalNutrition: {
      type: Object,
      required: true
    },
    aliases: {
      type: Object,
      required: true
    },
    displayedVitamins: {
      type: Array,
      required: true
    },
    displayedMinerals: {
      type: Array,
      required: true
    },
    displayedFats: {
      type: Array,
      required: true
    },
    mealDiary: {
      type: Object,
      required: true
    }
  },
  computed: {
    nutritionStore() {
      return useNutritionStore();
    },

    hasNutrition() {
      return (
          this.mealDiary.breakfast.length ||
          this.mealDiary.lunch.length ||
          this.mealDiary.dinner.length ||
          this.mealDiary.snack.length
      );
    },
    categories() {
      return {
        'Клетчатка': ['fiber'],
        'Витамины': this.displayedVitamins,
        'Минералы': this.displayedMinerals,
        'Жирные кислоты': this.displayedFats
      };
    }
  },
  methods: {
    getProgressPercentage(key) {
      const norm = this.nutritionStore[key] || 0;
      const consumed = this.additionalNutrition[key] || 0;

      if (norm === 0) return 0;
      return Math.min((consumed / norm) * 100, 100);
    },

    getTooltipText(key, category) {
      const norm = this.nutritionStore[key] || 0;
      const consumed = this.additionalNutrition[key] || 0;
      const unit = category === 'Клетчатка' || category === 'Жирные кислоты' ? 'г' : 'мг';
      return `${this.aliases[key] || key}\nНорма: ${norm.toFixed(2)} ${unit}\nУпотреблено: ${consumed.toFixed(2)} ${unit}`;
    }
  }
};
</script>

<style scoped>
.additional-nutrition-section {
  margin-top: 30px;
  font-family: Arial, sans-serif;
  max-width: 600px;
}

.nutrition-wrapper {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.additional-nutrition-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.additional-category {
  margin-bottom: 10px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 6px;
}

.category-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  column-count: 2;
  column-gap: 20px;
}

.category-item {
  font-size: 12px;
  margin-bottom: 8px;
  color: #555;
  break-inside: avoid;
}

.item-name {
  font-weight: 500;
}


.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 4px;
  position: relative;
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
}


.progress-bar-container:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 4px;
  white-space: pre-line;
  z-index: 10;
  pointer-events: none;
}
</style>