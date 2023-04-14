require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// Connect to Supabase
const supabaseUrl = 'https://ythsyfvsbxedhfzeczsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHN5ZnZzYnhlZGhmemVjenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1MDEwNjYsImV4cCI6MTk5NzA3NzA2Nn0.l49PRyS8Xuvp-ZJEkU33c86-sQ6QNpSSGaMmjAhWKkE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Import routes
const itemsRouter = require('./routes/items');
app.use('/items', itemsRouter);

app.get('/', async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (user) {
      res.render('index');
  } else {
      res.redirect('/login');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/login', (req, res) => {
  res.render('auth/login');
});

