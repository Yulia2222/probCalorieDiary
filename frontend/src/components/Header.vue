<template>
  <header>
    <div class="logo">
      <router-link :to="`/${userId}/diary`">Food Diary</router-link>
    </div>

    <nav class="navigation">
      <router-link :to="`/${userId}/diary`">Дневник</router-link>
      <router-link :to="`/${userId}/profile`">Личный кабинет</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  computed: {
    userId() {
      return this.$route.params.id || 'defaultId';
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 3rem;
  background: linear-gradient(90deg, #38a169, #2f855a);
  border-bottom: 4px solid #276749;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
}

.logo {
  font-size: 1.875rem;
  font-weight: 500;
}

.logo a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo a:hover {
  color: #c6f6d5;
}


.navigation {
  display: flex;
  gap: 2.5rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.navigation a {
  color: white;
  text-decoration: none;
  padding: 5px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navigation a:hover {
  background-color: #48bb78;
  color: white;
}
</style>
