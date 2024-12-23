import express from 'express';
import Menu from '../models/menu.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to get menu items
router.get('/', async (req, res) => {
    try {
      const menu = await Menu.find();
      if (!menu || menu.length === 0) {
        return res.status(404).json({ message: 'No menu items found' });
      }
      res.json(menu);
    } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({ message: 'Server error while fetching menu' });
    }
  });
  

// Protected routes (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;