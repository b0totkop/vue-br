<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/booking">Időpontfoglalás</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>
  header {
    background-color: #333;
    color: white;
    padding: 1rem;
  }

  nav {
    display: flex;
    justify-content: center;
  }

  nav a {
    color: white;
    margin: 0 1rem;
  }

  nav a:hover {
    text-decoration: underline;
  }
</style>