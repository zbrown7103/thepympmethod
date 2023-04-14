const { supabase } = require('../supabase');
const express = require('express');
const router = express.Router();

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
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const { name, cost, format } = req.body;

  try {
    const { data, error } = await supabase
      .from('items')
      .insert([{ name, cost, format }]);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const { id } = req.params;
  const { name, cost, format } = req.body;

  try {
    const { data, error } = await supabase
      .from('items')
      .update({ name, cost, format })
      .eq('id', id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const id = req.params.id;

  const { data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error.message);
    return res.status(500).send('Error deleting item');
  }

  res.status(200).send('Item deleted');
});


module.exports = router;
