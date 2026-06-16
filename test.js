
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));

mongoose.connect(
    "mongodb+srv://eliehanna:hanna123@cluster0.poorbcg.mongodb.net/studentsDB?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB Atlas connected"))
.catch(error => console.log(error.message));

const studentSchema = new mongoose.Schema(
    {
        id: Number,
        name: String,
        grade: String,
        photo: String
    },
    { versionKey: false }
);

const Student = mongoose.model("Student", studentSchema);

// Get all students
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Add student
app.post("/students", async (req, res) => {
    try {

        const imagePath = path.join(
            __dirname,
            "public",
            "images",
            req.body.photo
        );

        const image = fs.readFileSync(imagePath);
        const base64 = image.toString("base64");

        const newStudent = new Student({
            id: Number(req.body.id),
            name: req.body.name,
            grade: req.body.grade,
            photo: base64
        });

        await newStudent.save();

        res.json({
            message: "Student added successfully",
            student: newStudent
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// Update student
app.put("/students/:id", async (req, res) => {

    try {

        const oldId = Number(req.params.id);

        const imagePath = path.join(
            __dirname,
            "public",
            "images",
            req.body.photo
        );

        const image = fs.readFileSync(imagePath);
        const base64 = image.toString("base64");

        const student = await Student.findOneAndUpdate(

            { id: oldId },

            {
                id: Number(req.body.id),
                name: req.body.name,
                grade: req.body.grade,
                photo: base64
            },

            { new: true }

        );

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            message: "Student updated successfully",
            student: student
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Delete student
app.delete("/students/:id", async (req, res) => {

    const id = Number(req.params.id);

    const student = await Student.findOneAndDelete({
        id: id
    });

    if (!student) {

        return res.status(404).json({
            message: "Student not found"
        });

    }

    res.json({
        message: "Student deleted successfully"
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
