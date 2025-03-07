<template>
  <div class="container">
    <h2>Időpontfoglalás</h2>
    <div v-if="selectedTime">
      <h3>Kiválasztott időpont: {{ formatTime(selectedTime) }}</h3>
      <form @submit.prevent="bookAppointment">
        <div>
          <label for="name">Név:</label>
          <input id="name" v-model="name" type="text" required />
        </div>
        <div>
          <label for="phone">Telefonszám:</label>
          <input id="phone" v-model="phone" type="tel" required />
        </div>
        <button type="submit">Foglalás</button>
      </form>
    </div>
    <div v-else>
      <h3>Válassz egy szabad időpontot:</h3>
      <table class="timetable">
        <thead>
          <tr>
            <th></th>
            <th>Hétfő</th>
            <th>Kedd</th>
            <th>Szerda</th>
            <th>Csütörtök</th>
            <th>Péntek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in hours" :key="hour">
            <td>{{ hour }}:00</td>
            <td>
              <button v-if="isAvailable(1, hour)" @click="selectTime(getSpot(1, hour))">Foglalás</button>
            </td>
            <td>
              <button v-if="isAvailable(2, hour)" @click="selectTime(getSpot(2, hour))">Foglalás</button>
            </td>
            <td>
              <button v-if="isAvailable(3, hour)" @click="selectTime(getSpot(3, hour))">Foglalás</button>
            </td>
            <td>
              <button v-if="isAvailable(4, hour)" @click="selectTime(getSpot(4, hour))">Foglalás</button>
            </td>
            <td>
              <button v-if="isAvailable(5, hour)" @click="selectTime(getSpot(5, hour))">Foglalás</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAppointmentStore } from "@/stores/appointment";

const store = useAppointmentStore();
const name = ref("");
const phone = ref("");
const selectedTime = ref(null);

onMounted(() => {
  store.fetchAppointments();
});

const availableSpots = computed(() => store.availableSpots);

const selectTime = (time) => {
  selectedTime.value = time;
};

const bookAppointment = async () => {
  if (!name.value || !phone.value) {
    return;
  }
  try {
    await store.addAppointment({
      day: selectedTime.value.day,
      hour: selectedTime.value.hour,
      name: name.value,
      phone: phone.value
    });
    selectedTime.value = null;
    name.value = "";
    phone.value = "";
  } catch (error) {
    console.error("Hiba a foglalás mentésekor:", error);
  }
};

const formatTime = (time) => {
  const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
  return `${days[time.day - 1]}, ${time.hour}:00`;
};

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

const getSpot = (day, hour) => {
  return { day, hour };
};

const isAvailable = (day, hour) => {
  return availableSpots.value.some(spot => spot.day === day && spot.hour === hour);
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
}

th {
  background-color: #f4f4f4;
}

button {
  padding: 10px;
  cursor: pointer;
  width: 100%;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>