<template>
  <v-app>
    <!-- Шапка сайта -->
    <v-app-bar color="#221D81" dark prominent>
      <v-container class="d-flex align-center">
        <v-avatar color="white" size="50" class="mr-4">
          <v-icon color="primary" size="32">mdi-rocket-launch-outline</v-icon>
        </v-avatar>

        <v-toolbar-title class="text-h5 font-weight-bold">
          <span style="color: Yellow">Travel</span>
          <span style="color: black">Pro</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Навигация -->
        <v-btn
          text
          class="text-none"
          v-for="item in navItems"
          :key="item.title"
        >
          <v-icon start :icon="item.icon"></v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Кнопка входа -->
        <v-btn color="white" variant="outlined" class="ml-4">
          <v-icon start>mdi-account</v-icon>
          Войти
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Основное содержимое -->
    <v-main>
      <!-- Секция Hero -->
      <v-parallax
        src="https://i.pinimg.com/originals/fa/fc/b2/fafcb243dd9d42c9f8ac1581392571e0.gif?nii=t?w=1600&q=90"
        height="800"
      >
        <v-container class="fill-height">
          <v-row class="align-center fill-height">
            <v-col cols="12" class="text-center">
              <h1 class="font-weight-bold white--text mb-5 text-shadow-black">
                Путешествуйте с нами
              </h1>
              <h3 class="white--text mb-6 text-shadow-black">
                Откройте для себя лучшие направления по всему миру
              </h3>
              <v-btn color="orange" size="large" class="px-8">
                <v-icon start>mdi-magnify</v-icon>
                Найти тур
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>

      <!-- Популярные направления -->
      <v-container fluid class="py-10 space-bg">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <h2 class="text-h3 font-weight-bold mb-2 text-white">
                Популярные направления
              </h2>
              <p class="text-h6 text-white">Выберите тур своей мечты</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              v-for="destination in destinations"
              :key="destination.name"
              cols="12"
              md="4"
            >
              <v-card elevation="8" hover>
                <v-img :src="destination.image" height="250" cover></v-img>
                <v-card-title class="text-h5 text-dark">{{
                  destination.name
                }}</v-card-title>
                <v-card-subtitle>{{ destination.country }}</v-card-subtitle>
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-rating
                      v-model="destination.rating"
                      readonly
                      density="compact"
                      half-increments
                    ></v-rating>
                    <span class="ml-2"
                      >{{ destination.rating }} ({{
                        destination.reviews
                      }})</span
                    >
                  </div>
                  <div class="mt-4 text-h6 font-weight-bold text-primary">
                    от {{ destination.price }} ₽
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" variant="tonal" block>
                    Подробнее
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Преимущества -->
      <v-container fluid class="bg-grey-lighten-4 py-10">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <h2 class="text-h3 font-weight-bold mb-6">
                Почему выбирают нас?
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="feature in features"
              :key="feature.title"
              cols="12"
              md="3"
            >
              <v-card flat class="text-center bg-transparent">
                <v-icon
                  :icon="feature.icon"
                  size="48"
                  color="primary"
                  class="mb-4"
                ></v-icon>
                <v-card-title class="justify-center">{{
                  feature.title
                }}</v-card-title>
                <v-card-text>{{ feature.description }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Форма поиска тура -->
      <v-container fluid class="py-10 space-bg">
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card elevation="10" class="pa-6 patrick-star">
              <v-card-title class="text-h5 text-center mb-4 text-shadow-white"
                >Найдите идеальный тур</v-card-title
              >
              <v-autocomplete
                v-model="searchForm.destination"
                :items="searchDestinations"
                label="Куда едем?"
                prepend-inner-icon="mdi-map-marker"
                clearable
                bg-color="rgba(255, 255, 255, 0.5)"
              ></v-autocomplete>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    class="text-h5 text-center mb-4 text-shadow-white"
                    v-model="searchForm.startDate"
                    label="Дата от"
                    type="date"
                    bg-color="rgba(255, 255, 255, 0.5)"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="text-h5 text-center mb-4 text-shadow-white"
                    v-model="searchForm.endDate"
                    label="Дата до"
                    type="date"
                    bg-color="rgba(255, 255, 255, 0.5)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-select
                class="text-h5 text-center mb-4 text-shadow-white"
                v-model="searchForm.travelers"
                :items="[1, 2, 3, 4, 5, 6]"
                label="Количество туристов"
                bg-color="rgba(255, 255, 255, 0.5)"
              ></v-select>
              <v-btn
                block
                size="large"
                class="text-h5 text-center mt-4 text-shadow-white"
                @click="searchTours"
              >
                <v-icon start>mdi-magnify</v-icon>
                Найти туры
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Отзывы -->
      <v-container fluid class="bg-primary-lighten-5 py-10">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <h2 class="text-h3 font-weight-bold mb-6">
                Отзывы наших клиентов
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="text-truncate-4row"
              v-for="review in reviews"
              :key="review.name"
              cols="12"
              md="4"
            >
              <v-card elevation="5" class="pa-4">
                <div class="d-flex align-center mb-4">
                  <v-avatar color="primary" size="50">
                    <span class="text-white text-h5">{{ review.name[0] }}</span>
                  </v-avatar>
                  <div class="ml-3">
                    <div class="font-weight-bold">{{ review.name }}</div>
                    <v-rating
                      v-model="review.rating"
                      readonly
                      density="compact"
                      size="small"
                    ></v-rating>
                  </div>
                </div>
                <v-card-text class="pa-0">
                  <v-icon color="primary" size="20" start
                    >mdi-format-quote-open</v-icon
                  >
                  {{ review.text }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>

    <!-- Подвал -->
    <v-footer color="grey-darken-4" class="white--text">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <h3 class="mb-3">TravelPro</h3>
            <p>
              Ваш надежный партнер в мире путешествий. Мы поможем найти лучшие
              туры по всему миру.
            </p>
          </v-col>
          <v-col cols="12" md="2">
            <h3 class="mb-3">Навигация</h3>
            <v-list bg-color="transparent" class="pa-0">
              <v-list-item
                v-for="item in navItems"
                :key="item.title"
                class="pa-0"
              >
                <v-btn variant="text" class="text-none">{{ item.title }}</v-btn>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="3">
            <h3 class="mb-3">Контакты</h3>
            <div class="mb-2">
              <v-icon size="16" class="mr-2">mdi-phone</v-icon>
              +7 (800) 123-45-67
            </div>
            <div class="mb-2">
              <v-icon size="16" class="mr-2">mdi-email</v-icon>
              info@travelpro.ru
            </div>
            <div>
              <v-icon size="16" class="mr-2">mdi-map-marker</v-icon>
              г. Москва, ул. Тверская, д. 1
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <h3 class="mb-3">Мы в соцсетях</h3>
            <div class="d-flex">
              <v-btn icon variant="text" color="white" class="mr-2">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-2">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-2">
                <v-icon>mdi-telegram</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white">
                <v-icon>mdi-whatsapp</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-6 pt-4 text-caption">
          © 2024 TravelPro. Все права защищены.
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navItems: [
        { title: 'Главная', icon: 'mdi-home' },
        { title: 'Туры', icon: 'mdi-bag-suitcase' },
        { title: 'О нас', icon: 'mdi-information' },
        { title: 'Контакты', icon: 'mdi-phone' },
      ],
      destinations: [
        {
          name: 'Марс',
          image: 'https://i.ytimg.com/vi/K8kSnAAOihY/maxresdefault.jpg',
          rating: 2.9,
          reviews: 1248,
          price: '8 500 000',
        },
        {
          name: 'Луна',
          image:
            'https://avatars.mds.yandex.net/i?id=54246e867a6da61c709eaf8e2758a092_l-8310669-images-thumbs&n=13',
          rating: 5.0,
          reviews: 9800,
          price: '650 000',
        },
        {
          name: 'Юпитер',
          image:
            'https://i.pinimg.com/736x/25/b5/fe/25b5fe8bff0d6410b44f18d84eafdf24.jpg',
          rating: 1.7,
          reviews: 30,
          price: '4 500 000',
        },
        {
          name: 'Солнце',
          image:
            'https://www.rmg.co.uk/sites/default/files/styles/full_width_1440/public/Solar%20Limb%20Prominence%20and%20Sunspot%20%C2%A9%20Eric%20Toops%20RU.jpg.webp?itok=QTQYV26Z',
          rating: 5,
          reviews: 1,
          price: '5 000',
        },
        {
          name: 'Чёрная дыра',
          image:
            'https://img.freepik.com/premium-photo/close-up-spiral-dark-night-generative-ai_900814-2176.jpg',
          rating: 4.5,
          reviews: '1.5',
          price: '100 000 000',
        },
        {
          name: 'KELT-9b',
          image:
            'https://media.rds.it/web/wp-content/uploads/2020/07/KELT-9b-1200x630.jpg',
          rating: 5.0,
          reviews: 42,
          price: '21 120 050.99',
        },
      ],
      features: [
        {
          title: 'Лучшие цены',
          description:
            'Гарантируем, что вы больше нигде не найдёте такие выгодные туры в космос',
          icon: 'mdi-tag',
        },
        {
          title: 'Поддержка 24/7',
          description: 'Ответ может прийти даже с другого конца галактики',
          icon: 'mdi-headset',
        },
        {
          title: 'Безопасность',
          description:
            'Благодаря безопасности наших перелётов, вы можете не беспокоиться о своём здоровье. Страховок нет',
          icon: 'mdi-shield-check',
        },
        {
          title: 'Кэшбэк',
          description: 'Кэшбэк -5% за каждую покупку',
          icon: 'mdi-cash-refund',
        },
      ],
      searchDestinations: [
        'Марс',
        'Луна',
        'Юпитер',
        'Солнце',
        'Чёрная дыра',
        'KELT-9b',
        'Сатурн',
        'Венера',
        'Нептун',
        'Плутон',
      ],
      searchForm: {
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 2,
      },
      reviews: [
        {
          name: 'Анна Смирнова',
          rating: 5,
          text: 'Отличное агентство! Всё организовали на высшем уровне. Впервые летала на Солнце во вторник!',
        },
        {
          name: 'Дмитрии Ивановы',
          rating: 4,
          text: 'Решил попробовать слетать в чёрную дыру, но после пересечения пространства и времени у меня выросла лишняя голова, поэтому не 5 звёзд.',
        },
        {
          name: 'Савелий захаров',
          rating: 5,
          text: 'Очень доволен поездкой на KELT-9b. Всегда мечтал посетить данный газовый гигант! Там было незаметны мои газы.',
        },
      ],
    };
  },
  methods: {
    searchTours() {
      alert(
        `Поиск тура:\nНаправление: ${
          this.searchForm.destination || 'любое'
        }\nДаты: ${this.searchForm.startDate || 'не выбрана'} - ${
          this.searchForm.endDate || 'не выбрана'
        }\nТуристов: ${this.searchForm.travelers}`
      );
    },
  },
};
</script>

<style>
.white--text {
  color: white !important;
}
.bg-primary-lighten-5 {
  background-color: #e3f2fd;
}
.text-grey {
  color: #6c757d !important;
}

.space-bg {
  background-image: url('https://i.ytimg.com/vi/UrniS0L2BJU/maxresdefault.jpg');
  background-size: cover;
  background-position: center;
  min-height: 400px;
}

.text-white {
  color: white !important;
}

.text-dark {
  color: black !important;
}

.patrick-star {
  background-image: url('https://i.ytimg.com/vi/fugCAWrblqk/maxresdefault.jpg');
  background-size: cover;
  background-position: center;
  min-height: 400px;
}

.text-shadow-white {
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
    1px 1px 0 white;
}

.text-shadow-black {
  text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    1px 1px 0 black;
}

.text-truncate-4row {
}
</style>
