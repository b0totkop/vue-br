<template>
    <div class="homeview d-flex justify-content-center align-items-center vh-100">
      <div class="content d-flex flex-column align-items-center">
        <h1>Időpontfoglalás</h1>
        <router-link to="/booking">
          <button class="btn btn-success mt-3">Tovább az időpontokra ></button>
        </router-link>
      </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.homeview {
  max-height: 90vh;
}
</style>