<template>
  <div class="tours-page">
    <v-container>
      <div v-if="errorMessage" class="text-center red--text">{{ errorMessage }}</div>
      <v-row v-if="loading">
        <v-col cols="12" class="text-center"><v-progress-circular indeterminate></v-progress-circular> Загрузка туров...</v-col>
      </v-row>
      <v-row v-else>
        <v-col v-for="tour in tours" :key="tour.id" cols="12" md="4" class="d-flex">
          <v-card class="tour-card d-flex flex-column" style="width: 100%;">
            <v-img :src="tour.image" height="200" cover></v-img>
            <v-card-title>{{ tour.name }}</v-card-title>
            <v-card-text class="flex-grow-1">
              <p class="tour-description">{{ tour.description }}</p>
              <p class="mt-2"><strong>{{ formatPrice(tour.price) }} ₽</strong></p>
              <p class="mt-1"><v-icon small>mdi-rocket</v-icon> Год вылета: {{ tour.launchYear }}</p>
              <p class="mt-1"><v-icon small>mdi-account-group</v-icon> Свободно мест: {{ tour.available }} / 5</p>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="isTourist" color="primary" variant="tonal" block @click="bookTour(tour)" :disabled="tour.available === 0">Забронировать</v-btn>
              <v-btn v-else-if="!isDriver" color="primary" variant="tonal" block @click="bookTour(tour)" :disabled="tour.available === 0">Забронировать</v-btn>
              <v-btn v-else color="primary" variant="tonal" block @click="requireAuth">Забронировать</v-btn>
              <template v-if="isDriver">
                <v-btn color="warning" @click="editTour(tour)">Редактировать</v-btn>
                <v-btn color="error" @click="deleteTour(tour.id)">Удалить</v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-btn v-if="isDriver" color="success" @click="openAddDialog" class="mt-4">Добавить рейс</v-btn>

      <v-dialog v-model="dialogOpen" max-width="500px">
        <v-card>
          <v-card-title>{{ editingTour ? 'Редактировать тур' : 'Добавить тур' }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="form.name" label="Название планеты"></v-text-field>
            <v-textarea v-model="form.description" label="Описание"></v-textarea>
            <v-text-field v-model="form.price" label="Цена" type="number"></v-text-field>
            <v-text-field v-model="form.image" label="URL изображения"></v-text-field>
            <v-text-field v-model="form.launchYear" label="Год вылета" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialogOpen = false">Отмена</v-btn>
            <v-btn color="primary" @click="saveTour">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '../composables/useAuth';

const { user, token, isDriver, isTourist } = useAuth();
const tours = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const dialogOpen = ref(false);
const editingTour = ref(null);
const form = ref({ name: '', description: '', price: 0, image: '', launchYear: 2100 });

const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

const fetchTours = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const headers = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    const res = await fetch('http://localhost:3010/api/tours', { headers });
    if (!res.ok) throw new Error(`Ошибка ${res.status}`);
    tours.value = await res.json();
  } catch (err) {
    errorMessage.value = err.message;
    tours.value = [];
  } finally {
    loading.value = false;
  }
};

const bookTour = async (tour) => {
  if (!token.value) {
    alert('Войдите или зарегистрируйтесь, чтобы бронировать');
    return;
  }
  if (!isTourist()) {
    alert('Только туристы могут бронировать');
    return;
  }
  try {
    const res = await fetch('http://localhost:3010/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({ tourId: tour.id })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      fetchTours();
    } else {
      alert(data.message || 'Ошибка бронирования');
    }
  } catch (err) {
    alert('Ошибка сети');
  }
};

const requireAuth = () => {
  alert('Войдите или зарегистрируйтесь');
};

const editTour = (tour) => {
  editingTour.value = tour;
  form.value = { ...tour };
  dialogOpen.value = true;
};

const deleteTour = async (id) => {
  if (!confirm('Удалить тур?')) return;
  try {
    const res = await fetch(`http://localhost:3010/api/tours/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` },
    });
    if (res.ok) fetchTours();
    else alert('Ошибка удаления');
  } catch (err) {
    alert('Ошибка сети');
  }
};

const saveTour = async () => {
  let url = 'http://localhost:3010/api/tours';
  let method = 'POST';
  if (editingTour.value) {
    url += `/${editingTour.value.id}`;
    method = 'PUT';
  }
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify(form.value),
    });
    if (res.ok) {
      dialogOpen.value = false;
      fetchTours();
      editingTour.value = null;
      form.value = { name: '', description: '', price: 0, image: '', launchYear: 2100 };
    } else {
      alert('Ошибка сохранения');
    }
  } catch (err) {
    alert('Ошибка сети');
  }
};

const openAddDialog = () => {
  editingTour.value = null;
  form.value = { name: '', description: '', price: 0, image: '', launchYear: 2100 };
  dialogOpen.value = true;
};

watch(() => token.value, () => fetchTours());
onMounted(() => fetchTours());
</script>

<style scoped>
.tours-page {
  background-image: url('https://images.wallpaperscraft.ru/image/single/zvezdnoe_nebo_zvezdy_kosmos_192738_2560x1024.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px 0;
}
.tour-card {
  background-color: rgba(255, 255, 255, 0.9);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tour-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>