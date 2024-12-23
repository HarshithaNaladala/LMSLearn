import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";


function CourseCurriculum() {

    const {
        courseCurriculumFormData, 
        setCourseCurriculumFormData, 
        mediaUploadProgress, 
        setMediaUploadProgress,
        mediaUploadProgressPercentage, 
        setMediaUPloadProgressPercentage,
    } = useContext(InstructorContext);

    const bulkUploadInputRef = useRef(null);

    function handleNewLecture () {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0]
            }
        ])
    }

    function handleCourseTitleChange(event,currentIndex){

        const copyCourseCurriculumFormData = [...courseCurriculumFormData];
        copyCourseCurriculumFormData[currentIndex] = {
            ...copyCourseCurriculumFormData[currentIndex],
            title: event.target.value
        }

        setCourseCurriculumFormData(copyCourseCurriculumFormData);
    }

    function handleFreePreviewChange(value, currentIndex){
        const copyCourseCurriculumFormData = [...courseCurriculumFormData];
        copyCourseCurriculumFormData[currentIndex] = {
            ...copyCourseCurriculumFormData[currentIndex],
            freePreview: value
        }

        setCourseCurriculumFormData(copyCourseCurriculumFormData);
    }

    async function handleSingleLectureUpload(event, currentIndex){

        const selectedFile = event.target.files[0];

        if(selectedFile){
            const videoFormData = new FormData();
            videoFormData.append('file',selectedFile);

            try{
                setMediaUploadProgress(true);
                const response = await mediaUploadService(videoFormData, setMediaUPloadProgressPercentage);

                if(response.success){
                    const copyCourseCurriculumFormData = [...courseCurriculumFormData];
                    copyCourseCurriculumFormData[currentIndex] = {
                        ...copyCourseCurriculumFormData[currentIndex],
                        videoURL: response?.data?.url,
                        public_id: response?.data?.public_id
                    }

                    setCourseCurriculumFormData(copyCourseCurriculumFormData);
                    setMediaUploadProgress(false);
                }
            }
            catch(error){
                console.log(error);
            }

        }
    }

    async function handleReplaceVideo(currentIndex){
        const copyCourseCurriculumFormData = [...courseCurriculumFormData];

        const id = copyCourseCurriculumFormData[currentIndex]?.public_id;

        const mediaReplaceVideoResponse = await mediaDeleteService(id);

        if(mediaReplaceVideoResponse.success){
            copyCourseCurriculumFormData[currentIndex] = {
                ...copyCourseCurriculumFormData[currentIndex],
                videoURL: '',
                public_id: '',
            }

            setCourseCurriculumFormData(copyCourseCurriculumFormData);
        }
    }

    function IsCourseCurriculumFormDataValid () {
        return courseCurriculumFormData.every((item)=>{
            return( item && typeof item === 'object' &&
            item.title.trim() !== '' &&
            item.videoURL.trim() !== ''
            );
        });
    }

    function handleOpenBulkUploadDialog() {
        bulkUploadInputRef.current?.click();
    }
    
    function areAllCourseCurriculumFormDataObjectsEmpty(arr){
        return arr.every((obj)=>{
            return Object.entries(obj).every(([key,value])=>{
                if(typeof value=== 'boolean'){
                    return true;
                }
                return value === '';
            })
        })
    }

    async function handleMediaBulkUpload(event){
        const selectedFiles = Array.from(event.target.files);
        const bullkFormData = new FormData();

        selectedFiles.forEach(fileItem=>bullkFormData.append('files', fileItem));

        try{
            setMediaUploadProgress(true);
            const response = await mediaBulkUploadService(bullkFormData, setMediaUPloadProgressPercentage)

            if(response?.success){
                let copyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData) ?
                [] : [...courseCurriculumFormData];

                copyCourseCurriculumFormData = [
                    ...copyCourseCurriculumFormData,
                    ...response.data.map((item,index)=>({
                        videoURL: item?.url,
                        public_id: item?.public_id,
                        title: `Lecture ${copyCourseCurriculumFormData.length + (index+1) }`,
                        freePreview: false,
                    }))
                ]

                setCourseCurriculumFormData(copyCourseCurriculumFormData);
                setMediaUploadProgress(false);
            }
        }
        catch(e){
            console.log(e);
        }

    }

    async function handleDeleteLecture(currentIndex){
        let copyCourseCurriculumFormData = [...courseCurriculumFormData];

        const getCurrentSelectedVideoPublicId = copyCourseCurriculumFormData[currentIndex]?.public_id;

        const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

        if(response.success){
            copyCourseCurriculumFormData = copyCourseCurriculumFormData.filter((_,index)=>index!==currentIndex);

            setCourseCurriculumFormData(copyCourseCurriculumFormData);
        }

    }

    return (
        <Card>
            <CardHeader className='flex flex-row justify-between'>
                <CardTitle>Create Course Curriculum</CardTitle>
                <div>
                    <Input 
                        type='file' 
                        accept='video/*'
                        ref={bulkUploadInputRef}
                        multiple
                        className='hidden'
                        id='bulk-media-upload'
                        onChange={handleMediaBulkUpload}
                    ></Input>
                    <Button 
                        as='label' 
                        htmlFor='bulk-media-upload'
                        className='cursor-pointer'
                        variant='outline'
                        onClick={handleOpenBulkUploadDialog}
                    >
                        <Upload className="w-4 h-5 mr-2"/>
                        Bulk Upload
                    </Button>
                    
                </div>
            </CardHeader>
            <CardContent>
                <Button disabled={!IsCourseCurriculumFormDataValid()} onClick={handleNewLecture}>Add Lecture</Button>
                {
                    mediaUploadProgress ? 
                    <MediaProgressBar 
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}
                    /> :  null
                }
                <div className="mt-4 space-y-4">
                    {
                        courseCurriculumFormData.map((curriculumItem, index)=>(
                            <div key={curriculumItem.public_id} className="border p-5 rounded-md">
                                <div className="flex gap-5 items-center">
                                    <h3 className="font-semibold">Lecture {index+1}</h3>
                                    <Input 
                                        name={`title-${index+1}`} 
                                        placeholder='Enter Lecture Title'
                                        className='max-w-96'
                                        onChange={(event)=>handleCourseTitleChange(event,index)}
                                        value={courseCurriculumFormData[index]?.title}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Switch 
                                            onCheckedChange={(value)=>handleFreePreviewChange(value,index)} 
                                            checked={courseCurriculumFormData[index]?.freePreview} 
                                            id={`freePreview-${index+1}`} 
                                        />
                                        <Label htmlFor={`freePreview-${index+1}`}>Free Preview</Label>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {
                                        courseCurriculumFormData[index]?.videoURL ? 
                                        <div className="flex gap-3">
                                            <VideoPlayer 
                                                url={courseCurriculumFormData[index]?.videoURL}
                                                width="450px"
                                                height="200px"
                                            ></VideoPlayer>
                                            <Button onClick={()=>handleReplaceVideo(index)}>Replace Video</Button>
                                            <Button
                                                onClick={()=>handleDeleteLecture(index)} 
                                                className='bg-red-900'>Delete Lecture</Button>
                                        </div> 
                                        : <Input 
                                            type='file'
                                            accept='video/*'
                                            className='mb-4'
                                            onChange={(event)=>{handleSingleLectureUpload(event,index)}}
                                        />
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    );
}

export default CourseCurriculum;