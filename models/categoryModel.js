import mongoose from "./connection.js";

const Category = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique:true,
        unique:true
    },
    image1: {
        type: String,
        required: true,
    }
 
});
export const Categoryschema = mongoose.model("Category", Category,"Category");