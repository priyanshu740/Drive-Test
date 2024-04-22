import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    userType: {
        type: String,
        enum: ["Driver", "Examiner", "Admin"],
        default: "Driver",
    },
    firstName: {
        type: String, default: ""
    },
    lastName: {
        type: String, default: ""
    },
    licenceNumber: {
        type: String, default: ""
    },
    Age: {
        type: Number, default: 0
    },
    Dob: {
        type: String, default: Date.now
    },
    carDetails: {
        make: { type: String, default: "" },
        model: { type: String, default: "" },
        year: { type: Number, default: 0 },
        platno: { type: String, default: "" },
    },
    TestType: {
        type: String, default: ""
    },
    Comment:{
        type:String,default:"   "
    },
    Status:{
        type:String,deafult:""
    }
})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


// For creating model in mongoDB
export const userData = mongoose.model("userModel", userSchema)

