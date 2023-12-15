import express from 'express';
import upload from "../middleware/upload.js";
import {addCarController,addBrandController,dispayBrandsController,addCategoryController,addModelController,varientsAjaxController,addVarientController,modelsAjaxController,yearAjaxController,searchByFilterController,sellerList,customerList,chatController,deleteSeller,adminDeactivateUser,adminViewRequestController,adminrequestDeactivateUser} from '../controllers/adminController.js'
const router = express.Router();
router.use(express.static('public'));

router.get('/analytics', (req, res) => {
  res.render('admin/analytics');
});

router.get('/addNewcar',dispayBrandsController);
router.post('/addcar',addCarController);
router.post('/addmodel',addModelController);
router.post('/addbrand',addBrandController);
router.post('/addvarient',addVarientController);

router.get('/variants', varientsAjaxController);
router.get('/displayModelsAjax',modelsAjaxController);
router.get('/displayYearAjax',yearAjaxController);
router.get('/searchByFilter',searchByFilterController);
router.get('/messages',chatController)

router.get("/sellerlist",sellerList);
router.get("/customerlist",customerList);
router.post('/addcategory',upload,addCategoryController)

router.get('/deleteseller',deleteSeller)


router.get('/deactivate/:email', adminDeactivateUser);
router.get('/requestdeactivate/:email', adminrequestDeactivateUser);
router.get('/adminViewRequest', adminViewRequestController);

export default router;