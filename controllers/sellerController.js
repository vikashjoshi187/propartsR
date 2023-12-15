import product from "../models/productmodel.js";
import {Order} from "../models/orderSchema.js";
import { user } from '../models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {Categoryschema} from '../models/categoryModel.js'

export const SECRET_KEY = "pro_parts_secret_key";
const maxAge = 86400 * 1000;

export default jwt;
let payload = {}
let token;
let userdata = {};
let Rotp = "";

// export const sellerregister = async (req, res) => {
//     const { username, email, password, phone, gst_number, upi_id, pan_number } = userdata;
//     // const { username, email, password } = userdata;
//     const {otp} = req.body;
//     try {
//         const existinguser = await user.findOne({ email: email });
//         console.log("1", existinguser);
//         if (existinguser) {
//             res.render("customer/sellersignup", { msg: 'User Already Exist' });
//         } else {
//             if(otp==Rotp){
//             const hashpassword = await bcrypt.hash(password, 10);
//             const result = await user.create({
//                 username: username,
//                 email: email,
//                 password: hashpassword,
//                 phone: phone,
//                 gst_number: gst_number,
//                 upi_id: upi_id,
//                 pan_number: pan_number,
//                 role: "seller"
//             });
//             await result.save();
//             console.log("2", result)

//             payload.result = result;
//             const expireTime = {
//                 expiresIn: '1d'
//             }
//             token = jwt.sign(payload, SECRET_KEY, expireTime);
//             res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
//             res.cookie('user', result, { httpOnly: true, maxAge: maxAge });

//             if (!token) {
//                 res.json({ message: "Error Occured while dealing with Token" });
//             }
//             console.log("3", token);


//             res.render("customer/index", { msg: "", user: result });
//         }else{
//             console.log("OTP is not match");
//         }
//         }
//     }
//     catch (err) {
//         console.log('something went wrong', err);
//     }
// }

export const profile = async (req, res) => {
    const user = req.cookies.user;
    res.render("seller/profile", { user: user });
  };
  
  export const updateprofile = async (request,response)=>{
    console.log("productupdate controller");
    try{
        const user = request.cookies.user;
         response.render("seller/updateprofile",{user : user});
    }catch(err){
         console.log("error in updateproduct controller",err);
        //  response.render("error",{message: "error in updateproduct  controller"}); 
    }
  };
  
  export const profileupdate = async (req, res) => {
    try {
        const user1 = req.cookies.user;
        const userid = user1._id;
        
        // Retrieve the existing product record
        const existinguser = await user.findById(userid);
  
        if (!existinguser) {
          return res.status(404).send({ success: false, msg: "User not found" });
        }
      
        // Update the user properties with the new data from req.body
        const { username, email,  phone, gst_number, upi_id, pan_number } = req.body;
        const image1 = req.files['image1'][0];
        existinguser.username = username;
        existinguser.email = email;
        existinguser.phone = phone;
        existinguser.gst_number = gst_number;
        existinguser.upi_id = upi_id;
        existinguser.pan_number = pan_number;
        existinguser.image1 = image1.filename;
      
        // Save the updated user to the database
        await existinguser.save();
  
        res.render('seller/profile',{user : existinguser});
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: error.message });
    }
  }

export const addProduct = async (req, res) => {
    try {
        const {product_name,product_price,Actual_price,Quantity,Return_Days,Catagory,Brand,Description,car_marker,car_type,car_modification,car_year}=req.body;
        const user = req.cookies.user;
        const sellerId = user._id;
        console.log(req.body);
        const image1 = req.files['image1'][0];
        const data = new product({
            seller_id: sellerId, 
            name: product_name,
            price: product_price,
            sellingPrice: Actual_price,
            quantity: Quantity,
            returnDays: Return_Days,
            catagory: Catagory,
            productBrand:Brand,
            description: Description,
            image1: image1.filename,
            carBrand:car_marker,
            carName: car_type,
            carVarient: car_modification,
            manufacturingYear: car_year,
        });
        console.log("image1 filename: " + image1.filename);

        await data.save();
        res.render('customer/index',{user:user});

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: error.message });
    }
}


export const sellerproduct = async (req, res) => {
  
    const user = req.cookies.user;
    const sellerId = user._id;

    // Get the page number from the query parameters or default to 1
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 8; // Number of products per page

    try {
        const totalProducts = await product.countDocuments({ seller_id:sellerId }); // Count all products

        // Calculate the total number of pages based on total products and items per page
        const totalPages = Math.ceil(totalProducts / itemsPerPage);

        // Calculate the starting index of products for the current page
        const startIndex = (page - 1) * itemsPerPage;

        // Query the products for the current page
        const productrecord = await product.find({ seller_id:sellerId })
        .skip(startIndex)
        .limit(itemsPerPage);
        res.render("seller/product", {
            productrecord,
            user: user || "", // Default to an empty string if user is not defined
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.log("Error occures " + error);
    }
}

export const productupdate = async (request,response)=>{
    console.log("productupdate controller");
    try{
         var _id = request.params.id;
         var product1 = await product.findOne({_id:_id});
         response.render("seller/updateproduct",{product : product1});
    }catch(err){
         console.log("error in updateproduct controller",err);
        //  response.render("error",{message: "error in updateproduct  controller"}); 
    }
  };

  export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from the route parameters
        console.log(productId);
        const user = req.cookies.user;
        const sellerId = user._id;
        
        // Retrieve the existing product record
        const existingProduct = await product.findById(productId);

        if (!existingProduct) {
            return res.status(404).send({ success: false, msg: "Product not found" });
        }

        // Update the product properties with the new data from req.body
        const { product_name, product_price, Actual_price, Quantity, Return_Days, Catagory, Brand, Description, car_marker, car_type, model_line, car_modification, car_year } = req.body;
        console.log(req.body);
        const image1 = req.files['image1'][0];
        existingProduct.name = product_name;
        existingProduct.price = product_price;
        existingProduct.sellingPrice = Actual_price;
        existingProduct.quantity = Quantity;
        existingProduct.returnDays = Return_Days;
        existingProduct.catagory = Catagory;
        existingProduct.productBrand = Brand;
        existingProduct.description = Description;
        existingProduct.carBrand = car_marker;
        existingProduct.carName = car_type;
        existingProduct.carModel = model_line;
        existingProduct.carVarient = car_modification;
        existingProduct.manufacturingYear = car_year;
        existingProduct.image1 = image1.filename;
        await existingProduct.save();

        res.render('customer/index', { user: user });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, msg: error.message });
    }
}


export const deleteProduct = async (req, res) => {
    console.log("deleteProduct controller");
    try {
        const productId = req.params.id; // Get the product ID from the route parameters
        console.log("productId : ", productId);
        const user = req.cookies.user;
        // Find the product by ID
        const product1 = await product.findById(productId);

        if (!product1) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if the user has permission to delete the product (e.g., user is the seller)
        // You may need to implement your own authorization logic here.

        // If authorized, delete the product
        const deletionResult = await product.deleteOne({ _id: productId }); // Use deleteOne to remove the product
        await product.findByIdAndRemove(productId);
        if (deletionResult.deletedCount > 0) {
            // return res.status(204).json({ success: true, message: "Product deleted successfully" });
            res.render('customer/index', { user: user });
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const  getCategoriesController= async (req,res)=>{
    console.log("Finging Categories");
      try {
        var categories= await Categoryschema.find()
        res.json(categories)
      } catch (error) {
        console.log("Error in Getting  Category ");
        console.log(error);
      }

}






export const sellerOrders = async(req,res)=>{
  try {
    console.log("sellerOrders controlller ");
    const user = req.cookies.user;
    const sellerId = user._id;
    const allOrders = await Order.find();

    const productsAndOrdersFromSeller = [];

    for (const order of allOrders) {
      const productsInOrder = [];
        for (const product1 of order.products) {
        const productDetails = await product.findById(product1.product_id);

          if (!productDetails) {
          console.log(`Product details not found for product ID: ${product1.product_id}`);
          continue;
          }

          if (productDetails.seller_id && productDetails.seller_id.equals(sellerId)) {
              productsInOrder.push(productDetails.toObject());
          }
        }

      if (productsInOrder.length > 0) {
        const orderWithProducts = {
          orderDetails: order.toObject(), 
          productsWithDetails : productsInOrder, 
        };
        productsAndOrdersFromSeller.push(orderWithProducts);
      }
    }
    console.log(productsAndOrdersFromSeller);
    res.render("seller/sellerorder",{myOrders : productsAndOrdersFromSeller});

  } catch (error) {
    console.error('Error finding products and orders:', error.message);
    throw error;
  }
}




