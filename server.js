require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

const viewPages = [
  '02_card',
  '03_configu',
  '04_configue_view',
  '05_stock_add',
  '06_stock_show',
  '07_new_order',
  '08_order_show',
  '09_order_detail',
  '10_add_process',
  '11_proposal',
  '11_1_new_proposal',
  '11_proposal_detail',
  '12_attendance',
  '13_worker',
  '14_designer',
  '15_designer_edit',
  '16_purchase',
  '16_1_raise_po',
  '17_inspection_show',
  '18_inspection_detail',
];

viewPages.forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    res.render(page);
  });

  app.get(`/${page}.html`, (req, res) => {
    res.redirect(`/${page}`);
  });
});

app.get('/management-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/management-dashboard.html'));
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use(errorHandler);

async function startServer() {
  try {
    validateEnv();
    await connectDB();

    const port = process.env.PORT || 8080;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
