import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";



function VideoPlayer ({ width= '100%', height= '100%', url, onProgressUpdate, progressData}) {

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const [played,setPlayed] = useState(0);

    const handleProgress = (progress) => {
        setPlayed(progress.played);
    }

    useEffect(()=>{
        if(played==1){
            onProgressUpdate({
                ...progressData,
                progressValue : played
            })
        }
    },[played])

    return (
        <div 
            ref={playerContainerRef}
            className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out}
            `}
        
            style={{ width, height }}
        >
            <ReactPlayer 
                ref={playerRef}
                className='absolute top-0 left-0'
                width='100%'
                height='100%'
                url={url}
                controls
                onProgress={handleProgress}
            />
        </div>
    );
}

export default VideoPlayer;