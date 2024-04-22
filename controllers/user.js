import { userData } from "../model/userModel.js";
import bcrypt from "bcryptjs"

// For updating carDetails
export const updateDetails = async (req, res) => {
    try {
        // Update usermodel 
        const data = await userData.findOneAndUpdate({ licenceNumber: req.body.licenceNumber }, {
            carDetails: {
                make: req.body.make,
                model: req.body.model,
                year: req.body.year,
                platno: req.body.platno
            }
        })

        const userType = req.session.userType;

        res.render("Dashboard", {
            data: data, userType: userType
        })

    } catch (error) {
        console.log(error, "error in /update/carDetails API");
        res.status(501).send({ error: error, message: "Internal Server Error" });
    }
};

// For adding userdata
export const addUserData = async (req, res) => {
    try {
        const { firstName, lastName, licenceNumber, Age, Dob, make, model, year, platno } = req.body

        //Storing it session for decrypting it in the "getUserDetails" API 
        req.session.licenceNumber = req.body.licenceNumber;

        // Encrypting licenceNumber
        const encryptedLicenceNumber = await bcrypt.hash(licenceNumber, 10);

        if (!req.body) {
            return res.status(400).json({
                message: "Please enter all the fields in the form"
            })
        } else {
            await userData.findOneAndUpdate({ _id: req.session.user_id }, {
                firstName, lastName, Age, Dob, licenceNumber: encryptedLicenceNumber, carDetails: { make: make, model: model, year: year, platno: platno }
            }, { new: true })

            res.redirect("/")
        }

    } catch (error) {
        console.log(error, "error in /addUserData API");
        res.status(501).send({ error: error, message: "Internal Server Error" });
    }

}

// For getting user information 
export const getUserDetails = async (req, res) => {
    try {
        const username = req.session.username;

        if (!username) {
            return res.render("G2", { error: "Please add data on G2 page." });
        }
        const gUserData = await userData.findOne({ username: username });

        // Sending decrypted licenceNUmber to Client side
        gUserData.licenceNumber = req.session.licenceNumber;

        // Redirect to G2 page if licence number dont match with database
        if (gUserData) {
            res.status(200).json(gUserData);
        } else {
            res.render("G2", { error: "No user found with the provided license number" });
        }

    } catch (error) {
        console.log(error, "error in getUserDetails API");
        res.status(500).send({ message: "Failed to get user data by licence number" });
    }
}

export const getBookedAppointmentDetails = async (req, res) => {
    try {
        const users = await userData.find({
            TestType: { $in: ["G2", "G"] }
        });
        res.status(200).json(users)
    } catch (error) {
        console.log(error, "")
        res.status(500).send({ message: "error in getBookedAppointmentDetails API" });

    }
}


export const changeStatusOfTest = async (req, res) => {
    console.log(req.body)
    try {
        const users = await userData.findOneAndUpdate({_id: req.body.id}, { Comment: req.body.comment, Status: req.body.status }, { new: true })
        res.status(200).json(users)
    } catch (error) {
        console.log(error, "")
        res.status(500).send({ message: "error in getBookedAppointmentDetails API" });

    }
}

