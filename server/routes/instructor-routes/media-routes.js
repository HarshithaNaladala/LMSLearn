const express = require('express');
const router = express.Router();
const multer = require('multer')
const {uploadMediaToCloudinary, deleteMediaFromCloudinary} = require('../../helpers/cloudinary')

const upload = multer({ dest: '/tmp/uploads' });

router.post('/upload', upload.single('file'), async(req,res)=>{
    try{
        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            data: result
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        })
    }
})

router.post('/bulk-upload', upload.array('files', 10), async(req,res)=>{
    try{
        const uploadPromises = req.files.map(fileItem=>uploadMediaToCloudinary(fileItem.path));

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            data: results,
        })
        
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        })
    }
})

router.delete('/delete/:id', async(req,res)=>{
    try{
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Asset id is required'
            })
        }

        deleteMediaFromCloudinary(id);
        res.status(200).json({
            success: true,
            message: 'Asset deleted successfully from cloudinary'
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Error deleting file'
        })
    }
})

module.exports = router;