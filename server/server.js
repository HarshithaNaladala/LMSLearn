require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes');
const studentCourseRoutes = require('./routes/student-routes/course-routes');
const studentViewOrderRoutes = require('./routes/student-routes/order-routes');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes');
const studentCourseProgressRoutes = require('./routes/student-routes/course-progress-routes');

const app = express();
const PORT = process.env.VITE_PORT;
const MONGO_URL = process.env.VITE_MONGO_URL;

app.use(express.json());

const corsOptions = {
    methods: ['GET','POST','PUT','DELETE'],
    origin: ['http://localhost:5173','https://lms-learn-2f9p5ptjp-harshitha-naladalas-projects.vercel.app'],
    allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));

//Database Connetion
mongoose.connect(MONGO_URL)
        .then(()=>console.log("DB connected"))
        .catch((e)=>console.log(e));

//Routes configuration
app.use('/auth', authRoutes);
app.use('/media',mediaRoutes);
app.use('/instructor/course',instructorCourseRoutes);
app.use('/student/course',studentCourseRoutes);
app.use('/student/order',studentViewOrderRoutes);
app.use('/student/courses-bought',studentCoursesRoutes);
app.use('/student/course-progress',studentCourseProgressRoutes);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});