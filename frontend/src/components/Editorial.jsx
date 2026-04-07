import { PlayIcon , PauseIcon ,RotateCcwIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import '@videojs/react/video/skin.css';
    import { createPlayer, videoFeatures } from '@videojs/react';
    import { VideoSkin, Video } from '@videojs/react/video';

const Editorial=({secureUrl,duration})=>{

    //states
    //isplaying
    //playtime
    //hover

    
    console.log({duration})

    const [isPlaying,setIsPlaying]=useState(false)
    const [currentTime,setCurrentTime]=useState(0)
    const [hover,setHover]=useState(false)

    const videoRef=useRef()

    

    const Player = createPlayer({ features: videoFeatures });

    const MyPlayer = ({ src }) => {
    return (
        <Player.Provider>
        <VideoSkin>
            <Video src={src} playsInline />
        </VideoSkin>
        </Player.Provider>
    );
    }

    return(
        <div>        
            {secureUrl ? <MyPlayer src={secureUrl} ></MyPlayer> : "No Video Solutions for this problem"}
            
            {/* <input className="w-full" type="range" max={duration} value={currentTime} onChange={(e)=>{const time=Number(e.target.value);setCurrentTime(Number(e.target.value));videoRef.current.currentTime=time}}></input>
            <div className="flex">
                <button onClick={toggglePlayPause}>{isPlaying ? <PauseIcon></PauseIcon> : <PlayIcon></PlayIcon>}</button>
                <div></div>
                <button></button>
            </div> */}
        </div>
    )
}

export {Editorial}