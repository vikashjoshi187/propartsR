import { brands } from "../models/brandsSchema.js";
import { varient } from "../models/varientSchema.js";
import { carmodel } from "../models/CarModel.js";
import { user } from '../models/user.js';
import {Categoryschema} from '../models/categoryModel.js'
import { messagemodel } from '../models/messagemodel.js';








export const addBrandController = async (req, res) => {
  try {
    var Brands = await brands.find();
  } catch (error) {
    console.log("Error in finding Brands");
  }

  var Varients;
  try {
    Varients = await varient.find();
    console.log(Varients);
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }

  try {
    const result = await brands.create(req.body);
    await result.save();
    console.log("Brand Added SucessFylly !!!!");
    res.render("admin/addNewcar", {
      Varients: "",
      carAddedmsg:"",
      Brands: Brands,
      duplicateBrand: `Brand Added Sucessfully`,
      duplicateVarient: "",
      categorymsg:""
    });
  } catch (err) {
    console.log(err.code);
    if (err.code == 11000) {
      res.render("admin/addNewcar", {
        Varients,
        Brands: Brands,
        carAddedmsg:"",
        duplicateBrand: `This Brand  already exsist !!!`,
        duplicateVarient: "",
        categorymsg:""
      });
    }
  }
};

export const dispayBrandsController = async (req, res) => {
  var Varients;
  try {
    Varients = await varient.find();
    console.log(Varients);
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }

  try {
    const Brands = await brands.find();
    res.render("admin/addNewcar", {
      Varients,
      Brands,
      carAddedmsg:"",
      duplicateBrand: "",
      duplicateVarient: "",
      categorymsg:""
    });
  } catch (error) {
    console.log("Error in brands Controller");
    res.render("admin/addNewcar", []);
  }
};

export const addVarientController = async (req, res) => {
  console.log(req.body);
  var Brands;
  try {
    Brands = await brands.find();
  } catch (error) {
    console.log("Error in brands Controller");
  }
  try {
    await varient.create(req.body);
    console.log("Varient Added Sucessfulyy");
  } catch (error) {
    if ((error.code = 11000)) {
      console.log("Error While Adding Varient Duplicate Error");
      res.render("admin/addNewcar", {
        carAddedmsg:"",
        Varients: "",
        Brands: Brands,
        duplicateBrand: "",
        duplicateVarient: "This Varient already exsist !!",
        categorymsg:""
      });
    }
  }

  res.render("admin/addNewcar", {
    carAddedmsg:"",
    Varients: "",
    Brands: Brands,
    duplicateBrand: "",
    duplicateVarient: "Varient Added Sucessfully",
    categorymsg:""
  });
};





export const addCarController = async (req, res) => {
  var Brands;
  try {
    Brands = await brands.find();
  } catch (error) {
    console.log("Error in brands Controller");
  }

  var Varients;
  try {
    Varients = await varient.find();
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }

  var ExsistingCar;
  console.log("Finnding");
  try {
    ExsistingCar = await carmodel.find({
      carName: req.body.carName,
      varientName: req.body.varientName,
      startYear: req.body.startYear,
    });
  } catch (error) {
    console.log("Error in brands Controller");
    console.log(error);
  }


  if (ExsistingCar.length==0) {
    console.log(ExsistingCar);
    console.log("inside If");
    try {

      var startyr=new Date(req.body.startYear).getFullYear();
      console.log(startyr)
      var car= {
        carName:req.body.carName,
        brandId:req.body.brandId,
        varientName:req.body.varientName,
        startYear:startyr
      };
     
      const result = await carmodel.create(car);
      await result.save();
      console.log("Car Added Successfully!!");x
      
      res.render("admin/addNewcar", {
        carAddedmsg:"Car Added Sucessfully !!",
        Varients: Varients,
        Brands: Brands,
        duplicateBrand: "",
        duplicateVarient: "",
        categorymsg:""
      });
    } catch (error) {
      console.log("Eroor in Adding Car");
      console.log(error);
      res.render("admin/addNewcar", {
        carAddedmsg:"Error In Adding Car!!",
        Varients: Varients,
        Brands: Brands,
        duplicateBrand: "",
        duplicateVarient: "",
        categorymsg:""
      });
    }
  }
  
  else {
    console.log("Inside Else");
    res.render("admin/addNewcar", {
      carAddedmsg:"This Car already exsist !!",
      Varients: Varients,
      Brands: Brands,
      duplicateBrand: "",
      duplicateVarient: "",
      categorymsg:""
    });
  }
};

export const varientsAjaxController = async (req, res) => {
  var Varients;
  try {
    Varients = await varient.find({ brandId: req.query.brand });
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }
  res.json(Varients);
};


export const modelsAjaxController = async (req, res) => {
  var Models;
  console.log("models Ajax Runned"+req.query.brand);
  try {
  Models = await carmodel.distinct('carName', { brandId: req.query.brand });

    console.log(Models);
    res.json(Models);
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }
};


  
export const yearAjaxController = async (req, res) => {
  var Year;
  console.log("Year Ajax Controller Runned");
  try {
  Year = await carmodel.find({carName:{$eq:req.query.Model}});
    res.json(Year);
  } catch (error) {
    console.log("Error in getting Years");
    console.log(error);
  }
};


export const searchByFilterController =async (req,res)=>{
  console.log("Search By filter runned");

  try {
                const searchObject = {
                  carName: req.query.carName,
                  brandId: req.query.brandId,
                  varientName: req.query.varientName,
                  startYear: req.query.startYear,
                  __v: 0
                };       
    

  const filteredCar = await carmodel.findOne(searchObject);
  console.log("THis is is th searc hed Car");
    console.log(filteredCar);
        res.json(filteredCar);
      } catch (error) {
        console.log("Error in Filtering ");
        console.log(error);
      }
}

export const sellerList = async (req,res)=>{
  try{

      var search = '';
      if(req.query.search){
        search = req.query.search;
      }
      const result = await user.find({
        role : "seller",
        $or : [
            { username :{ $regex : '.*'+search+'.*',$options :'i'} },
            { email :{ $regex : '.*'+search+'.*',$options :'i'} },
        ]
      });

      res.render("admin/sellerlist",{slist : result});
  }catch(err){
      console.log("Error occures"+err);
  }
};

export const customerList = async (req,res)=>{
  try{
      var search = '';
      if(req.query.search){
        search = req.query.search;
      }
      const result = await user.find({
        role : "customer",
        $or : [
            { username :{ $regex : '.*'+search+'.*',$options :'i'} },
            { email :{ $regex : '.*'+search+'.*',$options :'i'} },
      ]
      });

    res.render("admin/customerlist",{clist : result});
  }catch(err){
      console.log("Error occures"+err);
  }
};


export const adminDeactivateUser = async (request, response) => {
  try {
      var email = request.params.email;

      const user1 = await user.findOne({ email: email });

      if (user1.status == "activate") {
          const updateddata = await user.updateOne({ email: email }, { $set: { status: "deactivate" } });
          const result = await user.find({ role: "customer" });
          response.render('admin/customerList', { clist: result })
      }
      else {
          const updateddata1 = await user.updateOne({ email: email }, { $set: { status: "activate" } })
          const result = await user.find({ role: "customer" });
          response.render('admin/customerList', { clist: result })
      }
  } catch (error) {
      console.log("error while activate or deactivate account");
      console.log(error);
  }
}
export const adminrequestDeactivateUser = async (request, response) => {
  try {
    console.log("adminrequestDeactivateUser");
      var email = request.params.email;

      const user1 = await user.findOne({ email: email });

      if (user1.status == "activate") {
          const updateddata = await user.updateOne({ email: email }, { $set: { status: "deactivate" } });
          const result = await messagemodel.find();
          response.render('admin/adminViewRequest', { result: result })
      }
      else {
          const updateddata1 = await user.updateOne({ email: email }, { $set: { status: "activate" } })
          const result = await messagemodel.find();

          console.log(result);
          response.render('admin/adminViewRequest', { result: result })
      }
  } catch (error) {
      console.log("error while activate or deactivate account");
      console.log(error);
  }
}


export const adminViewRequestController = async(req , res)=>{
  try {
      const result = await messagemodel.find();
      res.render('admin/adminViewRequest', { result: result })
  } catch (error) {
      console.log("error while fetching data from database");
      console.log(error);
  }
}


export const addModelController = async (req, res) => {
  console.log(req.body);
  var Brands;
  try {
    Brands = await brands.find();
  } catch (error) {
    console.log("Error in brands Controller");
  }
  try {
    await models.create(req.body);
    console.log("Model Added Sucessfulyy");
  } catch (error) {
    console.log("Error While Adding Model");
    console.log(error);
  }

  res.render("admin/addNewcar", { Brands: Brands, duplicateBrand: "" });
};





export const addCategoryController= async(req,res)=>{

  try {
    console.log("This ate vatients");
    var Brands = await brands.find();
  } catch (error) {
    console.log("Error in finding Brands");
  }
try {
  var  Varients = await varient.find();
    console.log(Varients);
  } catch (error) {
    console.log("Error in getting Varients");
    console.log(error);
  }
console.log("Add Category Controller Runned runned");
  try {
   var result= await Categoryschema.findOne({categoryName:req.body.categoryName})

   try {
    if (result==null) {

     console.log("We are here");
      console.log(req.files['image1']);
      console.log("------------");
       console.log(req.files['image1'][0]);
        await Categoryschema.create({categoryName:req.body.categoryName,image1:req.files['image1'][0].filename});
      // var data = new Categoryschema({categoryName:req.body.categoryName,image1:req.files['image1'][0].filename})
      //  await data.save();
       res.render("admin/addNewcar", {
       Varients:Varients,
       Brands: Brands,
       carAddedmsg:"",
       duplicateBrand: "",
       duplicateVarient: "",
       categorymsg:"Category Added Sucessfully!!!"
    });
    }
    else{
      res.render("admin/addNewcar", {
        Varients:Varients,
        Brands: Brands,
        carAddedmsg:"",
        duplicateBrand: "",
        duplicateVarient: "",
        categorymsg:"Duplicate Category!!!"
      });
    }
} catch (err) {
    console.log(err);
    if (err.code == 11000) {
      console.log("Duplicate Entry");
      res.render("admin/addNewcar", {
        Varients:Varients,
        Brands: Brands,
        carAddedmsg:"",
        duplicateBrand: "",
        duplicateVarient: "",
        categorymsg:"Duplicate Category!!!"
      });
    } 
   }
  } catch (err) {
    console.log(err);
    console.log("Error in Finding Categoty Data");
    res.render("admin/addNewcar", {
      Varients:Varients,
      Brands: Brands,
      carAddedmsg:"",
      duplicateBrand: "",
      duplicateVarient: "",
      categorymsg:"Error While Adding Category!!!"
    });
  }
}



export const  chatController=(req,res)=>{
    res.render('admin/Message')

}

export const deleteSeller= async (req,res)=>{

    try {
      const ress=   await  user.deleteOne({ _id: `${req.query.seller_id}` })
      const result = await user.find({role : "seller"});

      res.render("admin/sellerlist",{slist : result});
    } catch (error) {
      console.log(error);
      console.log("Error In deletin Seller");
    }
}