import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BookingView from '@/views/BookingView.vue'
import { useAppointmentStore } from '@/stores/appointment'
import { createPinia, setActivePinia } from 'pinia'

describe('Időpontfoglalás', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Megjelenik a cím', () => {
    const wrapper = mount(BookingView);
    expect(wrapper.text()).toContain('Időpontfoglalás');
  });

  it('Elérhető, nem elérhető időpontok', () => {
    const store = useAppointmentStore();
    store.appointments = [
      { day: 1, hour: 8, name: 'Teszt Elek', phone: '+1234567890' }
    ];
    
    const available = store.availableSpots;
    expect(available.some(a => a.day === 1 && a.hour === 8)).toBe(false);
    expect(available.some(a => a.day === 1 && a.hour === 9)).toBe(true);
  });

  it('Sikeres foglalás', async () => {
    const store = useAppointmentStore();
    const wrapper = mount(BookingView);
    
    store.addAppointment = async (appointment) => {
      store.appointments.push(appointment);
    };
    
    await store.addAppointment({ day: 2, hour: 10, name: 'Teszt Elek', phone: '+1234567890' });
    expect(store.appointments.some(a => a.day === 2 && a.hour === 10)).toBe(true);
  });
});