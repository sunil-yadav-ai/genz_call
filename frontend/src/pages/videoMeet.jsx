import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../style/videoMeet.css";
import { io } from "socket.io-client";


const server_url = "http://localhost:8000";

const peerConfigConnections = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

const connections = {};

export default function VideoMeet() {
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const localVideoRef = useRef(null);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);

    const [screenAvailable, setScreenAvailable] = useState(false);
    const [screen, setScreen] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [message, setMessage] = useState([]);
    const [message1, setMessage1] = useState("");
    const [newMessages, setNewMessages] = useState(0);

    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");

    const videoRef = useRef([]);
    const [videos, setVideos] = useState([]);

    // ------------------------------------
    // GET CAMERA, MICROPHONE & SCREEN PERMISSION
    // ------------------------------------

    const getPermissions = async () => {
        try {
            // Camera permission
            try {
                const videoPermission =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });

                if (videoPermission) {
                    setVideoAvailable(true);

                    // Camera tracks stop after checking permission
                    videoPermission.getTracks().forEach((track) => {
                        track.stop();
                    });
                }
            } catch (error) {
                console.log("Camera permission denied");
                setVideoAvailable(false);
            }

            // Microphone permission
            try {
                const audioPermission =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });

                if (audioPermission) {
                    setAudioAvailable(true);

                    // Audio tracks stop after checking permission
                    audioPermission.getTracks().forEach((track) => {
                        track.stop();
                    });
                }
            } catch (error) {
                console.log("Microphone permission denied");
                setAudioAvailable(false);
            }

            // Screen sharing
            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            // Get initial media stream
            if (videoAvailable || audioAvailable) {
                const userMediaStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: videoAvailable,
                        audio: audioAvailable,
                    });

                window.localStream = userMediaStream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = userMediaStream;
                }
            }
        } catch (error) {
            console.log("Permission error:", error);
        }
    };

    // ------------------------------------
    // GET USER MEDIA
    // ------------------------------------

    const getUserMedia = async () => {
        try {
            if (video || audio) {
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: video,
                        audio: audio,
                    });

                window.localStream = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } else {
                if (
                    localVideoRef.current &&
                    localVideoRef.current.srcObject
                ) {
                    const tracks =
                        localVideoRef.current.srcObject.getTracks();

                    tracks.forEach((track) => track.stop());

                    localVideoRef.current.srcObject = null;
                }
            }
        } catch (error) {
            console.log("Media error:", error);
        }
    };

    // ------------------------------------
    // RUN PERMISSION CHECK ON PAGE LOAD
    // ------------------------------------

    useEffect(() => {
        getPermissions();
    }, []);

    // ------------------------------------
    // RUN WHEN VIDEO/AUDIO CHANGES
    // ------------------------------------

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    // ------------------------------------
    // CONNECT BUTTON
    // ------------------------------------

    // Todo

    let gotMessageFromServer = (fromId,message) =>{

    }

    //todo addmessage
    let addMessage =()=>{

    }


    const connect = () => {
        socketRef.current = io.connect(server_url,{ secure: false})

        socketRef.current.on('signal',gotMessageFromServer);
        socketRef.current.on("connect",()=>{

            socketRef.current.emit("join-call",window.location.href)

            socketIdRef.current = socketRef.current.id
            socketRef.current.on("chat-message",addmessage)

            socketRef.current.on("user-left",(id)=>{
                setVideo((videos)=>videos.filter((video)=>video.sockerId !== id ))
            })

            socketRef.current.on("user-joined",(id,clients) => {
                clients.forEach((socketListId)=>{

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    
                    connections[socketListId].onicecandidate = (event) =>{
                        if(event.candidate !== null){
                            socketRef.current.emit("signal",socketListId,JSON.stringify({'ice':event.candidate}))
                        }
                    }
                    connections[socketListId].onaddstrem = (event) =>{

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if(videoExists){
                            setVideo(videos =>{
                                const updateVideos = video.map(video =>{
                                    video.socketId === socketListId ? { ...video, steam:event.steam}:video
                                })
                                videoRef.current = updateVideos;
                                return updateVideos
                            })
                        }else{

                            let newVideo = {
                                socketId: socketListId,
                                stream:event.stream,
                                autoPlay:true,
                                playsinline:true
                            }

                            setVideos(videos =>{
                                const updatedVideos = [...videos,newVideo];
                                videoRef.current = updateVideos;
                                return updateVideos;
                            });

                        }


                    };

                    if(window.localStream !== undefined && window.localStream !== null){
                        connections[socketListId].addStrem(window.localStream);

                    }else{
                        // todo blackSlience
                        let blackSlience
    }

                })
                if(id === socketIdRef.current){
                    for(let id2 in connections){
                        if(id2 === socketIdRef.current) continue
                        try{
                            connections[id2].addStream(window.localStream)
                        }catch(e){

                        }
                        connections[id2].createOffer().then((description)=>{
                            connections[id2].setLocalDescription(description)
                            .then(()=>{
                                socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                            })
                            .catch(e => console.log(e))
                        }) 
                    }
                }
            })
        })

        setAskForUsername(false);

        // Socket connection will be added here
        // connectToSocketServer();
    };

    
    // ------------------------------------
    // ENABLE VIDEO + AUDIO
    // ------------------------------------

    const getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
    };

    // ------------------------------------
    // UI
    // ------------------------------------

    return (
        <div className="videoMeetContainer">

            {askForUsername ? (
                <div className="lobbyContainer">

                    <h1>Enter into lobby</h1>

                    <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <Button
                        variant="contained"
                        onClick={connect}
                    >
                        Connect
                    </Button>

                    <div className="localVideoContainer">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                        ></video>
                    </div>

                </div>
            ) : (
                <div className="meetingContainer">

                    <h1>Welcome {username}</h1>

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                    ></video>

                </div>
            )}
        </div>
    );
}