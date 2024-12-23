import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

let cart = [];

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/', (req, res) => {
  const { name, price } = req.body;
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  res.json(cart);
});

router.post('/checkout', (req, res) => {
  const receipt = cart.map(item => 
    `${item.name} x${item.quantity}: $${item.price * item.quantity}`
  ).join('\n');
  
  cart = [];
  res.json(receipt);
});

export default router;

