 import React from 'react'
 import {useRef , useState} from 'react'
 import "../style/videoMeet.css"

const server_url = "http://localhost:8000";
var connections = {};

const peerConfigConnctions = {
    "iceServers":[
        { "urls": "stun:stun.l.google.com:19302"}
    ]
}

export default function VideoMeet(){
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable,setVideoAvailable] = useState(true);
    let [audioAvailable,setaudioAvailable] = useState(true);
    let [video,setVideo] = useState();
    let [Audio,setAudio] = useState();
    let [Screen,setScreen] = useState();
    let [showModel,setModel] = useState();
    let [screenAvailable,setScreenAvailable] = useState();
    let [message,setMessage] = useState([])
    let [ message1,setMessage1] = useState("");
    let [newMessages,setNewMessages] = useState(0);
    let [askForUsername,setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([])
    let [videos,setVideos] = useState([])




 




    return(
        <div>
            <h1>VideoMeet</h1>
            {askForUsername === true ? <div></div> :<></>} 
        </div>
    )
}