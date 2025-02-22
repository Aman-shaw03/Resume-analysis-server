import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email: String,
    education:{
        degree: String,
        branch: String,
        institution: String,
        year: Number
    },
    experience:{
        job_title: String,
        company: String,
        start_date: Date,
        end_date: Date
    },
    summary: String,
    skills: [String]
},{
    timestamps: true
})

const Applicant = mongoose.model("Applicant", applicantSchema)

export default Applicant