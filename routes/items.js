const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ythsyfvsbxedhfzeczsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHN5ZnZzYnhlZGhmemVjenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1MDEwNjYsImV4cCI6MTk5NzA3NzA2Nn0.l49PRyS8Xuvp-ZJEkU33c86-sQ6QNpSSGaMmjAhWKkE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new item
router.post('/', async (req, res) => {
  // TODO: Implement adding an item
});

// Update an item
router.put('/:id', async (req, res) => {
  // TODO: Implement updating an item
});

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
