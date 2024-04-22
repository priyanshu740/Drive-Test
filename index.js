import express from "express";
import ejs from "ejs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from "mongoose";
import { userData } from "./model/userModel.js";
import bodyParser from "body-parser"
import session from "express-session";

import { loginUser, logoutUser, registerUserData } from "./controllers/auth.js";
import { addUserData, changeStatusOfTest, getBookedAppointmentDetails, getUserDetails, updateDetails } from "./controllers/user.js";
import { bookTimeslot, createAppointment, getAppointment, getAppointmentDetailsFromDate, toggleAppointmentSlots } from "./controllers/appointment.js";
import { authMiddleware, driverMiddleware } from "./middleware/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

const PORT = 7777;

app.use("/", express.static("./node_modules/bootstrap/dist/"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(
    session({
        secret: "priyanshuAssignment3",
        resave: false,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    req.userType = req.session.userType || null;
    next();
});

const mongodbURl = "mongodb+srv://priyanshutripathi7401:QaA4HGQsNuvmQ6E4@cluster0.uuoj79b.mongodb.net/?retryWrites=true&w=majority"

mongoose
    .connect(mongodbURl)
    .then(() => {
        console.log("Connected to MongoDb Successfully");
    })
    .catch((err) => {
        console.log(`Connection Error:  ${err}`)
    });

//For adding user data from G2 page
app.post("/addUserData", addUserData)

//For getting user data on G page 
app.post("/getUserDataByLicenceNum", getUserDetails);

//For getting user data on G page 
app.post("/getAppointmentDetails", getAppointment);

// For updating user's vehicle infromation 
app.post("/update/carDetails", updateDetails)

// For adding authentication details
app.post("/registerUser", registerUserData);

// For getting user data from credentials
app.post("/loginUser", loginUser);

// For getting getAppointmentDetailsFromDate
app.post("/getAppointmentDetailsFromDate", getAppointmentDetailsFromDate);

// For updating appointment slots
app.put("/toggleAppointmentSlots/:id", toggleAppointmentSlots);

// For getting getBookedAppointmentDetails data
app.get("/getBookedAppointmentDetails", getBookedAppointmentDetails);

// For chnaging status of drivetest and addin comments by examiner
app.post("/changeStatusOfTest", changeStatusOfTest);

// For updating appointment slots
app.post("/bookTimeslot", bookTimeslot);

// For logout 
app.get("/logout", logoutUser);

app.get("/", async (req, res) => {
    res.render("Dashboard", { userType: req.userType });
});
app.get("/G",driverMiddleware ,async (req, res) => {
    res.render("G", { userType: req.userType });
});
app.get("/getUserDataByLicenceNum", async (req, res) => {
    res.render("G", { userType: req.userType });
})
app.get("/G2",driverMiddleware ,async (req, res) => {
    res.render("G2", { userType: req.userType });
});
app.get("/login", async (req, res) => {
    res.render("Login", { userType: req.userType });
})
app.get("/appointment", authMiddleware ,async (req, res) => {
    res.render("Appointment",{ userType: req.userType });
})
app.get("/examiner" ,async (req, res) => {
    res.render("Examiner",{ userType: req.userType });
})

// For creating appointment
app.post("/appointment", createAppointment);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
