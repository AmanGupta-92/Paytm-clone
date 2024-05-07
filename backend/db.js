import mongoose, { connect, Schema } from "mongoose"

//connect to mongo instance
connect("mongodb+srv://admin:hK3d1S4kxwzzlcdQ@cluster0.sszfnuy.mongodb.net/")

//create a Schema for users
const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
})

//create a model from schema
const User = mongoose.model("User", userSchema);


const accountsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

module.exports = {
    User
};