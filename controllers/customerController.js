import { user } from "../models/user.js";
import { messagemodel } from '../models/messagemodel.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import url from 'url';

import product from "../models/productmodel.js";
import { Cart } from "../models/cartSchema.js";
import { Order } from "../models/orderSchema.js";
import { type } from "os";
import { brands } from "../models/brandsSchema.js";
import { carmodel } from "../models/CarModel.js";
import { varient } from "../models/varientSchema.js";
import { transporter } from "./mailer.js";
import randomstring from "randomstring";
import { log } from "console";
export const SECRET_KEY = "pro_parts_secret_key";
const maxAge = 86400 * 1000;
import dotenv from 'dotenv';
dotenv.config();

var blood_bank_data={};
var otp="";
import stripe from 'stripe';

const { STRIPE_SECRET_KEY ,STRIPE_PUBLISHABLE_KEY} = process.env;
const stripeInstance = stripe(STRIPE_SECRET_KEY);


export default jwt;
let payload = {};
let token;
let userdata = {};
let Rotp = "";

export const register = async (req, res) => {
  const { username, email, phone, password } = userdata;
  const { otp } = req.body;
  try {
    const existinguser = await user.findOne({ email: email });
    console.log("1", existinguser);
    if (existinguser) {
      res.render("customer/signup", { msg: "User Already Exist" });
    } else {
      if (otp == Rotp) {
        const hashpassword = await bcrypt.hash(password, 10);
        const result = await user.create({
          username: username,
          email: email,
          phone: phone,
          password: hashpassword,
          role: "customer",
          status: "activate"
        });
        await result.save();
        console.log("2", result);

        payload.result = result;
        const expireTime = {
          expiresIn: "1d",
        };
        token = jwt.sign(payload, SECRET_KEY, expireTime);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
        res.cookie("user", result, { httpOnly: true, maxAge: maxAge });
        if (!token) {
          res.json({ message: "Error Occured while dealing with Token" });
        }
        console.log("3", token);

        res.render("customer/index", { msg: "", user: result });
      } else {
        console.log("otp not match");
      }
    }
  } catch (err) {
    console.log("something went wrong", err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existinguser = await user.findOne({ email: email });

    payload.result = existinguser;
    const expireTime = {
      expiresIn: "1d",
    };
    if (!existinguser) {
      res.render("customer/signin", { msg: "user not found" ,requestforactive: ""});
    } else {
      const matchpassword = await bcrypt.compare(
        password,
        existinguser.password
      );
      if (!matchpassword) {
        console.log("passNotMatch");
        res.render("customer/signin", { msg: "Password Not Match" ,requestforactive: ""});
      // } else {
      //   token = jwt.sign(payload, SECRET_KEY, expireTime);
      //   res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
      //   res.cookie("user", existinguser, { httpOnly: true, maxAge: maxAge });
      //   if (!token) {
      //     response.json({ message: "Error Occured while dealing with Token" });
      //   }
      //   console.log("token", token);
      //   res.render("customer/index", { msg: "", user: existinguser });
      // }
    } else {
      const matchpassword = await bcrypt.compare(password, existinguser.password);
      if (!matchpassword) {
          console.log("passNotMatch");
          // res.render("customer/signin", { msg: "Password Not Match" });
          res.render("customer/signin", { msg: "Password Not Match" , requestforactive: "" });
      } else {
          if (existinguser.status == "activate") {
              token = jwt.sign(payload, SECRET_KEY, expireTime);
              res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
              res.cookie('user', existinguser, { httpOnly: true, maxAge: maxAge });
              if (!token) {
                  response.json({ message: "Error Occured while dealing with Token" });
              }
              // res.render("customer/index", { msg: "", user: existinguser });
              res.render("customer/index", { msg: "", user: existinguser });
          }
          else {
              // res.render("customer/signin", { msg: "Password Not Match" });
              res.render("customer/signin", { msg: "your account is deactivate" , requestforactive: "Request for active"})
          }
      }
  }
    }
  } catch (err) {
    console.log("something went wrong", err);
  }
};

export const authenticateJWT = (request, response, next) => {
  console.log("authenticateJWT : ");
  const token = request.cookies.jwt;
  if (!token) {
    response.render("customer/index", { user: "" });
  } else {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) console.log(err);
      next();
    });
  }
};

export const authorizeUser = (request, response, next) => {
  console.log("5", request.payload.result.email);
  next();
};

export const customerproduct = async (req, res) => {
  const user = req.cookies.user;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 8; // Number of products per page

  try {
    const totalProducts = await product.countDocuments(); // Count all products

    // Calculate the total number of pages based on total products and items per page
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Calculate the starting index of products for the current page
    const startIndex = (page - 1) * itemsPerPage;

    // Query the products for the current page
    const productrecord = await product
      .find()
      .skip(startIndex)
      .limit(itemsPerPage);

    res.render("customer/product", {
      productrecord,
      user: user || "", // Default to an empty string if user is not defined
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Error occures " + error);
  }
};

export const addtocart = async (req, res) => {
  console.log("Inside Add cart");
  var user = req.cookies.user;
  var id = user._id;
  const cart = await Cart.find({ user_id: id });
  let flag = false;

  if (cart.length != 0) {
    for (let i = 0; i < cart[0].products.length; i++) {
      if (cart[0].products[i].product_id == req.params.id) {
        flag = true;
        break;
      }
    }

    if (flag) {
      console.log("Already Exit");
    } 
    else {
      console.log("inside elseee");
      cart[0].products[cart[0].products.length] = {
        product_id: req.params.id,
      };
      await cart[0].save();
    }
  } else {
    console.log("cart created");
    try {
      const result = await Cart.create({
        user_id: id,
        products: [
          {
            product_id: req.params.id,
          },
        ],
      });
      await result.save();
    } catch (err) {
      console.log(err);
    }
  }
  res.redirect("product");
};

export const cartShow = async (req, res) => {
  const user = req.cookies.user;
  const userId = user._id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user_id: userId });

    if (cart) {
      const productIds = cart.products.map((product) => product.product_id);
      // console.log(productIds);
      // Fetch product details from the "products" collection
      const productsInCart = await product.find({ _id: { $in: productIds } });

      // Now you have an array of product details to display in the cart
      //   console.log("hello cart");
      //   console.log(productsInCart)
      console.log(productsInCart.length);
      res.render("customer/cart", { products: productsInCart });
    } else {
      console.log("vikas chouhan");
      res.render("customer/cart", { products: [] }); // Cart is empty
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("An error occurred");
  }
};

export const deleteProduct = async (req, res) => {
  const user = req.cookies.user;
  const userId = user._id;
  const productIdToDelete = req.params._id; // Get the product ID to delete from the request
  console.log(productIdToDelete);
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user_id: userId });

    if (cart) {
      // Filter out the product to delete from the cart's products array
      cart.products = cart.products.filter(
        (product) => product.product_id.toString() !== productIdToDelete
      );

      // Save the updated cart
      await cart.save();

      res.redirect("/cart"); // Redirect to the cart page or any other desired page
    } else {
      res.status(404).send("Cart not found for the user");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("An error occurred");
  }
};

export const profile = async (req, res) => {
  const user = req.cookies.user;
  res.render("customer/profile", { user: user });
};

export const updateprofile = async (request, response) => {
  console.log("productupdate controller");
  try {
    const user = request.cookies.user;
    response.render("customer/updateprofile", { user: user });
  } catch (err) {
    console.log("error in updateproduct controller", err);
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
    const { username, email, phone } = req.body;
    const image1 = req.files["image1"][0];
    existinguser.username = username;
    existinguser.email = email;
    existinguser.phone = phone;
    existinguser.image1 = image1.filename;

    // Save the updated user to the database
    await existinguser.save();

    res.render("customer/profile", { user: existinguser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, msg: error.message });
  }
};

export const placeOrder = async (req, res) => {
  console.log("placeo Order runned");
  const user = req.cookies.user;
  const userId = user._id;
  console.log("placeOrder");
  try {
    const cart = await Cart.findOne({ user_id: userId });

    if (cart) {
      const quantities = req.body;
      console.log(req.body);
      let totalOrderTotal = 0;
      const orderedProducts = [];

      for (const productInCart of cart.products) {
        const productIdToOrder = productInCart.product_id;
        console.log(productIdToOrder);
        const orderedQuantity = parseInt(
          quantities[`${productIdToOrder}`] || 0,
          10
        );
        if (orderedQuantity > 0) {
          const product1 = await product.findById(productIdToOrder);
          let productQuantity = product1.quantity;

          console.log("line 353", product1);

          productQuantity -= orderedQuantity;
          console.log(productQuantity);
          product1.quantity = productQuantity;
          await product1.save();
          const productPrice = product1.price;
          const orderTotal = productPrice * orderedQuantity;

          // const seller_id =await user.findOne()

          orderedProducts.push({
            product_id: productIdToOrder,
            quantity: orderedQuantity,
          });

          totalOrderTotal += orderTotal;

          productInCart.quantity -= orderedQuantity;
        }
      }

      const order = new Order({
        user_id: userId,
        products: orderedProducts,
        orderTotal: totalOrderTotal,
      });
      console.log("Order._id ", order._id);
      await order.save();

      cart.products = cart.products.filter((product) => product.quantity > 0);
      await cart.save();
      res.render("customer/shippingaddress", { orderID: order._id });
    } else {
      res.status(404).send("Cart not found for the user");
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("An error occurred");
  }
};

export const placeOrderForProduct = async (req, res) => {
  const user = req.cookies.user;
  const userId = user._id;
  let dateObject = new Date();
  console.log("A date object is defined");

  let date = ("0" + dateObject.getDate()).slice(-2);
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let year = dateObject.getFullYear();

  console.log("displaying date and time in yyyy-mm-dd format");
  const currentDate = year + "-" + month + "-" + date;
  console.log(currentDate);
  try {
    const productIdToOrder = req.params.productId; // Get the product ID from the request params
    const orderedQuantity = parseInt(req.body.quantity || 0, 10); // Get the ordered quantity from the request body

    const product1 = await product.findById(productIdToOrder);
    let productQuantity = product1.quantity;
    console.log(productQuantity);
    productQuantity -= orderedQuantity;
    console.log(productQuantity);
    product1.quantity = productQuantity;
    await product1.save();
    if (!product1) {
      return res.status(404).send("Product not found");
    }

    const productPrice = product1.price;
    const orderTotal = productPrice * orderedQuantity;

    const orderedProducts = [
      {
        product_id: productIdToOrder,
        quantity: orderedQuantity,
      },
    ];

    const order = new Order({
      user_id: userId,
      products: orderedProducts,
      orderTotal: orderTotal,
      orderDate: currentDate,
    });

    await order.save();

    // Deduct the ordered quantity from the user's cart
    const cart = await Cart.findOne({ user_id: userId });
    console.log(cart);
    if (cart) {
      // Find the index of the product in the cart whose ID matches the ordered product's ID
      cart.products = cart.products.filter(
        (product) => product.product_id.toString() !== productIdToOrder
      );
      await cart.save(); // Save the cart after removal
      res.json({ orderID: order._id });
    }
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("An error occurred");
  }
};

export const shippingaddress = async (req, res, next) => {
  const user = req.cookies.user;
  const userId = user._id;
  try {
    const orderId = req.params.orderID; // Get the product ID from the request params
    const { name, lastName, mobile, pinCode, state, address, city, country } =
      req.body;
    console.log(orderId);
    // const order = await Order.findById(orderId);
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        name: name,
        lastName: lastName,
        mobile: mobile,
        pinCode: pinCode,
        address: address,
        city: city,
        country: country,
        orderStatus: "confirm",
      },
      { new: true }
    );
    console.log(order);
    await order.save();
    console.log(order);
    // res.render("/orderDetails/",{ orderID: order._id });
    next();
  } catch (err) {
    console.log(err);
  }
};



export const brandsAjaxController = async (req, res) => {
  console.log(" brands Ajax Controlller  Runned");
  try {
    const Brands = await brands.find();
    res.json(Brands);
  } catch (error) {
    console.log("Error in brands Controller");
  }
};

export const modelsAjaxController = async (req, res) => {
  var Models;
  console.log("models Ajax Runned" + req.query.brand);
  try {
    Models = await carmodel.distinct("carName", { brandId: req.query.brand });
    res.json(Models);
  } catch (error) {
    console.log("Error in getting Models");
    console.log(error);
  }
};

export const varientsAjaxController = async (req, res) => {
  var Varients;
  console.log("Varients Ajax Runnedsss" + req.query.model);
  try {
    Varients = await carmodel.distinct("varientName", {
      carName: req.query.model,
    });
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }
  res.json(Varients);
};

export const yearAjaxController = async (req, res) => {
  var Year;
  console.log("Year Ajax Controller Runned");
  try {
    Year = await carmodel.find({ carName: { $eq: req.query.Model } });
    res.json(Year);
  } catch (error) {
    console.log("Error in getting Years");
    console.log(error);
  }
};

// export const searchByFilterController = async (req, res) => {
//   console.log("Search By filter runned");
//   try {
//     const searchObject = {
//       carName: req.query.carName,
//       brandId: req.query.brandId,
//       varientName: req.query.varientName,
//       startYear: req.query.startYear,
//     };
//     console.log(searchObject);
//     console.log("THis is is th searched Car");
//     const productrecord = await product.findOne({carName:req.query.carName,carVarient: req.query.varientName,carBrand:req.query.brandId,manufacturingYear:req.query.startYear});
//     console.log(productrecord);
//     res.render("customer/product", {
//       productrecord,
//       user: user || "", // Default to an empty string if user is not defined
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     console.log("Error in Filtering ");
//     console.log(error);
//   }
// };

export const searchByFilterController = async (req, res) => {
  console.log("Search By filter runned Hellooo");
  try {
    const searchObject = {
      carName: req.body.carName,
      brandId: req.body.brandId,
      varientName: req.body.varientName,
      startYear: req.body.startYear,
    };
    console.log(searchObject);
    // const productrecord = await product.findOne({carName:req.body.carName,carVarient: req.body.varientName,carBrand:req.body.brandId,manufacturingYear:req.body.startYear});
    console.log("THis is is the Car");
    const user = req.cookies.user;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 8;
    const totalProducts = await product
      .find({ catagory: req.params.categoryName })
      .countDocuments();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    // Query the products for the current page
    const productrecord = await product
      .find({
        carName: req.body.carName,
        carVarient: req.body.varientName,
        carBrand: req.body.brandId,
        manufacturingYear: req.body.startYear,
      })
      .skip(startIndex)
      .limit(itemsPerPage);
    console.log(productrecord);
    res.render("customer/searhByProduct", {
      productrecord: productrecord,
      user: user || "", // Default to an empty string if user is not defined
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in Filtering ");
    console.log(error);
  }
};

// ==============================================================

export const verifyemail = async (req, res) => {
  console.log("This is the Mail Options");
  userdata = req.body;
  console.log("userdata in email", userdata);
  console.log("name in email" + req.body.email);
  console.log("OTP controller Runned", userdata);
  Rotp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });
  const mailOptions = {
    from: "proparts.com",
    to: req.body.email,
    subject: `proparts online plateform`,
    html: `<!doctype html>
    <html lang="en">
    
    <head>
      <title>Title</title>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
      <!-- Bootstrap CSS v5.2.1 -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    
        <style>
    
            .card{
                background-color: rgb(56, 0, 117);
                color: white;
                border-radius: 30px;
                padding: 10px;
                border:  5px solid  rgb(150, 53, 255);
            
            }
            .OTP{
                color: red;
            }
          
    
      
        </style>
    </head>
    
    <body>
      <header>
        <!-- place navbar here -->
      </header>
      <main>
       <div class="container  w-100 d-flex justify-content-center " id="Box" >
        <div class="card mb-3" style="max-width: 1040px;">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img src="https://drive.google.com/file/d/1HqPy4OZbCDiVpHGgEATPsAhDklouJ4nx/view?usp=drive_link" alt="ProParts">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h1 class="h1">ProParts</h1>
                      <p class="card-text"><small >"Driving Perfection"</small></p>
                      <p class="card-text">Dear ${userdata.username}, <br>
                      Welcome to ProParts! We're thrilled to have you join our community of automotive enthusiasts and professionals. Your journey with us begins now, and we're excited to be a part of it.

                      <br>
                       <h2 class="text-break"  > Your OTP is: <span class="OTP">${Rotp}</span></h2>
                        <br>
                       <br><br>
                        Thank you for using ProParts!
                        <br><br>
                        Best regards,
                        The ProParts Team
                    </p>
                    </div>
                  </div>
                </div>
              </div>
        </div>
       </main>
      <footer>
        <!-- place footer here -->
      </footer>
      <!-- Bootstrap JavaScript Libraries -->
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
        integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous">
      </script>
    
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js"
        integrity="sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz" crossorigin="anonymous">
      </script>
    </body>
    
    </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render("customer/signup", {
        msg: "Invalid Email Please Enter Right Email Id",
        otp: "",
      });
      console.error(error);
    } else {
      res.render("customer/confirmemail", {
        msg: "",
        otp: "OTP send successfully please check your mail id",
      });
      console.log(Rotp + " Is sent");
    }
  });
};

export const forgetLoad = async (req, res) => {
  try {
    res.render("customer/forget");
  } catch (err) {
    console.log("Error" + err.message);
  }
};

let emailForPasswordReset = "";
export const forgetVerify = async (req, res) => {
  try {
    // mailer.mailer(req.body.email,async (info)=>{
    //  console.log(info);
    const { email } = req.body;
    // if(info){
    //     console.log("Email in  forget verify"+email);

    emailForPasswordReset = email;
    const existinguser = await user.findOne({ email: email });
    console.log("1", existinguser);
    if (existinguser) {
      Rotp = randomstring.generate({
        length: 4,
        charset: "numeric",
      });

      // text: `Hello ${existinguser.username}\n your one time Password is ${Rotp} enter this opt and register yourself.\nThank You☺`

      const mailOptions = {
        from: "proparts.com",
        to: req.body.email,
        subject: `proparts online plateform`,
        html: `<!doctype html>
                <html lang="en">
                
                <head>
                  <title>Title</title>
                  <!-- Required meta tags -->
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                
                  <!-- Bootstrap CSS v5.2.1 -->
                  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
                
                    <style>
                
                        .card{
                            background-color: rgb(56, 0, 117);
                            color: white;
                            border-radius: 30px;
                            padding: 10px;
                            border:  5px solid  rgb(150, 53, 255);
                        
                        }
                        .OTP{
                            color: red;
                        }
                      </style>
                </head>
                
                <body>
                  <header>
                    <!-- place navbar here -->
                  </header>
                  <main>
                   <div class="container  w-100 d-flex justify-content-center " id="Box" >
                    <div class="card mb-3" style="max-width: 1040px;">
                            <div class="row g-0">
                              <div class="col-md-4">
                                <img src="https://drive.google.com/file/d/1HqPy4OZbCDiVpHGgEATPsAhDklouJ4nx/view?usp=drive_link" alt="ProParts">
                              </div>
                              <div class="col-md-8">
                                <div class="card-body">
                                  <h1 class="h1">ProParts</h1>
                                  <p class="card-text"><small >"Driving Perfection"</small></p>
                                  <p class="card-text">Dear ${existinguser.username}, <br>
                                    We received a request to reset your password for your ProPartss accountttttt. To ensure the security of your account, we are providing you with a One-Time Password (OTP) that you can use to reset your password.
                                     <br>
                                   <h2 class="text-break"  > Your OTP is: <span class="OTP">${Rotp}</span></h2>
                                    <br>
                                   <br><br>
                                    Thank you for using ProParts!
                                    <br><br>
                                    Best regards,
                                    The ProParts Team
                                </p>
                                </div>
                              </div>
                            </div>
                          </div>
                    </div>
                   </main>
                  <footer>
                    <!-- place footer here -->
                  </footer>
                  <!-- Bootstrap JavaScript Libraries -->
                  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
                    integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous">
                  </script>
                
                  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js"
                    integrity="sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz" crossorigin="anonymous">
                  </script>
                </body>
                
                </html>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.render("customer/forget", {
            msg: "Invalid Email Please Enter Right Email Id",
            otp: "",
          });
          console.error(error);
        } else {
          res.render("customer/confirmemailforgetpassword", {
            msg: "",
            otp: "OTP send successfully please check your mail id",
          });
          console.log(Rotp);
        }
      });
      console.log("Successfull sent email");
      //res.render("customer/forget_password",{message: "Need to verify Email Before reset password"});
    } else {
      res.render("customer/forget", { message: "User is not valid" });
    }
  } catch (err) {
    console.log("Error " + err.message);
  }
};

export const verifyEmailPassword = async (req, res) => {
  const { username, email, password } = userdata;
  const { otp } = req.body;

  console.log(email + " ");

  try {
    const existinguser = await user.findOne({ email: emailForPasswordReset });
    console.log("1", existinguser);
    if (existinguser) {
      res.render("customer/forget_password", {
        msg: "Email verfied  you can login",
      });
    } else {
      res.render("customer/signup", { msg: "User not exist" });
    }
  } catch (err) {
    console.log("something went wrong", err);
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};

export const forgetpassword = async (req, res) => {
  const password = req.body.password;
  const email = emailForPasswordReset;

  console.log("Password " + password);
  console.log("email " + email);
  try {
    const secure_password = await securePassword(password);
    console.log(secure_password + " in forgetpassword");
    const updateddata = await user.updateOne(
      { email: email },
      { $set: { password: secure_password } }
    );
    res.render("customer/signin", { msg: "Password Not Match" });
  } catch (err) {
    console.log("Error in forgetpassword:" + err.message);
  }
};

export const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderID;
    console.log(orderId);
    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const productsWithDetails = await Promise.all(
      order.products.map(async (product1) => {
        console.log(product1);
        const productDetails = await product.findById(product1.product_id);
        const seller_id = await user.findById(productDetails.seller_id);

        console.log(productDetails);
        return {
          ...product1.toObject(),
          productDetails,
        };
      })
    );
    console.log("Order inside orderDetails controller ", order);
    console.log(
      "productsWithDetails inside orderDetails controller ",
      productsWithDetails
    );
    res.render("customer/bill.ejs", { order, productsWithDetails ,key:STRIPE_PUBLISHABLE_KEY});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const showProductsbyCategoryController = async (req, res) => {
  try {
    console.log(req.params.categoryName);
    const user = req.cookies.user;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 8; // Number of products per page
    // const categoryProducts=await product.find({catagory:req.params.categoryName})
    const totalProducts = await product
      .find({ catagory: req.params.categoryName })
      .countDocuments();
    // console.log(categoryProducts);

    // Calculate the total number of pages based on total products and items per page
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Calculate the starting index of products for the current page
    const startIndex = (page - 1) * itemsPerPage;

    // Query the products for the current page
    const productrecord = await product
      .find({ catagory: req.params.categoryName })
      .skip(startIndex)
      .limit(itemsPerPage);

    res.render("customer/categoryProducts", {
      productrecord,
      user: user || "", // Default to an empty string if user is not defined
      totalPages,
      currentPage: page,
      category: req.params.categoryName,
    });
  } catch (error) {
    console.log("Error While Finding the products By category");
    console.log(error);
  }
};

export const sellerverifyemail = async (req, res) => {
  userdata = req.body;
  console.log("userdata in email", userdata);
  console.log("name in email" + req.body.email);
  console.log("OTP controller Runned", userdata);
  Rotp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });

  const mailOptions = {
    from: "onlinespareparts2019@gmail.com",
    to: req.body.email,
    subject: `proparts online plateform`,
    html: `<!doctype html>
    <html lang="en">
    
    <head>
      <title>Title</title>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
      <!-- Bootstrap CSS v5.2.1 -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    
        <style>
    
            .card{
                background-color: rgb(56, 0, 117);
                color: white;
                border-radius: 30px;
                padding: 10px;
                border:  5px solid  rgb(150, 53, 255);
            
            }
            .OTP{
                color: red;
            }
          
    
      
        </style>
    </head>
    
    <body>
      <header>
        <!-- place navbar here -->
      </header>
      <main>
       <div class="container  w-100 d-flex justify-content-center " id="Box" >
        <div class="card mb-3" style="max-width: 1040px;">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img src="https://drive.google.com/file/d/1HqPy4OZbCDiVpHGgEATPsAhDklouJ4nx/view?usp=drive_link" alt="ProParts">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h1 class="h1">ProParts</h1>
                      <p class="card-text"><small >"Driving Perfection"</small></p>
                      <p class="card-text">Dear ${userdata.username}, <br>
                      Welcome to ProParts! We're thrilled to have you join our community of automotive enthusiasts and professionals. Your journey with us begins now, and we're excited to be a part of it.

                      <br>
                       <h2 class="text-break"  > Your OTP is: <span class="OTP">${Rotp}</span></h2>
                        <br>
                       <br><br>
                        Thank you for using ProParts!
                        <br><br>
                        Best regards,
                        The ProParts Team
                    </p>
                    </div>
                  </div>
                </div>
              </div>
        </div>
       </main>
      <footer>
        <!-- place footer here -->
      </footer>
      <!-- Bootstrap JavaScript Libraries -->
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
        integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous">
      </script>
    
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js"
        integrity="sha384-7VPbUDkoPSGFnVtYi0QogXtr74QeVeeIs99Qfg5YCF+TidwNdjvaKZX19NZ/e6oz" crossorigin="anonymous">
      </script>
    </body>
    
    </html>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render("customer/sellersignup", {
        msg: "Invalid Email Please Enter Right Email Id",
        otp: "",
      });
      console.error(error);
    } else {
      res.render("seller/confirmemail", {
        msg: "",
        otp: "OTP send successfully please check your mail id",
      });
      console.log(Rotp);
    }
  });
};

export const sellerregister = async (req, res) => {
  const { username, email, password, phone, gst_number, upi_id, pan_number } =
    userdata;
  const { otp } = req.body;
  console.log(otp);
  try {
    const existinguser = await user.findOne({ email: email });
    console.log("1", existinguser);
    if (existinguser) {
      res.render("customer/sellersignup", { msg: "User Already Exist" });
    } else {
      console.log("Rotp", Rotp);
      console.log("otp", otp);
      if (otp == Rotp) {
        const hashpassword = await bcrypt.hash(password, 10);
        const result = await user.create({
          username: username,
          email: email,
          password: hashpassword,
          phone: phone,
          gst_number: gst_number,
          upi_id: upi_id,
          pan_number: pan_number,
          role: "seller",
          status: "activate"
        });
        await result.save();
        console.log("2", result);

        payload.result = result;
        const expireTime = {
          expiresIn: "1d",
        };
        token = jwt.sign(payload, SECRET_KEY, expireTime);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
        res.cookie("user", result, { httpOnly: true, maxAge: maxAge });

        if (!token) {
          res.json({ message: "Error Occured while dealing with Token" });
        }
        console.log("3", token);

        res.render("customer/index", { msg: "", user: result });
      } else {
        console.log("OTP is not match");
      }
    }
  } catch (err) {
    console.log("something went wrong", err);
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.cookies.user._id;
  const user1 = req.cookies.user;
  console.log("req.body", req.body);
  try {
    const currentUser = await user.findById(userId);
    if (!currentUser) {
      return res.render("customer/updatePassword", {
        msg: "User not found",
        user: user1,
      });
    }

    // Check if the entered current password matches the user's password
    const isMatch = await bcrypt.compare(currentPassword, currentUser.password);

    if (!isMatch) {
      return res.render("customer/updatePassword", {
        msg: "Current password is incorrect",
        user: user1,
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.render("customer/updatePassword", {
        msg: "New passwords do not match",
        user: user1,
      });
    }

    // Hash the new password and update it for the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    await currentUser.save();
    console.log(currentUser);

    res.render("customer/index", {
      msg: "Password updated successfully",
      user: user1,
    });
  } catch (err) {
    console.log("Error updating password:", err);
    res.render("customer/updatePassword", {
      msg: "An error occurred while updating password",
    });
  }
};

export const getProductbuNameController = async (req, res) => {
  try {
    const user = req.cookies.user;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 8;
    const totalProducts = await product
      .find({ catagory: req.params.categoryName })
      .countDocuments();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    // Query the products for the current page
    const searchPart = req.body.searchPart; // Assuming searchPart is a string
    const searchRegex = new RegExp(searchPart, "i");
    const productrecord = await product
      .find({ name: { $regex: searchRegex } })
      .skip(startIndex)
      .limit(itemsPerPage);
    res.render("customer/searhByProduct", {
      productrecord,
      user: user || "", // Default to an empty string if user is not defined
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in Finding Products by Name");
    console.log(error);
  }
};



export const paymentdetailsController =async(req,res)=>{
  try {

    stripeInstance.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: blood_bank_data.bloodBankName,
        
        address: {
            line1: blood_bank_data.bloodBankAddress,
            postal_code: blood_bank_data.zipcode,
            city: blood_bank_data.city,
            state: blood_bank_data.state,
            country: 'India',
        }
    })
    .then(async(customer) => { 
         return await stripeInstance.paymentIntents.create({
            amount: parseInt(req.body.amount),
            currency: 'INR',
            payment_method_types: ['card'],
            customer: customer.id,
            //  source: 'tok-',
          });
    })
    .then((charge) => {
        console.log('charge ',charge);
        res.redirect("success");
    })
    .catch((err) => {
        console.log('error',err);
        res.redirect("failure");
    });
    } catch (error) {
        console.log(error.message);
    }

}
export const successController=async(req,res)=>{  

try{
    res.render("customer/paysuccess");
    }catch(error){
      console.log(error.message)
    }

}

export const userorder = async (req, res) => {
  const user = req.cookies.user;
  const userId = user._id;
  console.log("userorder controller");
  try {
    const order = await Order.find({ user_id: userId });

    res.render("customer/userorder", { orders: order , data:""});
  } catch (err) {
    console.log(err);
  }
};

export const vieworder = async (req, res) => {
  try {
    console.log("vieworder controller");
    const orderId = req.params.orderId;
    // console.log(orderId);
    const order = await Order.findById(orderId);
    // console.log(order);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const productsWithDetails = await Promise.all(
      order.products.map(async (product1) => {
        // console.log(product1);
        const productDetails = await product.findById(product1.product_id);
        const seller_id = await user.findById(productDetails.seller_id);

        console.log(productDetails);
        return {
          ...product1.toObject(),
          productDetails,
        };
      })
    );
    // console.log("Order inside orderDetails controller ", order);
    console.log(
      "productsWithDetails inside orderDetails controller ",
      productsWithDetails
    );
    res.json(productsWithDetails);

    // res.render("customer/bill.ejs", { order, productsWithDetails ,key:STRIPE_PUBLISHABLE_KEY});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


export const sendRequestcontroller = async (req, res) => {
  console.log("asgzDXHF");
  var requestedURL = url.parse(req.url, true).query;
  const result = await messagemodel.create({
      message: requestedURL.sendmessage,
      email: requestedURL.email
  });
  result.save();
  res.render("customer/signin", { msg: "request sent successfully please wait 24 Hours for activate your account", requestforactive: "" })
}