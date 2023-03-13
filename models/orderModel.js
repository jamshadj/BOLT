const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        status:{ type:String,  enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',}
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    itemsPrice: { 
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    date:{
      type:Date,
      required:true,
    },  
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },

);

module.exports = mongoose.model('Order', orderSchema); 