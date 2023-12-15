import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Reference to the User collection
      required: true,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products', // Reference to the Product collection
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    orderDate: {
      type: String,
      require: true
    },
    orderTotal: {
      type: Number,
      required: true,
    },
    name: { 
      type: String,
    },
    lastName: { 
      type: String, 
    },
    mobile: {
      type: String,
    },
    pinCode: { 
      type: Number, 
    },
    state: { 
      type: String, 
    },
    address: { 
      type: String, 
    },
    city: { 
      type: String, 
    },
    country: { 
      type: String, 
    },
    orderStatus: { 
      type: String, 
    },
    paymentMode: { 
      type: String, 
    }
  });
  
export const Order = mongoose.model('Order', orderSchema);



  