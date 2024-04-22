import { Appointment } from "../model/appointment.js";

import mongoose from 'mongoose';
import { userData } from "../model/userModel.js";

const { ObjectId } = mongoose.Types;

// For creating new appointments (for ADMIN only)
export const createAppointment = async (req, res) => {

    try {
        const { date, time } = req.body;

        if (!date) {
            return res.render("appointment", { errors: "Please enter date." });
        }

        if (!time) {
            return res.render("appointment", { errors: "Please enter time." });
        }

        // Check if the appointment slot is available
        const existingAppointment = await Appointment.findOne({ date, time });
        if (existingAppointment) {
            console.log("here");
            const errorMessage = "This appointment slot is already added. Please choose another date and time.";
            const alertMessage = `
             <script>
               alert('${errorMessage}');
               window.location.href = '/appointment';
             </script>
          `;
            res.send(alertMessage);
        } else {

            const appointmentDetails = new Appointment({ date, time });
            const newUser = await appointmentDetails.save();

            req.session.user_id = newUser._id;

            const userType = req.session.userType;
            console.log(userType, "userType");

            const successMessage = "Appointmenrt added successfully.";
            const alertMessage = `
                 <script>
                   alert('${successMessage}');
                   window.location.href = '/';
                 </script>
              `;
            res.send(alertMessage);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// For getting available appointment dates
export const getAppointmentDetailsFromDate = async (req, res) => {
    try {
        const { date } = req.body; // Extract the date from the request body

        // Query the database for appointments matching the given date
        const appointments = await Appointment.find({ date: date });

        if (appointments) {
            res.json({ success: true, data: appointments }); // Send the appointment data back to the client

            console.log(appointments, "appointments");
        } else {
            const errorMessage = "No time slots available, for this date.";
            const alertMessage = `
                 <script>
                   alert('${errorMessage}');
                   window.location.href = '/G2';
                 </script>
              `;
            res.send(alertMessage);
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// For toggling between appointmnet slots for ADMIN
export const toggleAppointmentSlots = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            { isTimeSlotAvailable: false }, // Set isTimeSlotAvailable to false
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        return res.status(200).json({ data: appointment });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// For getting appointment details
export const getAppointment = async (req, res) => {
    try {

        const data = await Appointment.find({})

        return res.status(200).json({ data });

    } catch {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// For driver to reserve timeslot via G2 page details
export const bookTimeslot = async (req, res) => {
    console.log(req.body,"req.body")
    try {
        const { timeSlot, date ,test,licenceNumber} = req.body

        const data = await Appointment.findOneAndUpdate({ date:date, time:timeSlot }, { isTimeSlotAvailable: false }, { new: true })

       const user =  await userData.findOneAndUpdate(
            { licenceNumber:licenceNumber },
            {
                $set: {
                    TestType: req.body.typeOfTest === "G2" ? req.body.typeOfTest : "G"
                }
            },
            { new: true } 
        );
        console.log(user,"user")
        res.status(200).send(data)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


