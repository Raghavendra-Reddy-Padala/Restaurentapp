import express from 'express';
import Reservation from '../models/reservation.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create reservation (public)
router.post('/', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reservations (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reservation status (admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

