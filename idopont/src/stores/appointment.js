import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";

export const useAppointmentStore = defineStore("appointment", () => {
  const appointments = ref([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/appointments");
      appointments.value = response.data;
    } catch (error) {
      console.error("Hiba az időpontok lekérésekor:", error);
    }
  };

  const addAppointment = async (appointment) => {
    try {
      await axios.post("http://localhost:3000/appointments", appointment);
      appointments.value.push(appointment);
    } catch (error) {
      console.error("Hiba a foglalás mentésekor:", error);
      throw error;
    }
  };

  const generateTime = () => {
    const spots = [];
    for (let day = 1; day <= 5; day++) {
      for (let hour = 8; hour <= 16; hour++) {
        spots.push({ day, hour });
      }
    }
    return spots;
  };

  const availableSpots = computed(() => {
    const allSpots = generateTime();
    return allSpots.filter(spot =>
      !appointments.value.some(a => a.day === spot.day && a.hour === spot.hour)
    );
  });

  return { appointments, fetchAppointments, addAppointment, availableSpots };
});