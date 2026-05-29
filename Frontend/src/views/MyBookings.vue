<template>
  <div class="bookings-page">
    <v-container>
      <h1 class="text-h4 mb-4">Мои бронирования</h1>
      <v-row v-if="loading">
        <v-col cols="12" class="text-center"><v-progress-circular indeterminate></v-progress-circular></v-col>
      </v-row>
      <v-row v-else-if="bookings.length === 0">
        <v-col cols="12" class="text-center">У вас пока нет бронирований.</v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="booking in bookings" :key="booking.id" cols="12" md="6" lg="4" class="d-flex">
          <v-card class="booking-card d-flex flex-column" style="width: 100%;">
            <v-img :src="booking.tourImage" height="180" cover></v-img>
            <v-card-title>{{ booking.tourName }}</v-card-title>
            <v-card-text>
              <p><strong>{{ formatPrice(booking.price) }} ₽</strong></p>
              <p><v-icon small>mdi-rocket</v-icon> Год вылета: {{ booking.launchYear }}</p>
              <p><v-icon small>mdi-calendar</v-icon> Забронировано: {{ formatDate(booking.bookedAt) }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="cancelBooking(booking.id)">Отменить бронирование</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';

const { token } = useAuth();
const bookings = ref([]);
const loading = ref(false);

const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);
const formatDate = (isoString) => {
  if (!isoString) return 'Дата неизвестна';
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? 'Неверная дата' : date.toLocaleDateString('ru-RU');
};

const fetchMyBookings = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3010/api/my-bookings', {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    if (res.ok) {
      bookings.value = await res.json();
    } else {
      console.error('Ошибка загрузки бронирований');
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const cancelBooking = async (bookingId) => {
  if (!confirm('Отменить бронирование?')) return;
  try {
    const res = await fetch(`http://localhost:3010/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    if (res.ok) {
      alert('Бронирование отменено');
      fetchMyBookings();
    } else {
      const err = await res.json();
      alert(err.message || 'Ошибка отмены');
    }
  } catch (err) {
    alert('Ошибка сети');
  }
};

onMounted(() => {
  fetchMyBookings();
});
</script>

<style scoped>
.bookings-page {
  background-image: url('https://images.wallpaperscraft.ru/image/single/zvezdnoe_nebo_zvezdy_kosmos_192738_2560x1024.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 70vh;
  padding: 20px 0;
}
.booking-card {
  background-color: rgba(255, 255, 255, 0.9);
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>