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

router.post('/add', async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
      return res.status(401).send('Unauthorized');
  }

  // Rest of the route logic
});

router.post('/edit/:id', async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
      return res.status(401).send('Unauthorized');
  }

  // Rest of the route logic
});


router.post('/delete/:id', async (req, res) => {
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
