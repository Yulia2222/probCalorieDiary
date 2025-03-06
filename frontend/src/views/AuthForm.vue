<template>
  <div class="auth-container">
    <h2>{{ isRegistering ? "Регистрация" : "Вход" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">Логин</label>
        <input id="username" v-model="form.username" required />
      </div>
      <div>
        <label for="password">Пароль</label>
        <input id="password" type="password" v-model="form.password" required />
      </div>
      <div v-if="isRegistering">
        <label for="gender">Пол</label>
        <div class="gender-options">
          <label>
            <input type="radio" v-model="form.gender" value="male" /> Мужской
          </label>
          <label>
            <input type="radio" v-model="form.gender" value="female" /> Женский
          </label>
        </div>
      </div>
      <div v-if="isRegistering">
        <label for="weight">Вес (кг)</label>
        <input id="weight" type="number" v-model="form.weight" required />
      </div>
      <div v-if="isRegistering">
        <label for="height">Рост (см)</label>
        <input id="height" type="number" v-model="form.height" required />
      </div>
      <div v-if="isRegistering">
        <label for="age">Возраст</label>
        <input id="age" type="number" v-model="form.age" required />
      </div>
      <div v-if="isRegistering">
        <label for="activityIndex">Индекс активности</label>
        <select id="activityIndex" v-model="form.activityIndex" required>
          <option value="1">Минимальный уровень активности</option>
          <option value="2">Низкий уровень активности</option>
          <option value="3">Средний уровень активности</option>
          <option value="4">Высокий уровень активности</option>
          <option value="5">Очень высокий уровень</option>
        </select>
      </div>
      <div v-if="isRegistering">
        <label for="target">Ваша цель</label>
        <select id="target" v-model="form.target" required>
          <option value="Lose">Снизить вес</option>
          <option value="Maintain">Поддерживать вес</option>
          <option value="Gain">Набрать массу</option>
        </select>
      </div>
      <button type="submit">{{ isRegistering ? "Зарегистрироваться" : "Войти" }}</button>
    </form>
    <p @click="toggleForm">
      {{ isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться" }}
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AuthForm",
  data() {
    return {
      isRegistering: false,
      form: {
        username: "",
        password: "",
        weight: null,
        height: null,
        age: null,
        activityIndex: null,
        gender: null,
        target: null,
      },
    };
  },
  methods: {
    async handleSubmit() {
      console.log(this.form);
      if (this.form.activityIndex !== null) {
        this.form.activityIndex = Number(this.form.activityIndex);
      }
      const endpoint = this.isRegistering
          ? "http://localhost:8080/auth/register"
          : "http://localhost:8080/auth/login";

      try {
        const response = await axios.post(endpoint, this.form);

        if (this.isRegistering) {
          this.toggleForm();
        } else {
          const userId = response.data.userId;
          this.$router.push(`/${userId}/diary`);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Ошибка!");
      }
    },
    toggleForm() {
      this.isRegistering = !this.isRegistering;
      this.form = {
        username: "",
        password: "",
        weight: null,
        height: null,
        age: null,
        activityIndex: null,
        gender: null,
        target: null,
      };
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #38a169;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

button:hover {
  background-color: #2f855a;
}

p {
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
}

p:hover {
  text-decoration: underline;
}

.gender-options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.gender-options label {
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.gender-options input {
  margin-right: 5px;
}
</style>
