const CourseProgress = require('../../models/CourseProgress');
const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');

const markCurrentLectureAsViewed = async(req,res) => {
    try{

        const {userId, courseId, lectureId} = req.body;

        let progress = await CourseProgress.findOne({userId, courseId});

        if(!progress){
            progress = new CourseProgress({
                userId,
                courseId,
                lectureProgress : [
                    {
                        lectureId, 
                        viewed: true, 
                        dateViewed: new Date()
                    }
                ]
            })

            await progress.save();
        }
        else{
            const lectureProgress = progress.lectureProgress.find(item=>item.lectureId===lectureId);

            if(lectureProgress){
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            }
            else{
                progress.lectureProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                })
            }

            await progress.save();
        }

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }

        const allLecturesViewed = progress.lectureProgress.length === course.curriculum.length 
        && progress.lectureProgress.every(item=>item.viewed);

        if(allLecturesViewed){
            progress.completed = true;
            progress.completedDate = new Date();

            await progress.save();
        }

        res.status(200).json({
            success: true,
            message: 'Lecture marked as viewed',
            data: progress,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Occurred!',
        })
    }
}

const getCurrentCourseProgress = async(req,res) => {
    try{
        const {userId, courseId} = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({userId});
        const isCurrentCoursePurchasedByCurrentUserOrNot = studentPurchasedCourses?.courses?.findIndex(item=>item.courseId === courseId) > -1;

        if(!isCurrentCoursePurchasedByCurrentUserOrNot){
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: 'You need to purchase this course to access it',
            })
        }

        const currentUserCourseProgress = await CourseProgress.findOne({userId, courseId});
        
        if(!currentUserCourseProgress || currentUserCourseProgress?.lectureProgress?.length === 0){
            const course = await Course.findById(courseId);

            if(!course){
                return res.status(404).json({
                    success: false,
                    message: 'Course Not Found',
                })
            }

            return res.status(200).json({
                success: true,
                message: 'No progress found, You can start watching the course!',
                data: {
                    courseDetails: course,
                    isPurchased: true,
                    progress: [],
                }
            })
        }

        const courseDetails = await Course.findById(courseId);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lectureProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completedDate,
                isPurchased: true,
            }
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Occurred!',
        })
    }
}

const resetCurrentCourseProgress = async(req,res) => {
    try{

        const {userId, courseId} = req.body;

        const progress = await CourseProgress.findOne({userId, courseId});

        if(!progress){
            return res.status(404).json({
                success: false,
                message: 'Progress not found!',
            })
        }

        progress.lectureProgress = [];
        progress.completed = false;
        progress.completedDate = null;

        await progress.save();

        res.status(200).json({
            success: true,
            message: 'Course progress has been reset',
            data: progress,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Occurred!',
        })
    }
}

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
}