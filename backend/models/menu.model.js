import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg', 'fast-food', 'bakery', 'south-indian']
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema);

