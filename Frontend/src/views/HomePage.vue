<template>
  <div>
    <!-- Секция Hero -->
    <v-parallax
      src="https://i.pinimg.com/originals/fa/fc/b2/fafcb243dd9d42c9f8ac1581392571e0.gif?nii=t?w=1600&q=90"
      height="800"
    >
      <v-container class="fill-height">
        <v-row class="align-center fill-height">
          <v-col cols="12" class="text-center">
            <h1 class="font-weight-bold white--text mb-5 text-shadow-black">Путешествуйте с нами</h1>
            <h3 class="white--text mb-6 text-shadow-black">Откройте для себя лучшие направления по всему миру</h3>
            <v-btn color="orange" size="large" class="px-8" @click="scrollToSearch">
              <v-icon start>mdi-magnify</v-icon>Найти тур
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>

    <!-- Популярные направления (первые 6 туров) -->
    <v-container fluid class="py-10 space-bg">
      <v-container>
        <v-row><v-col cols="12" class="text-center"><h2 class="text-h3 font-weight-bold mb-2 text-white">Популярные направления</h2><p class="text-h6 text-white">Выберите тур своей мечты</p></v-col></v-row>
        <v-row v-if="loading">
          <v-col cols="12" class="text-center"><v-progress-circular indeterminate></v-progress-circular> Загрузка...</v-col>
        </v-row>
        <v-row v-else>
          <v-col v-for="tour in displayedTours" :key="tour.id" cols="12" md="4" class="d-flex">
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
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Блок преимуществ -->
    <v-container fluid class="bg-grey-lighten-4 py-10">
      <v-container>
        <v-row><v-col cols="12" class="text-center"><h2 class="text-h3 font-weight-bold mb-6">Почему выбирают нас?</h2></v-col></v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-card flat class="text-center bg-transparent"><v-icon icon="mdi-tag" size="48" color="primary" class="mb-4"></v-icon><v-card-title class="justify-center">Лучшие цены</v-card-title><v-card-text>Гарантируем, что вы больше нигде не найдёте такие выгодные туры в космос</v-card-text></v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card flat class="text-center bg-transparent"><v-icon icon="mdi-headset" size="48" color="primary" class="mb-4"></v-icon><v-card-title class="justify-center">Поддержка 24/7</v-card-title><v-card-text>Ответ может прийти даже с другого конца галактики</v-card-text></v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card flat class="text-center bg-transparent"><v-icon icon="mdi-shield-check" size="48" color="primary" class="mb-4"></v-icon><v-card-title class="justify-center">Безопасность</v-card-title><v-card-text>Благодаря безопасности наших перелётов, вы можете не беспокоиться о своём здоровье. Страховок нет</v-card-text></v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card flat class="text-center bg-transparent"><v-icon icon="mdi-cash-refund" size="48" color="primary" class="mb-4"></v-icon><v-card-title class="justify-center">Кэшбэк</v-card-title><v-card-text>Кэшбэк -5% за каждую покупку</v-card-text></v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Форма поиска -->
    <v-container fluid class="py-10 space-bg" ref="searchSection">
      <v-row><v-col cols="12" md="6" offset-md="3">
        <v-card elevation="10" class="pa-6 patrick-star">
          <v-card-title class="text-h5 text-center mb-4 font-weight-bold white-outline">Найдите идеальный тур</v-card-title>
          
          <v-autocomplete
            v-model="searchForm.destination"
            :items="searchDestinations"
            label="Куда едем?"
            prepend-inner-icon="mdi-map-marker"
            clearable
            bg-color="rgba(255, 255, 255, 0.5)"
            class="font-weight-bold"
          ></v-autocomplete>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="searchForm.yearFrom"
                label="Год от"
                type="number"
                bg-color="rgba(255, 255, 255, 0.5)"
                class="font-weight-bold"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="searchForm.yearTo"
                label="Год до"
                type="number"
                bg-color="rgba(255, 255, 255, 0.5)"
                class="font-weight-bold"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-select
            v-model="searchForm.travelers"
            :items="[1,2,3,4,5]"
            label="Количество туристов"
            bg-color="rgba(255, 255, 255, 0.5)"
            class="font-weight-bold"
          ></v-select>

          <v-btn block size="large" class="text-h5 text-center mt-4 white-btn" color="white" @click="showSearchResults">
            <v-icon start>mdi-magnify</v-icon>
            Найти туры
          </v-btn>
        </v-card>
      </v-col></v-row>
    </v-container>

    <!-- Отзывы (исправленное отображение) -->
    <v-container fluid class="bg-primary-lighten-5 py-10">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-6">Отзывы наших клиентов</h2>
          </v-col>
        </v-row>
        <v-row v-if="reviewsLoading">
          <v-col cols="12" class="text-center"><v-progress-circular indeterminate></v-progress-circular></v-col>
        </v-row>
        <v-row v-else>
          <v-col v-for="review in reviews" :key="review.id" cols="12" md="4">
            <v-card elevation="5" class="pa-4">
              <div class="d-flex align-center mb-4 justify-space-between">
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="50">
                    <span class="text-white text-h5">{{ review.name.charAt(0) }}</span>
                  </v-avatar>
                  <div class="ml-3">
                    <div class="font-weight-bold">
                      {{ review.name }}, {{ review.tourName }}
                    </div>
                    <div class="d-flex align-center">
                      <v-rating v-model="review.rating" readonly density="compact" size="small"></v-rating>
                      <span class="ml-2 text-grey">{{ new Date(review.date).getFullYear() }} г.</span>
                    </div>
                  </div>
                </div>
              </div>
              <v-card-text class="pa-0 review-text">
                <v-icon color="primary" size="20" start>mdi-format-quote-open</v-icon>
                {{ review.text }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn color="primary" @click="openReviewDialog">Оставить отзыв</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Модальное окно для добавления отзыва -->
    <v-dialog v-model="reviewDialog" max-width="500px">
      <v-card>
        <v-card-title>Оставить отзыв</v-card-title>
        <v-card-text>
          <v-select
            v-model="newReview.tourId"
            :items="tourOptions"
            item-title="name"
            item-value="id"
            label="Выберите тур"
            outlined
          ></v-select>
          <v-rating v-model="newReview.rating" density="compact" color="yellow-darken-2" half-increments></v-rating>
          <v-textarea v-model="newReview.text" label="Ваш отзыв" rows="4"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="reviewDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="submitReview">Отправить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно с результатами поиска -->
    <v-dialog v-model="searchDialog" max-width="1200px">
      <v-card>
        <v-card-title class="text-h5">Результаты поиска</v-card-title>
        <v-card-text>
          <v-row v-if="searchResultsLoading">
            <v-col cols="12" class="text-center"><v-progress-circular indeterminate></v-progress-circular></v-col>
          </v-row>
          <v-row v-else-if="filteredTours.length === 0">
            <v-col cols="12" class="text-center">По вашему запросу туров не найдено.</v-col>
          </v-row>
          <v-row v-else>
            <v-col v-for="tour in filteredTours" :key="tour.id" cols="12" md="4" class="d-flex">
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
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="searchDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuth } from '../composables/useAuth';

const { token, isDriver, isTourist } = useAuth();
const allTours = ref([]);
const loading = ref(false);
const searchDialog = ref(false);
const searchResultsLoading = ref(false);
const searchSection = ref(null);

const searchForm = ref({
  destination: null,
  yearFrom: null,
  yearTo: null,
  travelers: 2
});
const searchDestinations = ref(['Марс','Луна','Юпитер','Солнце','Чёрная дыра','KELT-9b','Сатурн','Венера','Нептун','Плутон']);

// Отзывы
const reviews = ref([]);
const reviewsLoading = ref(false);
const reviewDialog = ref(false);
const newReview = ref({ tourId: null, rating: 5, text: '' });
const tourOptions = computed(() => allTours.value.map(t => ({ id: t.id, name: t.name })));

const displayedTours = computed(() => allTours.value.slice(0, 6));

const filteredTours = computed(() => {
  let result = allTours.value;
  if (searchForm.value.destination) {
    result = result.filter(t => t.name === searchForm.value.destination);
  }
  if (searchForm.value.yearFrom) {
    result = result.filter(t => t.launchYear >= searchForm.value.yearFrom);
  }
  if (searchForm.value.yearTo) {
    result = result.filter(t => t.launchYear <= searchForm.value.yearTo);
  }
  if (searchForm.value.travelers) {
    result = result.filter(t => t.available >= searchForm.value.travelers);
  }
  return result;
});

const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price);

const fetchTours = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3010/api/tours');
    if (res.ok) {
      allTours.value = await res.json();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchReviews = async () => {
  reviewsLoading.value = true;
  try {
    const res = await fetch('http://localhost:3010/api/reviews');
    if (res.ok) {
      reviews.value = await res.json();
    }
  } catch (err) {
    console.error(err);
  } finally {
    reviewsLoading.value = false;
  }
};

const bookTour = async (tour) => {
  if (!token.value) {
    alert('Пожалуйста, войдите или зарегистрируйтесь');
    return;
  }
  if (!isTourist()) {
    alert('Только туристы могут бронировать. Войдите под учётной записью туриста.');
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
  alert('Для бронирования необходимо войти или зарегистрироваться');
};

const showSearchResults = () => {
  searchDialog.value = true;
};

const openReviewDialog = () => {
  if (!token.value) {
    alert('Войдите, чтобы оставить отзыв');
    return;
  }
  newReview.value = { tourId: null, rating: 5, text: '' };
  reviewDialog.value = true;
};

const submitReview = async () => {
  if (!newReview.value.tourId) {
    alert('Выберите тур');
    return;
  }
  if (!newReview.value.text.trim()) {
    alert('Напишите текст отзыва');
    return;
  }
  try {
    const res = await fetch('http://localhost:3010/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({
        tourId: newReview.value.tourId,
        text: newReview.value.text,
        rating: newReview.value.rating
      })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Спасибо за отзыв!');
      reviewDialog.value = false;
      fetchReviews();
    } else {
      alert(data.message || 'Ошибка');
    }
  } catch (err) {
    alert('Ошибка сети');
  }
};

const scrollToSearch = () => {
  if (searchSection.value) {
    searchSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

watch(() => token.value, () => fetchTours());
onMounted(() => {
  fetchTours();
  fetchReviews();
});
</script>

<style scoped>
.tour-card {
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
.review-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Дополнительные стили для формы поиска */
.font-weight-bold :deep(label),
.font-weight-bold :deep(input),
.font-weight-bold :deep(.v-select__selection) {
  font-weight: bold;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
}
.white-outline {
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
  font-weight: bold;
}
.white-btn {
  color: black !important;
  font-weight: bold;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
}
</style>

<style>
.white--text { color: white !important; }
.bg-primary-lighten-5 { background-color: #e3f2fd; }
.text-grey { color: #6c757d !important; }
.space-bg { background-image: url('https://i.ytimg.com/vi/UrniS0L2BJU/maxresdefault.jpg'); background-size: cover; background-position: center; min-height: 400px; }
.text-white { color: white !important; }
.text-dark { color: black !important; }
.patrick-star { background-image: url('https://i.ytimg.com/vi/fugCAWrblqk/maxresdefault.jpg'); background-size: cover; background-position: center; min-height: 400px; }
.text-shadow-white { text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white; }
.text-shadow-black { text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black; }
.text-shadow-blue { text-shadow: -0.5px -0.5px 0 blue, 0.5px -0.5px 0 blue, -0.5px 0.5px 0 blue, 0.5px 0.5px 0 blue; }
</style>