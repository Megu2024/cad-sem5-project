import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // checking if doctor with email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({ success: false, message: "Doctor with this email already exists" });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary or fallback to uploaded file Data URL
    let imageUrl = "/images/doc1.png";
    if (imageFile) {
      try {
        const hasValidCloudinary =
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_KEY !== '123456789' &&
          process.env.CLOUDINARY_SECRET_KEY &&
          process.env.CLOUDINARY_SECRET_KEY !== 'abcdef123456';

        if (hasValidCloudinary) {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
          imageUrl = imageUpload.secure_url;
        }
      } catch (uploadErr) {
        console.log("Cloudinary upload skipped or failed, using local fallback:", uploadErr.message);
      }

      // If Cloudinary wasn't used or failed, read the uploaded file as a base64 Data URL!
      if (!imageUrl || imageUrl === "/images/doc1.png") {
        try {
          const fileData = await fs.promises.readFile(imageFile.path);
          const mimeType = imageFile.mimetype || 'image/png';
          imageUrl = `data:${mimeType};base64,${fileData.toString('base64')}`;
          await fs.promises.unlink(imageFile.path).catch(() => { });
        } catch (readErr) {
          console.log("Error reading uploaded doctor image:", readErr.message);
        }
      }
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === "string" ? JSON.parse(address) : address,
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
      let slots_booked = doctorData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    res.json({ success: true, message: 'Appointment Cancelled' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor details by Admin
const updateDoctor = async (req, res) => {
  try {
    const { docId, name, speciality, degree, experience, about, fees, address, available, password } = req.body;
    const imageFile = req.file;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (speciality) updateData.speciality = speciality;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (about !== undefined) updateData.about = about;
    if (fees !== undefined && fees !== '') updateData.fees = Number(fees);
    if (available !== undefined) updateData.available = available === 'true' || available === true;
    if (address) {
      updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
    }

    if (password && password.trim().length >= 8) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    if (imageFile) {
      let imageUrl = null;
      try {
        const hasValidCloudinary =
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_KEY !== '123456789' &&
          process.env.CLOUDINARY_SECRET_KEY &&
          process.env.CLOUDINARY_SECRET_KEY !== 'abcdef123456';

        if (hasValidCloudinary) {
          const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
          imageUrl = imageUpload.secure_url;
        }
      } catch (uploadErr) {
        console.log("Cloudinary upload failed or skipped, using local fallback:", uploadErr.message);
      }

      if (!imageUrl) {
        try {
          const fileData = await fs.promises.readFile(imageFile.path);
          const mimeType = imageFile.mimetype || 'image/png';
          imageUrl = `data:${mimeType};base64,${fileData.toString('base64')}`;
          await fs.promises.unlink(imageFile.path).catch(() => { });
        } catch (readErr) {
          console.log("Error reading uploaded doctor image:", readErr.message);
        }
      }

      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);
    res.json({ success: true, message: "Doctor updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete doctor by Admin
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }
    await doctorModel.findByIdAndDelete(docId);
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  updateDoctor,
  deleteDoctor
};
