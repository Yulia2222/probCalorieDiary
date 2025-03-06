<template>
  <div class="profile-container">
    <h2>Личный кабинет</h2>
    <p>Ваш возраст: {{ userAge }}</p>
    <p>Ваш вес: {{ userWeight }}</p>
    <p>Ваш рост: {{ userHeight }}</p>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute();

const userAge = ref<number>();
const userWeight = ref<number>();
const userHeight = ref<number>();


onMounted(async () => {
  const userId = route.params.id;
  console.log("a", userId)
  try {
    const response = await axios.get(`http://localhost:8080/users/${userId}`);
    userAge.value = response.data.age;
    userWeight.value = response.data.weight;
    userHeight.value = response.data.height;
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
