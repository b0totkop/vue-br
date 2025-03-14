<template>
  <div class="container mt-5">
    <h3 class="text-center">Válassz egy szabad időpontot:</h3>
    <div class="table-responsive">
      <table class="table table-bordered text-center mt-3">
        <thead class="table-dark">
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
            <td class="fw-bold">{{ hour }}:00</td>
            <td v-for="day in [1, 2, 3, 4, 5]" :key="day">
              <button v-if="isAvailable(day, hour)" @click="selectTime(getSpot(day, hour))" class="btn btn-primary btn-sm w-100">Foglalás</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Kiválasztott időpont</h5>
          </div>
          <div class="modal-body">
            <p><strong>{{ formatTime(selectedTime) }}</strong></p>
            <form @submit.prevent="bookAppointment">
              <div class="mb-3">
                <label for="name" class="form-label">Név:</label>
                <input id="name" v-model="name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Telefonszám:</label>
                <input id="phone" v-model="phone" type="tel" class="form-control" required />
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Mégse</button>
                <button type="submit" class="btn btn-success">Foglalás</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAppointmentStore } from "@/stores/appointment";
import { useToast } from "vue-toastification";

const store = useAppointmentStore();
const name = ref("");
const phone = ref("");
const selectedTime = ref(null);
const showModal = ref(false);
const toast = useToast();

const nameRegex = /^[A-Za-z]{1,}\s[A-Za-z]{2,}$/;
const phoneRegex = /^\+?[1-9][0-9]{6,14}$/;

onMounted(() => {
  store.fetchAppointments();
});

const availableSpots = computed(() => store.availableSpots);

const selectTime = (time) => {
  selectedTime.value = time;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedTime.value = null;
  name.value = "";
  phone.value = "";
};

const bookAppointment = async () => {
  if (!name.value || !phone.value) {
    toast.error("Minden mezőt ki kell tölteni!");
    return;
  }
  if (!nameRegex.test(name.value)) {
    toast.error("Érvénytelen név!");
    return;
  }
  if (!phoneRegex.test(phone.value)) {
    toast.error("Érvénytelen telefonszám!");
    return;
  }
  try {
    await store.addAppointment({
      day: selectedTime.value.day,
      hour: selectedTime.value.hour,
      name: name.value,
      phone: phone.value
    });
    closeModal();
    toast.success("Sikeres foglalás!");
  } catch (error) {
    console.error("Hiba a foglalás mentésekor:", error);
    toast.error("Sikertelen foglalás!");
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
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
</style>