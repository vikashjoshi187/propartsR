import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    seller_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require : true
    },   
    name : {
        type : String,
        require : true
    },
    price : {
        type : Number,
        required : true
    },
    sellingPrice : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    returnDays :{
        type : Number,
        required : true
    },
    catagory :{
        type : String,
        required : true
    },
    productBrand : {
        type : String,
        required : true
    },
    description : {
        type : String,
        require : true
    },
    image1 : {
        type : String,
        required : true
    },
    carBrand :{
        type : String,
        required : true
    },
    carName :{
        type : String,
        required : true
    },
    carVarient :{
        type : String,
        required : true
    },
    manufacturingYear :{
        type : String,
        required : true
    }
});

const product = new mongoose.model('Product',ProductSchema)
export default product;
