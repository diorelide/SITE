const express = require('express');
const { resolve } = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());
app.use(express.static('static'));

const SECRET_KEY = 'cosmic_secret_key_2024';

const USERS_FILE = resolve(__dirname, 'users.json');
const TOURS_FILE = resolve(__dirname, 'tours.json');
const BOOKINGS_FILE = resolve(__dirname, 'bookings.json');
const REVIEWS_FILE = resolve(__dirname, 'reviews.json');

// ------------------------- Инициализация -------------------------
async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    const defaultUsers = [
      { id: 1, login: 'jupiter_driver', password: 'jupiter123', role: 'driver', planets: ['Юпитер'] },
      { id: 2, login: 'mars_moon_driver', password: 'mars123', role: 'driver', planets: ['Марс', 'Луна'] },
      { id: 3, login: 'extreme_driver', password: 'extreme123', role: 'driver', planets: ['Солнце', 'Чёрная дыра', 'KELT-9b'] }
    ];
    await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

async function initBookingsFile() {
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2));
  }
}

async function initReviewsFile() {
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    const defaultReviews = [
      { id: 1, name: 'Анна Смирнова', rating: 5, text: 'Отличное агентство! Всё организовали на высшем уровне. Впервые летала на Солнце во вторник!', date: new Date('2024-01-15').toISOString(), tourId: 4, tourName: 'Солнце' },
      { id: 2, name: 'Дмитрий Иванов', rating: 4, text: 'Решил попробовать слетать в чёрную дыру, но после пересечения пространства и времени у меня выросла лишняя голова, поэтому не 5 звёзд.', date: new Date('2024-02-20').toISOString(), tourId: 5, tourName: 'Чёрная дыра' },
      { id: 3, name: 'Савелий Захаров', rating: 5, text: 'Очень доволен поездкой на KELT-9b. Всегда мечтал посетить данный газовый гигант! Там было незаметны мои газы.', date: new Date('2024-03-10').toISOString(), tourId: 6, tourName: 'KELT-9b' }
    ];
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(defaultReviews, null, 2));
  }
}

async function readUsers() { const data = await fs.readFile(USERS_FILE, 'utf8'); return JSON.parse(data); }
async function writeUsers(users) { await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2)); }
async function readTours() { const data = await fs.readFile(TOURS_FILE, 'utf8'); return JSON.parse(data); }
async function writeTours(tours) { await fs.writeFile(TOURS_FILE, JSON.stringify(tours, null, 2)); }
async function readBookings() { const data = await fs.readFile(BOOKINGS_FILE, 'utf8'); return JSON.parse(data); }
async function writeBookings(bookings) { await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2)); }
async function readReviews() { const data = await fs.readFile(REVIEWS_FILE, 'utf8'); return JSON.parse(data); }
async function writeReviews(reviews) { await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2)); }

initUsersFile();
initBookingsFile();
initReviewsFile();

// ------------------------- Middleware -------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Токен отсутствует' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Неверный токен' });
    req.user = user;
    next();
  });
}

// ------------------------- Регистрация -------------------------
app.post('/api/register', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ message: 'Логин и пароль обязательны' });
  try {
    const users = await readUsers();
    if (users.find(u => u.login === login)) return res.status(400).json({ message: 'Пользователь уже существует' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 4;
    const newUser = { id: newId, login, password: hashedPassword, role: 'tourist' };
    users.push(newUser);
    await writeUsers(users);
    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- Логин -------------------------
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const users = await readUsers();
    const user = users.find(u => u.login === login);
    if (!user) return res.status(400).json({ message: 'Неверный логин' });
    let valid = false;
    if (user.role === 'driver') {
      // Прямое сравнение для водителей (пароли в открытом виде)
      valid = (user.password === password);
    } else {
      valid = await bcrypt.compare(password, user.password);
    }
    if (!valid) return res.status(400).json({ message: 'Неверный пароль' });
    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role, planets: user.planets || null },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, login: user.login, role: user.role, planets: user.planets || null } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- GET /api/tours -------------------------
app.get('/api/tours', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let user = null;
  if (token) try { user = jwt.verify(token, SECRET_KEY); } catch(e) {}
  try {
    let tours = await readTours();
    const bookings = await readBookings();
    const toursWithSlots = tours.map(tour => {
      const booked = bookings.filter(b => b.tourId === tour.id).length;
      return { ...tour, bookedCount: booked, available: Math.max(0, 5 - booked) };
    });
    if (user && user.role === 'driver') {
      const filtered = toursWithSlots.filter(t => t.driverId === user.id);
      return res.json(filtered);
    }
    res.json(toursWithSlots);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- GET /api/my-bookings -------------------------
app.get('/api/my-bookings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'tourist') return res.status(403).json({ message: 'Только для туристов' });
  try {
    const bookings = await readBookings();
    const myBookings = bookings.filter(b => b.userId === req.user.id);
    const tours = await readTours();
    const enriched = myBookings.map(b => {
      const tour = tours.find(t => t.id === b.tourId);
      return { ...b, tourName: tour?.name, tourImage: tour?.image, launchYear: tour?.launchYear, price: tour?.price };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- POST /api/book -------------------------
app.post('/api/book', authenticateToken, async (req, res) => {
  if (req.user.role !== 'tourist') return res.status(403).json({ message: 'Только туристы' });
  const { tourId } = req.body;
  if (!tourId) return res.status(400).json({ message: 'Не указан ID' });
  try {
    const tours = await readTours();
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return res.status(404).json({ message: 'Тур не найден' });
    const bookings = await readBookings();
    const tourBookings = bookings.filter(b => b.tourId === tourId);
    if (tourBookings.length >= 5) return res.status(400).json({ message: 'Рейс полностью забронирован' });
    if (tourBookings.some(b => b.userId === req.user.id)) return res.status(400).json({ message: 'Вы уже записаны' });
    const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    const newBooking = { id: newId, userId: req.user.id, tourId, bookedAt: new Date().toISOString() };
    bookings.push(newBooking);
    await writeBookings(bookings);
    res.status(201).json({ message: 'Вы успешно записаны' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- DELETE /api/bookings/:id -------------------------
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'tourist') return res.status(403).json({ message: 'Только туристы' });
  const bookingId = parseInt(req.params.id);
  try {
    let bookings = await readBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return res.status(404).json({ message: 'Бронирование не найдено' });
    if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Чужое бронирование' });
    bookings = bookings.filter(b => b.id !== bookingId);
    await writeBookings(bookings);
    res.json({ message: 'Отменено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ------------------------- CRUD для водителей -------------------------
app.post('/api/tours', authenticateToken, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ message: 'Только водители' });
  const { name, description, price, image, launchYear } = req.body;
  if (!name || !description || !price || !image || !launchYear) return res.status(400).json({ message: 'Не хватает полей' });
  try {
    const tours = await readTours();
    const newId = tours.length > 0 ? Math.max(...tours.map(t => t.id)) + 1 : 1;
    const newTour = { id: newId, name, description, price: Number(price), image, launchYear: Number(launchYear), driverId: req.user.id };
    tours.push(newTour);
    await writeTours(tours);
    res.status(201).json(newTour);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка' });
  }
});
app.put('/api/tours/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ message: 'Только водители' });
  const tourId = parseInt(req.params.id);
  const { name, description, price, image, launchYear } = req.body;
  try {
    let tours = await readTours();
    const index = tours.findIndex(t => t.id === tourId);
    if (index === -1) return res.status(404).json({ message: 'Тур не найден' });
    if (tours[index].driverId !== req.user.id) return res.status(403).json({ message: 'Не ваш тур' });
    tours[index] = { ...tours[index], name: name || tours[index].name, description: description || tours[index].description, price: price !== undefined ? Number(price) : tours[index].price, image: image || tours[index].image, launchYear: launchYear !== undefined ? Number(launchYear) : tours[index].launchYear };
    await writeTours(tours);
    res.json(tours[index]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка' });
  }
});
app.delete('/api/tours/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ message: 'Только водители' });
  const tourId = parseInt(req.params.id);
  try {
    let tours = await readTours();
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return res.status(404).json({ message: 'Тур не найден' });
    if (tour.driverId !== req.user.id) return res.status(403).json({ message: 'Не ваш тур' });
    tours = tours.filter(t => t.id !== tourId);
    await writeTours(tours);
    let bookings = await readBookings();
    bookings = bookings.filter(b => b.tourId !== tourId);
    await writeBookings(bookings);
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка' });
  }
});

// ------------------------- Отзывы -------------------------
app.get('/api/reviews', async (req, res) => {
  try {
    const data = await fs.readFile(REVIEWS_FILE, 'utf8');
    let reviews = JSON.parse(data);
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastThree = reviews.slice(0, 3);
    res.json(lastThree);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка загрузки отзывов' });
  }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
  const { tourId, text, rating } = req.body;
  if (!tourId || !text || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Неверные данные' });
  }
  try {
    const tours = await readTours();
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return res.status(404).json({ message: 'Тур не найден' });
    const data = await fs.readFile(REVIEWS_FILE, 'utf8');
    let reviews = JSON.parse(data);
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    const newReview = {
      id: newId,
      name: req.user.login,
      rating: Number(rating),
      text: text,
      date: new Date().toISOString(),
      tourId: tourId,
      tourName: tour.name
    };
    reviews.push(newReview);
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сохранения отзыва' });
  }
});

// ------------------------- Статика -------------------------
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Сервер на http://localhost:${port}`);
});