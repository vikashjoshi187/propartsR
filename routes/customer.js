import express from 'express';
import { register, login,authenticateJWT,customerproduct,addtocart,cartShow,deleteProduct,profile,placeOrder,placeOrderForProduct,shippingaddress,userorder,brandsAjaxController,modelsAjaxController,varientsAjaxController,yearAjaxController,getProductbuNameController} from '../controllers/customerController.js';
import { forgetpassword,verifyEmailPassword,forgetVerify,verifyemail,forgetLoad,updateprofile,profileupdate,orderDetails,showProductsbyCategoryController,updatePassword,searchByFilterController,paymentdetailsController,successController,vieworder,sendRequestcontroller} from '../controllers/customerController.js';
import upload from "../middleware/upload.js";


const router = express.Router();
router.use(express.static('public'));

router.get('/',authenticateJWT,(req, res) => {
  const user = req.cookies.user;
  res.render("customer/index", { user: user });
});

router.get('/index',authenticateJWT,(req, res) => {
  const user = req.cookies.user;
  res.render("customer/index", { user: user });
});

router.get('/signin', (req, res) => {
  // res.render('customer/signin', { msg: '' });
  res.render('customer/signin', { msg: '' , requestforactive: ""});
});

router.get('/signup', (req, res) => {
  res.render('customer/signup', { msg: '' });

});

router.get('/sellersignup', (req, res) => {
  res.render('customer/sellersignup', { msg: '' });
});

router.get('/payment', (req, res) => {
  res.render('customer/payment');
});

// router.get('/userorder', (req, res) => {
//   res.render('customer/userorder');
// });

router.get('/userorder',userorder);


router.get('/shippingaddress/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  console.log("/shippingaddress/:orderID " ,orderID);
  res.render('customer/shippingaddress',{ orderID:orderID});
});



router.post('/register', verifyemail);
router.post('/Confirmemail',register)
router.post('/login', login);
router.get('/forget',forgetLoad);
router.post('/forget',forgetVerify);
router.post("/forgetpassword",forgetpassword)
router.post("/verifyemail",verifyEmailPassword);
router.get('/product', customerproduct);
router.get('/addtocart:id',authenticateJWT,addtocart);
router.get('/cart', cartShow);
router.get('/cartremove:_id', deleteProduct);
router.get('/placeOrder', placeOrder);
router.post('/placeOrder', placeOrder);
router.post('/placeOrderForProduct:productId',placeOrderForProduct );
router.post('/shippingaddress:orderID', shippingaddress, orderDetails);
// router.get('/categoryProducts', showProductsbyCategoryController);
router.get('/showProductsbyCategory/:categoryName',showProductsbyCategoryController)

// router.get('/orderDetails/:orderID', orderDetails);



router.get('/profile',profile);
router.get('/updateprofile', updateprofile);
router.get('/updatePassword', (req, res) => {
  res.render('customer/updatePassword', { msg: '',user:req.cookies.user });
});
router.post('/updatePassword', updatePassword);

router.post('/profileupdate',upload, profileupdate);

router.get('/logout', (req, res) => {
  console.log("logout")
  res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
  res.cookie('user', '', { httpOnly: true, maxAge: 1 });
  res.render('customer/signin', { msg: '' , requestforactive: ""});
});


router.post('/getProdutctbyName',getProductbuNameController)
router.post('/searchByFilter',searchByFilterController);
router.get('/displayBrandsAjax',brandsAjaxController)
router.get('/displayModelsAjax',modelsAjaxController);
router.get('/displayVarientsAjax',varientsAjaxController)  
router.get('/displayYearAjax',yearAjaxController);

router.get('/sendRequest' , sendRequestcontroller);




router.post('/payment',paymentdetailsController);
router.get('/success',successController);
router.get('/success',successController);

router.get('/paysuccess', (req, res) => {
  res.render('customer/paysuccess');
});
router.get('/vieworder:orderId',vieworder );










export default router;