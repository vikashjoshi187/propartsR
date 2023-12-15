import express from 'express';
const router = express.Router();
import upload from "../middleware/upload.js";
import {addProduct,sellerproduct,productupdate,updateProduct,deleteProduct,getCategoriesController} from '../controllers/sellerController.js';
import {profile,updateprofile,profileupdate,sellerOrders} from '../controllers/sellerController.js';
import{sellerverifyemail,sellerregister} from '../controllers/customerController.js';
router.use(express.static('public'));



router.get('/addproduct', (req, res) => {
  res.render('seller/addproduct');
});

router.get('/selleranalytics', (req, res) => {
  res.render('seller/selleranalytics');
});

router.get('/sellerorder',sellerOrders);

// router.get('/product', (req, res) => {
//   const user = req.cookies.user;
//  const productrecord = [];
//   res.render('seller/product',{user:user,productrecord:productrecord});
// });


router.post("/addproduct", upload,addProduct);

router.post('/sellerregister', sellerverifyemail);
router.post('/Confirmemail',sellerregister)
router.get('/product', sellerproduct);

router.get('/productupdate:id', productupdate);

router.post('/updateProduct:id',upload, updateProduct);
router.get('/deleteProduct:id', deleteProduct);
router.get('/getCategories',getCategoriesController)

router.get('/profile',profile);
router.get('/updateprofile', updateprofile);

router.post('/profileupdate',upload,profileupdate);
router.get('/message',(req,res)=>{
  res.render('seller/Message')
})
// Add more routes as needed
export default router;
