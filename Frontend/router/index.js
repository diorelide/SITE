import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../src/views/HomePage.vue';
import ToursPage from '../src/views/ToursPage.vue';
import MyBookings from '../src/views/MyBookings.vue';
import AboutUs from '../src/views/AboutUs.vue';
import Contacts from '../src/views/Contacts.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/tours', name: 'Tours', component: ToursPage },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookings, meta: { requiresAuth: true } },
  { path: '/about', name: 'About', component: AboutUs },
  { path: '/contacts', name: 'Contacts', component: Contacts },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;