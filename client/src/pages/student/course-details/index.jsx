import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context"
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from "@/services";
import { Skeleton } from "antd";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";


function StudentViewCourseDetailsPage() {

    const {
        studentViewCourseDetails, 
        setStudentViewCourseDetails,
        currentCourseDetailsId, 
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [currentPlayingVideoId, setCurrentPlayingVideoId] = useState(null);

    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    const [approvalUrl, setApprovalUrl] = useState('')

    async function fetchStudentViewCourseDetails() {

        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(currentCourseDetailsId, auth?.user?._id);

        if(checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data){
            navigate(`/course-progress/${currentCourseDetailsId}`);
            return
        }

        const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);

        if(response?.success){
            setStudentViewCourseDetails(response.data);
            setLoadingState(false);
        }
        else{
            setStudentViewCourseDetails(null);
            setLoadingState(false);
        }
    }

    useEffect(()=>{
        if(currentCourseDetailsId !== null) {
            setStudentViewCourseDetails(null);  
            setLoadingState(true); 
            fetchStudentViewCourseDetails();
        }
    },[currentCourseDetailsId])

    useEffect(()=>{
        setCurrentCourseDetailsId(id);
    },[id])

    useEffect(()=>{
        if(!location.pathname.includes('course/details')){
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
        }
    },[location.pathname])

    const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ? 
    studentViewCourseDetails?.curriculum.findIndex(item=>item.freePreview)
    : -1

    function handleSetFreePreview(getCurrentVideoInfo){
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoURL)
        setCurrentPlayingVideoId(getCurrentVideoInfo?.public_id);
    }
    

    async function handleCreatePayment(){
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'initiated',
            orderDate: new Date(),
            paymentId: '',
            payerId: '',
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing,
        }

        const response = await createPaymentService(paymentPayload);

        if(response?.success){
            sessionStorage.setItem('currentOrderId',JSON.stringify(response?.data?.orderId));
            setApprovalUrl(response?.data?.approveUrl);
        }
    }

    useEffect(()=>{
        if(displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true)
    },[displayCurrentVideoFreePreview])

    useEffect(() => {
        if (approvalUrl !== '') {
            window.location.href = approvalUrl;
        }
    }, [approvalUrl]);


    if(loadingState) return <Skeleton />;

    return(
        <div className="mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
                <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCourseDetails?.instructorName}</span>
                    <span>Created ON {studentViewCourseDetails?.date.split('T')[0]}</span>
                    <span className="flex items-center">
                        <Globe className="mr-1 h-4 w-4"/>
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span>{studentViewCourseDetails?.students.length} {studentViewCourseDetails?.students.length<=1 ? 'Student' : 'Students'}</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>What you'll Learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {
                                    studentViewCourseDetails?.objectives.split(',').map((objective, index)=>(
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrinnk-0"/>
                                            <span>{objective}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.description}
                        </CardContent>
                    </Card>
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                studentViewCourseDetails?.curriculum.map((curriculumItem,index)=>(
                                    <li key={index} className={`${curriculumItem.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center mb-4`}
                                        onClick={curriculumItem.freePreview ? ()=>handleSetFreePreview(curriculumItem) : null}
                                    >
                                        {
                                            curriculumItem?.freePreview ? 
                                            <PlayCircle className="mr-2 h-4 w-4"/> : <Lock className="mr-2 h-4 w-4"/>
                                        }
                                        <span>{curriculumItem?.title}</span>
                                    </li>
                                ))
                            }
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className='sticky top-4'>
                        <CardContent className='p-6'>
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer 
                                    url={
                                        getIndexOfFreePreviewUrl !== -1 ?
                                        studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoURL : ''
                                    }
                                    width="450px"
                                    height="200px"
                                />
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    ${studentViewCourseDetails?.pricing}
                                </span>
                            </div>
                            <Button className='w-full' onClick={handleCreatePayment}>Buy Now</Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog 
                open={showFreePreviewDialog} 
                onOpenChange={()=>{
                    setShowFreePreviewDialog(false)
                    setDisplayCurrentVideoFreePreview(null)
                }}
            >
                <DialogContent className='w-[600px]'>
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                         <VideoPlayer 
                            url={
                                displayCurrentVideoFreePreview
                            }
                            width="450px"
                            height="200px"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        {
                            studentViewCourseDetails?.curriculum?.filter(item=>item.freePreview)
                            .map(filteredItem=>(
                                <p 
                                    onClick={()=>handleSetFreePreview(filteredItem)} 
                                    key={filteredItem.public_id} 
                                    className={`cursor-pointer text-[16px] font-md ${currentPlayingVideoId === filteredItem.public_id ? 'text-blue-800' : 'hover:bg-gray-100'}`}
                                >
                                    {filteredItem?.title}
                                </p>
                            ))
                        }
                    </div>
                    <DialogFooter className='sm:justify-start'>
                        <DialogClose>
                            <Button type="button" variant='secondary'>
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseDetailsPage