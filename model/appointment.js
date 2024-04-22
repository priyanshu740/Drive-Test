import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  date: { type: String },
  time: { type: String },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  }

});

export const Appointment = mongoose.model("appointment", appointmentSchema)
