<template>
  <v-app>
    <v-app-bar color="#221D81" dark prominent>
      <v-container class="d-flex align-center">
        <v-avatar color="white" size="50" class="mr-4" style="cursor: pointer;" @click="goHome">
          <v-icon color="primary" size="32">mdi-rocket-launch-outline</v-icon>
        </v-avatar>
        <v-toolbar-title class="text-h5 font-weight-bold" style="cursor: pointer;" @click="goHome">
          <span style="color: Yellow">Travel</span><span style="color: black">Pro</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn text class="text-none" @click="goHome">
          <v-icon start>mdi-home</v-icon> Главная
        </v-btn>
        <router-link to="/tours" custom v-slot="{ navigate }">
          <v-btn text class="text-none" @click="navigate"><v-icon start>mdi-bag-suitcase</v-icon> Туры</v-btn>
        </router-link>
        <router-link v-if="user && user.role === 'tourist'" to="/my-bookings" custom v-slot="{ navigate }">
          <v-btn text class="text-none" @click="navigate"><v-icon start>mdi-bookmark</v-icon> Брони</v-btn>
        </router-link>
        <router-link to="/about" custom v-slot="{ navigate }">
          <v-btn text class="text-none" @click="navigate"><v-icon start>mdi-information</v-icon> О нас</v-btn>
        </router-link>
        <router-link to="/contacts" custom v-slot="{ navigate }">
          <v-btn text class="text-none" @click="navigate"><v-icon start>mdi-phone</v-icon> Контакты</v-btn>
        </router-link>

        <template v-if="!user">
          <v-btn color="white" variant="outlined" class="ml-4" @click="loginDialog = true">
            <v-icon start>mdi-account</v-icon> Войти
          </v-btn>
          <v-btn color="white" variant="outlined" class="ml-2" @click="registerDialog = true">
            <v-icon start>mdi-account-plus</v-icon> Регистрация
          </v-btn>
        </template>
        <v-menu v-else>
          <template v-slot:activator="{ props }">
            <v-btn color="white" variant="outlined" class="ml-4" v-bind="props">
              <v-icon start>mdi-account-circle</v-icon> {{ user.login }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleLogout"><v-list-item-title>Выйти</v-list-item-title></v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="grey-darken-4" class="white--text">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="mb-3">TravelPro</h3>
            <p>Ваш надежный партнер в мире путешествий. Мы поможем найти лучшие туры по всему миру.</p>
          </v-col>
          <v-col cols="12" md="6">
            <h3 class="mb-3">Мы в соцсетях</h3>
            <div class="d-flex">
              <v-btn icon variant="text" color="white" class="mr-2" href="https://facebook.com" target="_blank">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-2" href="https://instagram.com" target="_blank">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" class="mr-2" href="https://youtube.com" target="_blank">
                <v-icon>mdi-youtube</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" href="https://whatsapp.com" target="_blank">
                <v-icon>mdi-whatsapp</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-6 pt-4 text-caption">© 2026 TravelPro. Все права защищены.</div>
      </v-container>
    </v-footer>

    <LoginModal v-model="loginDialog" @logged-in="onLoggedIn" />
    <RegistrationModal v-model="registerDialog" @registered="onRegistered" />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './src/composables/useAuth';
import LoginModal from './src/components/LoginModal.vue';
import RegistrationModal from './src/components/RegistrationModal.vue';

const router = useRouter();
const { user, logout: authLogout, loadFromStorage } = useAuth();
const loginDialog = ref(false);
const registerDialog = ref(false);

const goHome = () => {
  router.push('/').then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

const handleLogout = () => {
  authLogout();
  goHome();
};

const onLoggedIn = () => {
  loginDialog.value = false;
  goHome();
};

const onRegistered = () => {
  registerDialog.value = false;
  alert('Регистрация прошла успешно. Теперь вы можете войти.');
};

onMounted(() => {
  loadFromStorage();
  if (!localStorage.getItem('token')) {
    authLogout();
  }
});
</script>

<style>
.white--text { color: white !important; }
.bg-primary-lighten-5 { background-color: #e3f2fd; }
.space-bg { background-image: url('https://i.ytimg.com/vi/UrniS0L2BJU/maxresdefault.jpg'); background-size: cover; background-position: center; min-height: 400px; }
.text-shadow-black { text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black; }
a { text-decoration: none; color: inherit; }
</style>