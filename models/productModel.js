const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique: true
    },
    images: [
        {
            type: String,
            required: true  
        }
    ],
    brand: {
        type:String,
        required: true
    },
    category:[
        {
            type: String
        }
    ],
    description: {
        type: String,
        required:true
    },
    price:{
        type:String,
        required: true
    },
    discountPrice: {
        type:String,
        required: true,
        default: this.price
    },
    stock: {
        type:Number,
        required: true
    },
    rating: {
        type:Number
    }
}, {timestamps: true});

const productModel= mongoose.model('Product',productSchema);
module.exports= productModel;