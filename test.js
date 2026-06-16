const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

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

app.get("/", (req, res) => {
    res.json({
        message: "Students API is running",
        endpoints: ["/students"]
    });
});

app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post("/students", async (req, res) => {
    const newStudent = new Student({
        id: Number(req.body.id),
        name: req.body.name,
        grade: req.body.grade,
        photo: req.body.photo
    });

    await newStudent.save();

    res.json({
        message: "Student added successfully",
        student: newStudent
    });
});

app.put("/students/:id", async (req, res) => {
    const oldId = Number(req.params.id);

    const student = await Student.findOneAndUpdate(
        { id: oldId },
        {
            id: Number(req.body.id),
            name: req.body.name,
            grade: req.body.grade,
            photo: req.body.photo
        },
        { new: true }
    );

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json({
        message: "Student updated successfully",
        student: student
    });
});

app.delete("/students/:id", async (req, res) => {
    const id = Number(req.params.id);

    const student = await Student.findOneAndDelete({ id: id });

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json({
        message: "Student deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});