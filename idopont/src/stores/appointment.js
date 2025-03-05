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
    const now = new Date();
    for (let day = 1; day <= 5; day++) { // Only Monday to Friday
      for (let hour = 8; hour <= 16; hour++) { // 8 AM to 4 PM
        const spot = getSpot(day, hour); // Day and Hour based spot
        spots.push(spot);
      }
    }
    return spots;
  };

  const getSpot = (day, hour) => {
    const now = new Date();
    now.setDate(now.getDate() + ((day - now.getDay() + 7) % 7));
    now.setHours(hour, 0, 0, 0);
    return now.toISOString();
  };

  const availableSpots = computed(() => {
    const allSpots = generateTime();
    return allSpots.filter(spot =>
      !appointments.value.some(a => a.time === spot)
    );
  });

  return { appointments, fetchAppointments, addAppointment, availableSpots };
});
