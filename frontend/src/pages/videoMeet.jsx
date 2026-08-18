// // import React, { useEffect, useRef, useState } from "react";
// // import Button from "@mui/material/Button";
// // import TextField from "@mui/material/TextField";
// // import "../style/videoComponent.css";
// // import { io } from "socket.io-client";
// // import IconButton from "@mui/material/IconButton";
// // import VideocamIcon from "@mui/icons-material/Videocam";
// // import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// // import CallEndIcon from "@mui/icons-material/CallEnd";
// // import MicIcon from "@mui/icons-material/Mic";
// // import MicOffIcon from "@mui/icons-material/MicOff";
// // import ScreenShareIcon from "@mui/icons-material/ScreenShare";
// // import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";

// // const server_url = "http://localhost:8000";

// // const peerConfigConnections = {
// //     iceServers: [
// //         {
// //             urls: "stun:stun.l.google.com:19302",
// //         },
// //     ],
// // };

// // export default function VideoMeet() {
// //     const socketRef = useRef(null);
// //     const socketIdRef = useRef(null);
// //     const localVideoRef = useRef(null);

// //     const connectionsRef = useRef({});

// //     const [username, setUsername] = useState("");
// //     const [askForUsername, setAskForUsername] = useState(true);

// //     const [videos, setVideos] = useState([]);

// //     const [videoAvailable, setVideoAvailable] = useState(true);
// //     const [audioAvailable, setAudioAvailable] = useState(true);

// //     const [video, setVideo] = useState(false);
// //     const [audio, setAudio] = useState(false);

// //     const [screenAvailable, setScreenAvailable] = useState(false);
// //     const [screen, setScreen] = useState(false);

// //     // -----------------------------------------
// //     // GET CAMERA + MICROPHONE
// //     // -----------------------------------------

// //     const getMedia = async () => {
// //         try {
// //             const stream =
// //                 await navigator.mediaDevices.getUserMedia({
// //                     video: true,
// //                     audio: true,
// //                 });

// //             window.localStream = stream;

// //             setVideo(true);
// //             setAudio(true);

// //             if (localVideoRef.current) {
// //                 localVideoRef.current.srcObject = stream;
// //             }

// //             console.log("Camera and microphone started");

// //             return stream;
// //         } catch (error) {
// //             console.error(
// //                 "Camera/Microphone error:",
// //                 error
// //             );

// //             setVideoAvailable(false);
// //             setAudioAvailable(false);

// //             alert(
// //                 "Camera or microphone permission denied."
// //             );

// //             return null;
// //         }
// //     };

// //     // -----------------------------------------
// //     // ATTACH LOCAL VIDEO
// //     // -----------------------------------------

// //     useEffect(() => {
// //         if (
// //             !askForUsername &&
// //             localVideoRef.current &&
// //             window.localStream
// //         ) {
// //             localVideoRef.current.srcObject =
// //                 window.localStream;

// //             localVideoRef.current
// //                 .play()
// //                 .catch((error) => {
// //                     console.log(
// //                         "Video play error:",
// //                         error
// //                     );
// //                 });
// //         }
// //     }, [askForUsername]);

// //     // -----------------------------------------
// //     // HANDLE SIGNAL
// //     // -----------------------------------------

// //     const gotMessageFromServer = async (
// //         fromId,
// //         message
// //     ) => {
// //         try {
// //             const signal = JSON.parse(message);

// //             const peer =
// //                 connectionsRef.current[fromId];

// //             if (!peer) {
// //                 return;
// //             }

// //             // -------------------------
// //             // SDP
// //             // -------------------------

// //             if (signal.sdp) {
// //                 await peer.setRemoteDescription(
// //                     new RTCSessionDescription(
// //                         signal.sdp
// //                     )
// //                 );

// //                 if (signal.sdp.type === "offer") {
// //                     const answer =
// //                         await peer.createAnswer();

// //                     await peer.setLocalDescription(
// //                         answer
// //                     );

// //                     socketRef.current.emit(
// //                         "signal",
// //                         fromId,
// //                         JSON.stringify({
// //                             sdp: peer.localDescription,
// //                         })
// //                     );
// //                 }
// //             }

// //             // -------------------------
// //             // ICE
// //             // -------------------------

// //             if (signal.ice) {
// //                 try {
// //                     await peer.addIceCandidate(
// //                         new RTCIceCandidate(
// //                             signal.ice
// //                         )
// //                     );
// //                 } catch (error) {
// //                     console.log(
// //                         "ICE candidate error:",
// //                         error
// //                     );
// //                 }
// //             }
// //         } catch (error) {
// //             console.log(
// //                 "Signal handling error:",
// //                 error
// //             );
// //         }
// //     };

// //     // -----------------------------------------
// //     // CREATE PEER CONNECTION
// //     // -----------------------------------------

// //     const createPeerConnection = (
// //         socketListId
// //     ) => {
// //         const peer =
// //             new RTCPeerConnection(
// //                 peerConfigConnections
// //             );

// //         connectionsRef.current[socketListId] =
// //             peer;

// //         // -------------------------
// //         // ICE CANDIDATE
// //         // -------------------------

// //         peer.onicecandidate = (event) => {
// //             if (
// //                 event.candidate &&
// //                 socketRef.current
// //             ) {
// //                 socketRef.current.emit(
// //                     "signal",
// //                     socketListId,
// //                     JSON.stringify({
// //                         ice: event.candidate,
// //                     })
// //                 );
// //             }
// //         };

// //         // -------------------------
// //         // REMOTE STREAM
// //         // -------------------------

// //         peer.ontrack = (event) => {
// //             const remoteStream =
// //                 event.streams[0];

// //             if (!remoteStream) {
// //                 return;
// //             }

// //             setVideos((oldVideos) => {
// //                 const exists =
// //                     oldVideos.find(
// //                         (item) =>
// //                             item.socketId ===
// //                             socketListId
// //                     );

// //                 if (exists) {
// //                     return oldVideos.map(
// //                         (item) =>
// //                             item.socketId ===
// //                             socketListId
// //                                 ? {
// //                                       ...item,
// //                                       stream: remoteStream,
// //                                   }
// //                                 : item
// //                     );
// //                 }

// //                 return [
// //                     ...oldVideos,
// //                     {
// //                         socketId:
// //                             socketListId,
// //                         stream: remoteStream,
// //                     },
// //                 ];
// //             });
// //         };

// //         // -------------------------
// //         // CONNECTION STATE
// //         // -------------------------

// //         peer.onconnectionstatechange = () => {
// //             console.log(
// //                 "Connection:",
// //                 socketListId,
// //                 peer.connectionState
// //             );
// //         };

// //         // -------------------------
// //         // ADD LOCAL TRACKS
// //         // -------------------------

// //         if (window.localStream) {
// //             window.localStream
// //                 .getTracks()
// //                 .forEach((track) => {
// //                     peer.addTrack(
// //                         track,
// //                         window.localStream
// //                     );
// //                 });
// //         }

// //         return peer;
// //     };

// //     // -----------------------------------------
// //     // CREATE OFFER
// //     // -----------------------------------------

// //     const createOffer = async (
// //         socketListId
// //     ) => {
// //         try {
// //             const peer =
// //                 connectionsRef.current[
// //                     socketListId
// //                 ];

// //             if (!peer) {
// //                 return;
// //             }

// //             const offer =
// //                 await peer.createOffer();

// //             await peer.setLocalDescription(
// //                 offer
// //             );

// //             socketRef.current.emit(
// //                 "signal",
// //                 socketListId,
// //                 JSON.stringify({
// //                     sdp: peer.localDescription,
// //                 })
// //             );
// //         } catch (error) {
// //             console.log(
// //                 "Offer error:",
// //                 error
// //             );
// //         }
// //     };

// //     // -----------------------------------------
// //     // CONNECT TO SOCKET SERVER
// //     // -----------------------------------------

// //     const connect = async () => {
// //         if (!username.trim()) {
// //             alert("Please enter your username");
// //             return;
// //         }

// //         // First start camera + microphone
// //         const stream = await getMedia();

// //         if (!stream) {
// //             return;
// //         }

// //         // Connect socket
// //         socketRef.current = io(server_url, {
// //             transports: ["websocket", "polling"],
// //         });

// //         // Signal
// //         socketRef.current.on(
// //             "signal",
// //             gotMessageFromServer
// //         );

// //         // Socket connected
// //         socketRef.current.on(
// //             "connect",
// //             () => {
// //                 console.log(
// //                     "Socket connected:",
// //                     socketRef.current.id
// //                 );

// //                 socketIdRef.current =
// //                     socketRef.current.id;

// //                 socketRef.current.emit(
// //                     "join-call",
// //                     window.location.href
// //                 );
// //             }
// //         );

// //         // ---------------------------------
// //         // USER JOINED
// //         // ---------------------------------

// //         socketRef.current.on(
// //             "user-joined",
// //             (
// //                 id,
// //                 clients
// //             ) => {
// //                 console.log(
// //                     "User joined:",
// //                     id,
// //                     clients
// //                 );

// //                 clients.forEach(
// //                     (socketListId) => {
// //                         if (
// //                             socketListId ===
// //                             socketIdRef.current
// //                         ) {
// //                             return;
// //                         }

// //                         if (
// //                             !connectionsRef.current[
// //                                 socketListId
// //                             ]
// //                         ) {
// //                             createPeerConnection(
// //                                 socketListId
// //                             );
// //                         }
// //                     }
// //                 );

// //                 // New user creates offers
// //                 if (
// //                     id ===
// //                     socketIdRef.current
// //                 ) {
// //                     clients.forEach(
// //                         (socketListId) => {
// //                             if (
// //                                 socketListId ===
// //                                 socketIdRef.current
// //                             ) {
// //                                 return;
// //                             }

// //                             createOffer(
// //                                 socketListId
// //                             );
// //                         }
// //                     );
// //                 }
// //             }
// //         );

// //         // ---------------------------------
// //         // USER LEFT
// //         // ---------------------------------

// //         socketRef.current.on(
// //             "user-left",
// //             (id) => {
// //                 console.log(
// //                     "User left:",
// //                     id
// //                 );

// //                 const peer =
// //                     connectionsRef.current[
// //                         id
// //                     ];

// //                 if (peer) {
// //                     peer.close();

// //                     delete connectionsRef.current[
// //                         id
// //                     ];
// //                 }

// //                 setVideos(
// //                     (oldVideos) =>
// //                         oldVideos.filter(
// //                             (video) =>
// //                                 video.socketId !==
// //                                 id
// //                         )
// //                 );
// //             }
// //         );

// //         setAskForUsername(false);
// //     };

// //     // -----------------------------------------
// //     // VIDEO ENABLE / DISABLE
// //     // -----------------------------------------

// //     const toggleVideo = () => {
// //         if (!window.localStream) {
// //             return;
// //         }

// //         const videoTrack =
// //             window.localStream.getVideoTracks()[0];

// //         if (videoTrack) {
// //             videoTrack.enabled =
// //                 !videoTrack.enabled;

// //             setVideo(
// //                 videoTrack.enabled
// //             );
// //         }
// //     };

// //     // -----------------------------------------
// //     // AUDIO ENABLE / DISABLE
// //     // -----------------------------------------

// //     const toggleAudio = () => {
// //         if (!window.localStream) {
// //             return;
// //         }

// //         const audioTrack =
// //             window.localStream.getAudioTracks()[0];

// //         if (audioTrack) {
// //             audioTrack.enabled =
// //                 !audioTrack.enabled;

// //             setAudio(
// //                 audioTrack.enabled
// //             );
// //         }
// //     };

// //     // -----------------------------------------
// //     // CLEANUP
// //     // -----------------------------------------

// //     useEffect(() => {
// //         return () => {
// //             if (socketRef.current) {
// //                 socketRef.current.disconnect();
// //             }

// //             Object.values(
// //                 connectionsRef.current
// //             ).forEach((peer) => {
// //                 peer.close();
// //             });

// //             connectionsRef.current = {};

// //             if (window.localStream) {
// //                 window.localStream
// //                     .getTracks()
// //                     .forEach((track) => {
// //                         track.stop();
// //                     });

// //                 window.localStream = null;
// //             }
// //         };
// //     }, []);

// //     // -----------------------------------------
// //     // UI
// //     // -----------------------------------------

// //     return (
// //         <div className="videoMeetContainer">

// //             {/* =========================
// //                 LOBBY
// //             ========================= */}

// //             {askForUsername ? (
// //                 <div className="lobbyContainer">

// //                     <h1>
// //                         Enter into lobby
// //                     </h1>

// //                     <TextField
// //                         label="Username"
// //                         variant="outlined"
// //                         value={username}
// //                         onChange={(e) =>
// //                             setUsername(
// //                                 e.target.value
// //                             )
// //                         }
// //                     />

// //                     <Button
// //                         variant="contained"
// //                         onClick={connect}
// //                     >
// //                         Join Meeting
// //                     </Button>

// //                     <div className="localVideoContainer">

// //                         <video
// //                             ref={
// //                                 localVideoRef
// //                             }
// //                             autoPlay
// //                             muted
// //                             playsInline
// //                         />

// //                     </div>

// //                 </div>
// //             ) : (

// //                 /* =========================
// //                    MEETING
// //                 ========================= */

// //                 <div className="meetVideoContainer">

// //                     <h1>
// //                         Welcome, {username}
// //                     </h1>

                    

// //                     <div className="buttonContainers">

// //                         <IconButton style={{color:"white"}}>
// //                             {(video===true)? <VideocamIcon/>:<VideocamOffIcon/>}
// //                         </IconButton>
// //                         <IconButton style={{color:"red"}}>
// //                             <CallEndIcon/>
// //                         </IconButton>
// //                         <IconButton style={{color:"white"}}>
// //                            {audio === true ? <MicIcon/>:<MicOffIcon/>}
// //                         </IconButton>

// //                         {
// //                             screenAvailable === true ? 
// //                                 <IconButton>
// //                                     {screen === true ? <ScreenShareIcon/>:<ScreenShareStopIcon/>}
// //                                 </IconButton> : 
// //                                 <></>
// //                         } 


                        

// //                         <video

// //                             className="meetUserVideo"
// //                             ref={
// //                                 localVideoRef
// //                             }
// //                             autoPlay
// //                             muted
// //                             playsInline
// //                         />

// //                     </div>

// //                     {/* CONTROLS */}

// //                     <div className="controls">

// //                         <Button
// //                             variant="contained"
// //                             onClick={
// //                                 toggleVideo
// //                             }
// //                         >
// //                             {video
// //                                 ? "Turn Camera Off"
// //                                 : "Turn Camera On"}
// //                         </Button>

// //                         <Button
// //                             variant="contained"
// //                             onClick={
// //                                 toggleAudio
// //                             }
// //                         >
// //                             {audio
// //                                 ? "Mute"
// //                                 : "Unmute"}
// //                         </Button>

// //                     </div>

// //                     {/* REMOTE VIDEOS */}

// //                     <div >

// //                         {videos.map(
// //                             (item) => (
// //                                 <div
// //                                     className="conferenceView"
// //                                     key={
// //                                         item.socketId
// //                                     }
// //                                     className="remoteVideoContainer"
// //                                 >

// //                                     <h3>
// //                                         {item.socketId}
// //                                     </h3>

// //                                     <video
// //                                         autoPlay
// //                                         playsInline
// //                                         ref={(
// //                                             videoElement
// //                                         ) => {
// //                                             if (
// //                                                 videoElement &&
// //                                                 item.stream
// //                                             ) {
// //                                                 videoElement.srcObject =
// //                                                     item.stream;
// //                                             }
// //                                         }}
// //                                     />

// //                                 </div>
// //                             )
// //                         )}

// //                     </div>

// //                 </div>
// //             )}

// //         </div>
// //     );
// // }





// import React, { useEffect, useRef, useState } from "react";

// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import IconButton from "@mui/material/IconButton";

// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import CallEndIcon from "@mui/icons-material/CallEnd";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import ScreenShareIcon from "@mui/icons-material/ScreenShare";
// import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
// import Badge from "@mui/material/Badge";
// import ChatIcon from "@mui/icons-material/Chat";
// import CloseIcon from "@mui/icons-material/Close";
// import InputAdornment from "@mui/material/InputAdornment";
// import SendIcon from "@mui/icons-material/Send";
// import SendRoundedIcon from "@mui/icons-material/SendRounded";

// import { io } from "socket.io-client";

// import "../style/videoComponent.css";

// const server_url = "http://localhost:8000";

// const peerConfigConnections = {
//     iceServers: [
//         {
//             urls: "stun:stun.l.google.com:19302",
//         },
//     ],
// };

// export default function VideoMeet() {

//     // =========================
//     // REFS
//     // =========================

//     const socketRef = useRef(null);
//     const socketIdRef = useRef(null);

//     const localVideoRef = useRef(null);

//     const localStreamRef = useRef(null);

//     const connectionsRef = useRef({});


//     // =========================
//     // STATES
//     // =========================

//     const [username, setUsername] = useState("");
//     const [askForUsername, setAskForUsername] = useState(true);

//     const [videos, setVideos] = useState([]);

//     const [videoAvailable, setVideoAvailable] =
//         useState(true);

//     const [audioAvailable, setAudioAvailable] =
//         useState(true);

//     const [video, setVideo] = useState(false);
//     const [audio, setAudio] = useState(false);

//     const [screenAvailable, setScreenAvailable] =
//         useState(false);

//     const [screen, setScreen] = useState(false);

//     const [newMessage,setNewMessage] = useState(3);
//     const [showModel , setShowModel] = useState(true);
//     const [message,setMessage] = useState("");
//     const [messages,setMessages] = useState([]);




//     // =========================
//     // CHECK SCREEN SHARE
//     // =========================

//     useEffect(() => {

//         if (
//             navigator.mediaDevices &&
//             navigator.mediaDevices.getDisplayMedia
//         ) {
//             setScreenAvailable(true);
//         }

//     }, []);


//     // =========================
//     // GET CAMERA + MICROPHONE
//     // =========================

//     const getMedia = async () => {

//         try {

//             const stream =
//                 await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true,
//                 });

//             localStreamRef.current = stream;

//             setVideo(true);
//             setAudio(true);

//             if (localVideoRef.current) {

//                 localVideoRef.current.srcObject =
//                     stream;

//             }

//             console.log(
//                 "Camera and microphone started"
//             );

//             return stream;

//         } catch (error) {

//             console.error(
//                 "Camera/Microphone error:",
//                 error
//             );

//             setVideoAvailable(false);
//             setAudioAvailable(false);

//             alert(
//                 "Camera or microphone permission denied."
//             );

//             return null;
//         }
//     };


//     // =========================
//     // ATTACH LOCAL VIDEO
//     // =========================

//     useEffect(() => {

//         if (
//             !askForUsername &&
//             localVideoRef.current &&
//             localStreamRef.current
//         ) {

//             localVideoRef.current.srcObject =
//                 localStreamRef.current;

//             localVideoRef.current
//                 .play()
//                 .catch((error) => {
//                     console.log(
//                         "Video play error:",
//                         error
//                     );
//                 });
//         }

//     }, [askForUsername]);


//     // =========================
//     // HANDLE SIGNAL
//     // =========================

//     const gotMessageFromServer = async (
//         fromId,
//         message
//     ) => {

//         try {

//             const signal = JSON.parse(message);

//             const peer =
//                 connectionsRef.current[fromId];

//             if (!peer) {
//                 return;
//             }


//             // =========================
//             // SDP
//             // =========================

//             if (signal.sdp) {

//                 await peer.setRemoteDescription(
//                     new RTCSessionDescription(
//                         signal.sdp
//                     )
//                 );

//                 if (
//                     signal.sdp.type === "offer"
//                 ) {

//                     const answer =
//                         await peer.createAnswer();

//                     await peer.setLocalDescription(
//                         answer
//                     );

//                     socketRef.current.emit(
//                         "signal",
//                         fromId,
//                         JSON.stringify({
//                             sdp:
//                                 peer.localDescription,
//                         })
//                     );
//                 }
//             }


//             // =========================
//             // ICE
//             // =========================

//             if (signal.ice) {

//                 try {

//                     await peer.addIceCandidate(
//                         new RTCIceCandidate(
//                             signal.ice
//                         )
//                     );

//                 } catch (error) {

//                     console.log(
//                         "ICE candidate error:",
//                         error
//                     );
//                 }
//             }

//         } catch (error) {

//             console.log(
//                 "Signal handling error:",
//                 error
//             );
//         }
//     };


//     // =========================
//     // CREATE PEER CONNECTION
//     // =========================

//     const createPeerConnection = (
//         socketListId
//     ) => {

//         const peer =
//             new RTCPeerConnection(
//                 peerConfigConnections
//             );

//         connectionsRef.current[
//             socketListId
//         ] = peer;


//         // =========================
//         // ICE CANDIDATE
//         // =========================

//         peer.onicecandidate = (event) => {

//             if (
//                 event.candidate &&
//                 socketRef.current
//             ) {

//                 socketRef.current.emit(
//                     "signal",
//                     socketListId,
//                     JSON.stringify({
//                         ice: event.candidate,
//                     })
//                 );
//             }
//         };


//         // =========================
//         // REMOTE STREAM
//         // =========================

//         peer.ontrack = (event) => {

//             const remoteStream =
//                 event.streams[0];

//             if (!remoteStream) {
//                 return;
//             }

//             setVideos((oldVideos) => {

//                 const exists =
//                     oldVideos.find(
//                         (item) =>
//                             item.socketId ===
//                             socketListId
//                     );

//                 if (exists) {

//                     return oldVideos.map(
//                         (item) =>
//                             item.socketId ===
//                             socketListId
//                                 ? {
//                                       ...item,
//                                       stream:
//                                           remoteStream,
//                                   }
//                                 : item
//                     );
//                 }

//                 return [
//                     ...oldVideos,
//                     {
//                         socketId:
//                             socketListId,
//                         stream:
//                             remoteStream,
//                     },
//                 ];
//             });
//         };


//         // =========================
//         // CONNECTION STATE
//         // =========================

//         peer.onconnectionstatechange = () => {

//             console.log(
//                 "Connection:",
//                 socketListId,
//                 peer.connectionState
//             );

//             if (
//                 peer.connectionState ===
//                     "failed" ||
//                 peer.connectionState ===
//                     "closed" ||
//                 peer.connectionState ===
//                     "disconnected"
//             ) {

//                 peer.close();

//                 delete connectionsRef.current[
//                     socketListId
//                 ];

//                 setVideos((oldVideos) =>
//                     oldVideos.filter(
//                         (video) =>
//                             video.socketId !==
//                             socketListId
//                     )
//                 );
//             }
//         };


//         // =========================
//         // ADD LOCAL TRACKS
//         // =========================

//         if (localStreamRef.current) {

//             localStreamRef.current
//                 .getTracks()
//                 .forEach((track) => {

//                     peer.addTrack(
//                         track,
//                         localStreamRef.current
//                     );

//                 });
//         }

//         return peer;
//     };


//     // =========================
//     // CREATE OFFER
//     // =========================

//     const createOffer = async (
//         socketListId
//     ) => {

//         try {

//             const peer =
//                 connectionsRef.current[
//                     socketListId
//                 ];

//             if (!peer) {
//                 return;
//             }

//             const offer =
//                 await peer.createOffer();

//             await peer.setLocalDescription(
//                 offer
//             );

//             socketRef.current.emit(
//                 "signal",
//                 socketListId,
//                 JSON.stringify({
//                     sdp:
//                         peer.localDescription,
//                 })
//             );

//         } catch (error) {

//             console.log(
//                 "Offer error:",
//                 error
//             );
//         }
//     };


//     // =========================
//     // CONNECT TO SOCKET SERVER
//     // =========================

//     const connect = async () => {

//         if (!username.trim()) {

//             alert(
//                 "Please enter your username"
//             );

//             return;
//         }


//         // Start camera + microphone

//         const stream =
//             await getMedia();

//         if (!stream) {
//             return;
//         }


//         // Connect socket

//         socketRef.current = io(
//             server_url,
//             {
//                 transports: [
//                     "websocket",
//                     "polling",
//                 ],
//             }
//         );


//         // Signal

//         socketRef.current.on(
//             "signal",
//             gotMessageFromServer
//         );


//         // Socket connected

//         socketRef.current.on(
//             "connect",
//             () => {

//                 console.log(
//                     "Socket connected:",
//                     socketRef.current.id
//                 );

//                 socketIdRef.current =
//                     socketRef.current.id;

//                 socketRef.current.emit(
//                     "join-call",
//                     window.location.href
//                 );
//             }
//         );


//         // =========================
//         // USER JOINED
//         // =========================

//         socketRef.current.on(
//             "user-joined",
//             (
//                 id,
//                 clients
//             ) => {

//                 console.log(
//                     "User joined:",
//                     id,
//                     clients
//                 );


//                 // Create connections
//                 // for existing users

//                 clients.forEach(
//                     (socketListId) => {

//                         if (
//                             socketListId ===
//                             socketIdRef.current
//                         ) {
//                             return;
//                         }

//                         if (
//                             !connectionsRef.current[
//                                 socketListId
//                             ]
//                         ) {

//                             createPeerConnection(
//                                 socketListId
//                             );
//                         }
//                     }
//                 );


//                 // New user creates offers

//                 if (
//                     id ===
//                     socketIdRef.current
//                 ) {

//                     clients.forEach(
//                         (socketListId) => {

//                             if (
//                                 socketListId ===
//                                 socketIdRef.current
//                             ) {
//                                 return;
//                             }

//                             createOffer(
//                                 socketListId
//                             );
//                         }
//                     );
//                 }
//             }
//         );


//         // =========================
//         // USER LEFT
//         // =========================

//         socketRef.current.on(
//             "user-left",
//             (id) => {

//                 console.log(
//                     "User left:",
//                     id
//                 );

//                 const peer =
//                     connectionsRef.current[
//                         id
//                     ];

//                 if (peer) {

//                     peer.close();

//                     delete connectionsRef.current[
//                         id
//                     ];
//                 }

//                 setVideos(
//                     (oldVideos) =>
//                         oldVideos.filter(
//                             (video) =>
//                                 video.socketId !==
//                                 id
//                         )
//                 );
//             }
//         );


//         setAskForUsername(false);
//     };


//     // =========================
//     // VIDEO ENABLE / DISABLE
//     // =========================

//     const toggleVideo = () => {

//         if (!localStreamRef.current) {
//             return;
//         }

//         const videoTrack =
//             localStreamRef.current
//                 .getVideoTracks()[0];

//         if (videoTrack) {

//             videoTrack.enabled =
//                 !videoTrack.enabled;

//             setVideo(
//                 videoTrack.enabled
//             );
//         }
//     };


//     // =========================
//     // AUDIO ENABLE / DISABLE
//     // =========================

//     const toggleAudio = () => {

//         if (!localStreamRef.current) {
//             return;
//         }

//         const audioTrack =
//             localStreamRef.current
//                 .getAudioTracks()[0];

//         if (audioTrack) {

//             audioTrack.enabled =
//                 !audioTrack.enabled;

//             setAudio(
//                 audioTrack.enabled
//             );
//         }
//     };


//     // =========================
//     // START SCREEN SHARE
//     // =========================

//     const startScreenShare = async () => {

//         try {

//             const screenStream =
//                 await navigator.mediaDevices
//                     .getDisplayMedia({
//                         video: true,
//                         audio:true
//                     });

//             const screenTrack =
//                 screenStream.getVideoTracks()[0];

//             if (!screenTrack) {
//                 return;
//             }


//             // Replace camera track
//             // with screen track

//             Object.values(
//                 connectionsRef.current
//             ).forEach((peer) => {

//                 const sender =
//                     peer
//                         .getSenders()
//                         .find(
//                             (sender) =>
//                                 sender.track &&
//                                 sender.track.kind ===
//                                     "video"
//                         );

//                 if (sender) {

//                     sender.replaceTrack(
//                         screenTrack
//                     );
//                 }
//             });


//             // Show screen locally

//             if (localVideoRef.current) {

//                 localVideoRef.current.srcObject =
//                     screenStream;
//             }

//             setScreen(true);


//             // User stops sharing
//             // using browser button

//             screenTrack.onended = () => {

//                 stopScreenShare(
//                     screenStream
//                 );
//             };

//         } catch (error) {

//             console.log(
//                 "Screen share error:",
//                 error
//             );
//         }
//     };


//     // =========================
//     // STOP SCREEN SHARE
//     // =========================

//     const stopScreenShare = async (
//         screenStream = null
//     ) => {

//         const cameraStream =
//             localStreamRef.current;

//         if (!cameraStream) {
//             return;
//         }

//         const cameraTrack =
//             cameraStream.getVideoTracks()[0];


//         // Replace screen track
//         // with camera track

//         Object.values(
//             connectionsRef.current
//         ).forEach((peer) => {

//             const sender =
//                 peer
//                     .getSenders()
//                     .find(
//                         (sender) =>
//                             sender.track &&
//                             sender.track.kind ===
//                                 "video"
//                     );

//             if (
//                 sender &&
//                 cameraTrack
//             ) {

//                 sender.replaceTrack(
//                     cameraTrack
//                 );
//             }
//         });


//         // Stop screen tracks

//         if (screenStream) {

//             screenStream
//                 .getTracks()
//                 .forEach((track) =>
//                     track.stop()
//                 );
//         }


//         // Show camera again

//         if (localVideoRef.current) {

//             localVideoRef.current.srcObject =
//                 cameraStream;
//         }

//         setScreen(false);
//     };


//     // =========================
//     // TOGGLE SCREEN SHARE
//     // =========================

//     const toggleScreenShare = () => {

//         if (screen) {

//             stopScreenShare();

//         } else {

//             startScreenShare();
//         }
//     };

//     //TODO addMessage
//     const addMessage = (data, sender, socketIdSender) => {
//     setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//             sender: sender,
//             data: data
//         }
//     ]);

//     if (socketIdSender !== socketIdRef.current) {
//         setNewMessage((prev) => prev + 1);
//     }
// };


//     // =========================
//     // LEAVE CALL
//     // =========================

//     const leaveCall = () => {

//         // Stop screen sharing

//         if (screen) {
//             stopScreenShare();
//         }


//         // Disconnect socket

//         if (socketRef.current) {

//             socketRef.current.disconnect();

//             socketRef.current = null;
//         }


//         // Close peer connections

//         Object.values(
//             connectionsRef.current
//         ).forEach((peer) => {

//             peer.close();
//         });

//         connectionsRef.current = {};


//         // Stop local stream

//         if (localStreamRef.current) {

//             localStreamRef.current
//                 .getTracks()
//                 .forEach((track) =>
//                     track.stop()
//                 );

//             localStreamRef.current = null;
//         }


//         // Reset state

//         setVideos([]);

//         setVideo(false);
//         setAudio(false);
//         setScreen(false);

//         setAskForUsername(true);
//     };


//     //handle chat here
//     let handleChat = ()=>{
//         setShowModel(prev => !prev);
        

//     }


//     //send message
//     const sendMessage = () => {
//     if (!message.trim()) return;

//     // Chat window mein immediately show karo
//     setMessages((prev) => [
//         ...prev,
//         {
//             sender: username,
//             data: message
//         }
//     ]);

//     // Server ko message bhejo
//     socketRef.current.emit("chat-message", message, username);

//     // Input clear
//     setMessage("");
// };

//     // =========================
//     // CLEANUP
//     // =========================

//     useEffect(() => {

//         return () => {

//             if (socketRef.current) {

//                 socketRef.current.disconnect();
//             }


//             Object.values(
//                 connectionsRef.current
//             ).forEach((peer) => {

//                 peer.close();
//             });


//             connectionsRef.current = {};


//             if (localStreamRef.current) {

//                 localStreamRef.current
//                     .getTracks()
//                     .forEach((track) =>
//                         track.stop()
//                     );

//                 localStreamRef.current = null;
//             }
//         };

//     }, []);


//     // =========================
//     // UI
//     // =========================

//     return (

//         <div className="videoMeetContainer">


//             {/* =========================
//                 LOBBY
//             ========================= */}

//             {askForUsername ? (

//                 <div className="lobbyContainer">

//                     <h1>
//                         Enter into lobby
//                     </h1>


//                     <TextField
//                         label="Username"
//                         variant="outlined"
//                         value={username}
//                         onChange={(e) =>
//                             setUsername(
//                                 e.target.value
//                             )
//                         }
//                     />


//                     <Button
//                         variant="contained"
//                         onClick={connect}
//                     >
//                         Join Meeting
//                     </Button>


//                     <div className="localVideoContainer">

//                         <video
//                             ref={localVideoRef}
//                             autoPlay
//                             muted
//                             playsInline
//                         />

//                     </div>

//                 </div>

//             ) : (


//                 /* =========================
//                    MEETING
//                 ========================= */

//                 <div className="meetVideoContainer">

//                     {/* {
//                         showModel ? 
//                         <div className="chatRoom">
                            
//                             <div className="chatContainer">
//                                 <h1>Chat</h1>
//                                 <div className="chattingArea">
//                                     <TextField
//                                     label="Chat with your loved Ones..."
//                                     variant="outlined"
//                                     />
//                                     <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage}>Send</Button>
//                                 </div>
                                

//                             </div>

//                         </div> : 
//                         null
//                     } */}

//                     {
//                         showModel ? 
//                             <div>
//                                 <div className="chatRoom">
//                                     <div className="chatContainer">

//                                         {/* Header */}
//                                         <div className="chatHeader">
//                                             <h2>Chat</h2>
//                                         </div>
//                                         <div className="chattingDisplay">
//                                             {
//                                                 messages
//                                                     ? messages.map((item, index) => {
//                                                         return (
//                                                             <div key={index} style={{ marginBottom: "20px" }}>
//                                                                 <p style={{ fontWeight: "bold" }}>
//                                                                     {item.sender}
//                                                                 </p>

//                                                                 <p>
//                                                                     {item.data}
//                                                                 </p>
//                                                             </div>
//                                                         );
//                                                     })
//                                                     : null
//                                             }
//                                         </div>

//                                             {/* Messages */}
//                                         <div className="messagesArea">
//                                             {/* Messages yahan render honge */}
//                                         </div>

//                                         {/* Input */}
//                                         <div className="chattingArea">
//                                             <div className="chattingArea">
                                               
//                                                 <TextField
//                                                     fullWidth
//                                                     onKeyDown={(e) => {
//                                                         if (e.key === "Enter") {
//                                                             sendMessage();
//                                                         }
//                                                     }}

//                                                     value={message} onChange={e =>setMessage(e.target.value)}
//                                                     size="small"
//                                                     placeholder="Type a message..."
//                                                     variant="outlined"
                                                    
//                                                     slotProps={{
//                                                         input: {
//                                                         endAdornment: (
//                                                             <InputAdornment position="end">
                                                             
//                                                             <IconButton
//                                                                 onClick={sendMessage}
//                                                                 sx={{
//                                                                 color: "#0095F6",
//                                                                 padding: "6px",
//                                                                 }}
//                                                             >
//                                                                 <SendRoundedIcon />
//                                                             </IconButton>
                                                            
//                                                             </InputAdornment>
//                                                         ),
//                                                         },
//                                                     }}
                                                    
//                                                 />
//                                             </div>

                                            
//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>
//                             :
//                             null
//                     }

                    

                    


//                     {/* =========================
//                         LOCAL VIDEO
//                     ========================= */}

//                     <video
//                         className="meetUserVideo"
//                         ref={localVideoRef}
//                         autoPlay
//                         muted
//                         playsInline
//                     />


//                     {/* =========================
//                         BUTTONS
//                     ========================= */}

//                     <div className="buttonContainers">


//                         {/* CAMERA */}

//                         {videoAvailable && (

//                             <IconButton
//                                 style={{
//                                     color: "white",
//                                 }}
//                                 onClick={
//                                     toggleVideo
//                                 }
//                             >

//                                 {video ? (
//                                     <VideocamIcon />
//                                 ) : (
//                                     <VideocamOffIcon />
//                                 )}

//                             </IconButton>

//                         )}


//                         {/* MICROPHONE */}

//                         {audioAvailable && (

//                             <IconButton
//                                 style={{
//                                     color: "white",
//                                 }}
//                                 onClick={
//                                     toggleAudio
//                                 }
//                             >

//                                 {audio ? (
//                                     <MicIcon />
//                                 ) : (
//                                     <MicOffIcon />
//                                 )}

//                             </IconButton>

//                         )}




                        


//                         {/* SCREEN SHARE */}

//                         {screenAvailable && (

//                             <IconButton
//                                 style={{
//                                     color: "white",
//                                 }}
//                                 onClick={
//                                     toggleScreenShare
//                                 }
//                             >

//                                 {screen ? (
//                                     <ScreenShareIcon />
//                                 ) : (
                                    
//                                     <StopScreenShareIcon />
//                                 )}

//                             </IconButton>

//                         )}


//                         <Badge badgeContent={newMessage} max={999} color="secondary" >
//                             <IconButton style={{color:"white"} } onClick={handleChat}>
//                                 {
//                                     showModel ?
//                                     <ChatIcon /> :
//                                     <CloseIcon/>


//                                 }
                                

//                             </IconButton>
                            


//                         </Badge>


//                         {/* CALL END */}

//                         <IconButton
//                             style={{
//                                 color: "red",
//                             }}
//                             onClick={leaveCall}
//                         >

//                             <CallEndIcon />

//                         </IconButton>

//                     </div>


//                     {/* =========================
//                         REMOTE VIDEOS
//                     ========================= */}

//                     <div className="conferenceView">

//                         {videos.map(
//                             (item) => (

//                                 <div
                                    
//                                     key={
//                                         item.socketId
//                                     }
//                                 >

                                    


//                                     <video
//                                         autoPlay
//                                         playsInline
//                                         ref={(
//                                             videoElement
//                                         ) => {

//                                             if (
//                                                 videoElement &&
//                                                 item.stream
//                                             ) {

//                                                 videoElement.srcObject =
//                                                     item.stream;
//                                             }
//                                         }}
//                                     />

//                                 </div>

//                             )
//                         )}

//                     </div>

//                 </div>
//             )}

//         </div>
//     );
// }

import React, { useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import InputAdornment from "@mui/material/InputAdornment";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { io } from "socket.io-client";

import "../style/videoComponent.css";

const server_url = "http://localhost:8000";

const peerConfigConnections = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

export default function VideoMeet() {

    // =========================================
    // REFS
    // =========================================

    const socketRef = useRef(null);

    const socketIdRef = useRef(null);

    const localVideoRef = useRef(null);

    const localStreamRef = useRef(null);

    const connectionsRef = useRef({});


    // =========================================
    // STATES
    // =========================================

    const [username, setUsername] = useState("");

    const [askForUsername, setAskForUsername] =
        useState(true);

    const [videos, setVideos] = useState([]);

    const [videoAvailable, setVideoAvailable] =
        useState(true);

    const [audioAvailable, setAudioAvailable] =
        useState(true);

    const [video, setVideo] = useState(false);

    const [audio, setAudio] = useState(false);

    const [screenAvailable, setScreenAvailable] =
        useState(false);

    const [screen, setScreen] = useState(false);


    // =========================================
    // CHAT STATES
    // =========================================

    // Input box ka current message
    const [message, setMessage] = useState("");

    // Saare chat messages
    const [messages, setMessages] = useState([]);

    // Unread messages
    const [newMessage, setNewMessage] = useState(0);

    // Chat open/close
    const [showModel, setShowModel] = useState(true);


    // =========================================
    // CHECK SCREEN SHARE
    // =========================================

    useEffect(() => {

        if (
            navigator.mediaDevices &&
            navigator.mediaDevices.getDisplayMedia
        ) {
            setScreenAvailable(true);
        }

    }, []);


    // =========================================
    // GET CAMERA + MICROPHONE
    // =========================================

    const getMedia = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

            localStreamRef.current = stream;

            setVideo(true);
            setAudio(true);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            console.log(
                "Camera and microphone started"
            );

            return stream;

        } catch (error) {

            console.error(
                "Camera/Microphone error:",
                error
            );

            setVideoAvailable(false);
            setAudioAvailable(false);

            alert(
                "Camera or microphone permission denied."
            );

            return null;
        }
    };


    // =========================================
    // ATTACH LOCAL VIDEO
    // =========================================

    useEffect(() => {

        if (
            !askForUsername &&
            localVideoRef.current &&
            localStreamRef.current
        ) {

            localVideoRef.current.srcObject =
                localStreamRef.current;

            localVideoRef.current
                .play()
                .catch((error) => {
                    console.log(
                        "Video play error:",
                        error
                    );
                });
        }

    }, [askForUsername]);


    // =========================================
    // HANDLE WEBRTC SIGNAL
    // =========================================

    const gotMessageFromServer = async (
        fromId,
        message
    ) => {

        try {

            const signal = JSON.parse(message);

            const peer =
                connectionsRef.current[fromId];

            if (!peer) {
                return;
            }


            // =========================
            // SDP
            // =========================

            if (signal.sdp) {

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        signal.sdp
                    )
                );

                if (
                    signal.sdp.type === "offer"
                ) {

                    const answer =
                        await peer.createAnswer();

                    await peer.setLocalDescription(
                        answer
                    );

                    socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                            sdp:
                                peer.localDescription,
                        })
                    );
                }
            }


            // =========================
            // ICE
            // =========================

            if (signal.ice) {

                try {

                    await peer.addIceCandidate(
                        new RTCIceCandidate(
                            signal.ice
                        )
                    );

                } catch (error) {

                    console.log(
                        "ICE candidate error:",
                        error
                    );
                }
            }

        } catch (error) {

            console.log(
                "Signal handling error:",
                error
            );
        }
    };


    // =========================================
    // CREATE PEER CONNECTION
    // =========================================

    const createPeerConnection = (
        socketListId
    ) => {

        const peer =
            new RTCPeerConnection(
                peerConfigConnections
            );

        connectionsRef.current[
            socketListId
        ] = peer;


        // =========================
        // ICE CANDIDATE
        // =========================

        peer.onicecandidate = (event) => {

            if (
                event.candidate &&
                socketRef.current
            ) {

                socketRef.current.emit(
                    "signal",
                    socketListId,
                    JSON.stringify({
                        ice: event.candidate,
                    })
                );
            }
        };


        // =========================
        // REMOTE STREAM
        // =========================

        peer.ontrack = (event) => {

            const remoteStream =
                event.streams[0];

            if (!remoteStream) {
                return;
            }

            setVideos((oldVideos) => {

                const exists =
                    oldVideos.find(
                        (item) =>
                            item.socketId ===
                            socketListId
                    );

                if (exists) {

                    return oldVideos.map(
                        (item) =>
                            item.socketId ===
                            socketListId
                                ? {
                                      ...item,
                                      stream:
                                          remoteStream,
                                  }
                                : item
                    );
                }

                return [
                    ...oldVideos,
                    {
                        socketId:
                            socketListId,
                        stream:
                            remoteStream,
                    },
                ];
            });
        };


        // =========================
        // CONNECTION STATE
        // =========================

        peer.onconnectionstatechange = () => {

            console.log(
                "Connection:",
                socketListId,
                peer.connectionState
            );

            if (
                peer.connectionState === "failed" ||
                peer.connectionState === "closed" ||
                peer.connectionState === "disconnected"
            ) {

                peer.close();

                delete connectionsRef.current[
                    socketListId
                ];

                setVideos((oldVideos) =>
                    oldVideos.filter(
                        (video) =>
                            video.socketId !==
                            socketListId
                    )
                );
            }
        };


        // =========================
        // ADD LOCAL TRACKS
        // =========================

        if (localStreamRef.current) {

            localStreamRef.current
                .getTracks()
                .forEach((track) => {

                    peer.addTrack(
                        track,
                        localStreamRef.current
                    );

                });
        }

        return peer;
    };


    // =========================================
    // CREATE OFFER
    // =========================================

    const createOffer = async (
        socketListId
    ) => {

        try {

            const peer =
                connectionsRef.current[
                    socketListId
                ];

            if (!peer) {
                return;
            }

            const offer =
                await peer.createOffer();

            await peer.setLocalDescription(
                offer
            );

            socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({
                    sdp:
                        peer.localDescription,
                })
            );

        } catch (error) {

            console.log(
                "Offer error:",
                error
            );
        }
    };


    // =========================================
    // RECEIVE CHAT MESSAGE
    // =========================================

    const addMessage = (
        data,
        sender,
        socketIdSender
    ) => {

        console.log(
            "Chat message received:",
            data,
            sender,
            socketIdSender
        );

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: sender,
                data: data,
                socketId: socketIdSender,
            },
        ]);

        // Agar message kisi doosre user ne bheja hai
        if (
            socketIdSender !==
            socketIdRef.current
        ) {

            setNewMessage(
                (prev) => prev + 1
            );
        }
    };


    // =========================================
    // CONNECT TO SERVER
    // =========================================

    const connect = async () => {

        if (!username.trim()) {

            alert(
                "Please enter your username"
            );

            return;
        }


        // =========================
        // START CAMERA
        // =========================

        const stream =
            await getMedia();

        if (!stream) {
            return;
        }


        // =========================
        // CONNECT SOCKET
        // =========================

        socketRef.current = io(
            server_url,
            {
                transports: [
                    "websocket",
                    "polling",
                ],
            }
        );


        // =========================
        // WEBRTC SIGNAL
        // =========================

        socketRef.current.on(
            "signal",
            gotMessageFromServer
        );


        // =========================
        // CHAT MESSAGE
        // =========================

        socketRef.current.on(
            "chat-message",
            addMessage
        );


        // =========================
        // SOCKET CONNECTED
        // =========================

        socketRef.current.on(
            "connect",
            () => {

                console.log(
                    "Socket connected:",
                    socketRef.current.id
                );

                socketIdRef.current =
                    socketRef.current.id;


                // Join meeting
                socketRef.current.emit(
                    "join-call",
                    window.location.href
                );
            }
        );


        // =========================
        // USER JOINED
        // =========================

        socketRef.current.on(
            "user-joined",
            (
                id,
                clients
            ) => {

                console.log(
                    "User joined:",
                    id,
                    clients
                );


                // Create peer connection
                // for every other user

                clients.forEach(
                    (socketListId) => {

                        if (
                            socketListId ===
                            socketIdRef.current
                        ) {
                            return;
                        }

                        if (
                            !connectionsRef.current[
                                socketListId
                            ]
                        ) {

                            createPeerConnection(
                                socketListId
                            );
                        }
                    }
                );


                // New user creates offers

                if (
                    id ===
                    socketIdRef.current
                ) {

                    clients.forEach(
                        (socketListId) => {

                            if (
                                socketListId ===
                                socketIdRef.current
                            ) {
                                return;
                            }

                            createOffer(
                                socketListId
                            );
                        }
                    );
                }
            }
        );


        // =========================
        // USER LEFT
        // =========================

        socketRef.current.on(
            "user-left",
            (id) => {

                console.log(
                    "User left:",
                    id
                );

                const peer =
                    connectionsRef.current[
                        id
                    ];

                if (peer) {

                    peer.close();

                    delete connectionsRef.current[
                        id
                    ];
                }

                setVideos(
                    (oldVideos) =>
                        oldVideos.filter(
                            (video) =>
                                video.socketId !==
                                id
                        )
                );
            }
        );


        // =========================
        // ENTER MEETING
        // =========================

        setAskForUsername(false);
    };


    // =========================================
    // SEND CHAT MESSAGE
    // =========================================

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        if (
            !socketRef.current ||
            !socketRef.current.connected
        ) {

            console.log(
                "Socket is not connected"
            );

            return;
        }


        console.log(
            "Sending message:",
            message
        );


        // IMPORTANT:
        // Don't setMessages here.
        //
        // Server will send the message
        // back to all users including sender.
        //
        // addMessage() will update messages.

        socketRef.current.emit(
            "chat-message",
            message,
            username,
            socketIdRef.current
        );


        // Clear input
        setMessage("");
    };


    // =========================================
    // TOGGLE CHAT
    // =========================================

    const handleChat = () => {

        setShowModel(
            (prev) => !prev
        );

        // Chat open hone par
        // unread count clear kar do

        if (!showModel) {
            setNewMessage(0);
        }
    };


    // =========================================
    // VIDEO ON/OFF
    // =========================================

    const toggleVideo = () => {

        if (!localStreamRef.current) {
            return;
        }

        const videoTrack =
            localStreamRef.current
                .getVideoTracks()[0];

        if (videoTrack) {

            videoTrack.enabled =
                !videoTrack.enabled;

            setVideo(
                videoTrack.enabled
            );
        }
    };


    // =========================================
    // AUDIO ON/OFF
    // =========================================

    const toggleAudio = () => {

        if (!localStreamRef.current) {
            return;
        }

        const audioTrack =
            localStreamRef.current
                .getAudioTracks()[0];

        if (audioTrack) {

            audioTrack.enabled =
                !audioTrack.enabled;

            setAudio(
                audioTrack.enabled
            );
        }
    };


    // =========================================
    // START SCREEN SHARE
    // =========================================

    const startScreenShare = async () => {

        try {

            const screenStream =
                await navigator.mediaDevices
                    .getDisplayMedia({
                        video: true,
                        audio: true,
                    });

            const screenTrack =
                screenStream.getVideoTracks()[0];

            if (!screenTrack) {
                return;
            }


            // Replace camera track

            Object.values(
                connectionsRef.current
            ).forEach((peer) => {

                const sender =
                    peer
                        .getSenders()
                        .find(
                            (sender) =>
                                sender.track &&
                                sender.track.kind ===
                                    "video"
                        );

                if (sender) {

                    sender.replaceTrack(
                        screenTrack
                    );
                }
            });


            // Show screen locally

            if (localVideoRef.current) {

                localVideoRef.current.srcObject =
                    screenStream;
            }

            setScreen(true);


            // Browser stop sharing

            screenTrack.onended = () => {

                stopScreenShare(
                    screenStream
                );
            };

        } catch (error) {

            console.log(
                "Screen share error:",
                error
            );
        }
    };


    // =========================================
    // STOP SCREEN SHARE
    // =========================================

    const stopScreenShare = (
        screenStream = null
    ) => {

        const cameraStream =
            localStreamRef.current;

        if (!cameraStream) {
            return;
        }

        const cameraTrack =
            cameraStream.getVideoTracks()[0];


        // Replace screen with camera

        Object.values(
            connectionsRef.current
        ).forEach((peer) => {

            const sender =
                peer
                    .getSenders()
                    .find(
                        (sender) =>
                            sender.track &&
                            sender.track.kind ===
                                "video"
                    );

            if (
                sender &&
                cameraTrack
            ) {

                sender.replaceTrack(
                    cameraTrack
                );
            }
        });


        // Stop screen stream

        if (screenStream) {

            screenStream
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );
        }


        // Show camera again

        if (localVideoRef.current) {

            localVideoRef.current.srcObject =
                cameraStream;
        }

        setScreen(false);
    };


    // =========================================
    // TOGGLE SCREEN SHARE
    // =========================================

    const toggleScreenShare = () => {

        if (screen) {

            stopScreenShare();

        } else {

            startScreenShare();
        }
    };


    // =========================================
    // LEAVE CALL
    // =========================================

    const leaveCall = () => {

        // Stop screen

        if (screen) {
            stopScreenShare();
        }


        // Disconnect socket

        if (socketRef.current) {

            socketRef.current.disconnect();

            socketRef.current = null;
        }


        // Close peer connections

        Object.values(
            connectionsRef.current
        ).forEach((peer) => {

            peer.close();
        });

        connectionsRef.current = {};


        // Stop camera/mic

        if (localStreamRef.current) {

            localStreamRef.current
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );

            localStreamRef.current = null;
        }


        // Reset

        setVideos([]);

        setMessages([]);

        setMessage("");

        setVideo(false);

        setAudio(false);

        setScreen(false);

        setNewMessage(0);

        setAskForUsername(true);
    };


    // =========================================
    // CLEANUP
    // =========================================

    useEffect(() => {

        return () => {

            if (socketRef.current) {

                socketRef.current.disconnect();
            }


            Object.values(
                connectionsRef.current
            ).forEach((peer) => {

                peer.close();
            });


            connectionsRef.current = {};


            if (localStreamRef.current) {

                localStreamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );

                localStreamRef.current = null;
            }
        };

    }, []);


    // =========================================
    // UI
    // =========================================

    return (

        <div className="videoMeetContainer">


            {/* =================================
                LOBBY
            ================================= */}

            {askForUsername ? (

                <div className="lobbyContainer">

                    <h1>
                        Enter into lobby
                    </h1>


                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />


                    <Button
                        variant="contained"
                        onClick={connect}
                    >
                        Join Meeting
                    </Button>


                    <div className="localVideoContainer">

                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                        />

                    </div>

                </div>

            ) : (


                /* =================================
                    MEETING
                ================================= */

                <div className="meetVideoContainer">


                    {/* =================================
                        CHAT
                    ================================= */}

                    {showModel && (

                        <div className="chatRoom">

                            <div className="chatContainer">


                                {/* HEADER */}

                                <div className="chatHeader">

                                    <h2>
                                        Chat
                                    </h2>

                                </div>


                                {/* =================================
                                    CHAT MESSAGES
                                ================================= */}

                                <div className="chattingDisplay">

                                    {messages.map(
                                        (item, index) => (

                                            <div
                                                key={index}
                                                style={{
                                                    marginBottom:
                                                        "15px",
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        fontWeight:
                                                            "bold",
                                                        margin:
                                                            "0 0 4px 0",
                                                    }}
                                                >
                                                    {item.sender}
                                                </p>


                                                <p
                                                    style={{
                                                        margin:
                                                            "0",
                                                    }}
                                                >
                                                    {item.data}
                                                </p>

                                            </div>
                                        )
                                    )}

                                </div>


                                {/* =================================
                                    INPUT
                                ================================= */}

                                <div className="chattingArea">

                                    <TextField
                                                    fullWidth
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            sendMessage();
                                                        }
                                                    }}

                                                    value={message} onChange={e =>setMessage(e.target.value)}
                                                    size="small"
                                                    placeholder="Type a message..."
                                                    variant="outlined"
                                                    
                                                    slotProps={{
                                                        input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                             
                                                            <IconButton
                                                                onClick={sendMessage}
                                                                sx={{
                                                                color: "#0095F6",
                                                                padding: "6px",
                                                                }}
                                                            >
                                                                <SendRoundedIcon />
                                                            </IconButton>
                                                            
                                                            </InputAdornment>
                                                        ),
                                                        },
                                                    }}
                                                    
                                                />
                                </div>

                            </div>

                        </div>
                    )}


                    {/* =================================
                        LOCAL VIDEO
                    ================================= */}

                    <video
                        className="meetUserVideo"
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                    />


                    {/* =================================
                        CONTROLS
                    ================================= */}

                    <div className="buttonContainers">


                        {/* CAMERA */}

                        {videoAvailable && (

                            <IconButton
                                style={{
                                    color: "white",
                                }}
                                onClick={
                                    toggleVideo
                                }
                            >

                                {video ? (
                                    <VideocamIcon />
                                ) : (
                                    <VideocamOffIcon />
                                )}

                            </IconButton>
                        )}


                        {/* MICROPHONE */}

                        {audioAvailable && (

                            <IconButton
                                style={{
                                    color: "white",
                                }}
                                onClick={
                                    toggleAudio
                                }
                            >

                                {audio ? (
                                    <MicIcon />
                                ) : (
                                    <MicOffIcon />
                                )}

                            </IconButton>
                        )}


                        {/* SCREEN SHARE */}

                        {screenAvailable && (

                            <IconButton
                                style={{
                                    color: "white",
                                }}
                                onClick={
                                    toggleScreenShare
                                }
                            >

                                {screen ? (
                                    <StopScreenShareIcon />
                                ) : (
                                    <ScreenShareIcon />
                                )}

                            </IconButton>
                        )}


                        {/* CHAT */}

                        <Badge
                            badgeContent={
                                newMessage
                            }
                            max={999}
                            color="secondary"
                        >

                            <IconButton
                                style={{
                                    color: "white",
                                }}
                                onClick={
                                    handleChat
                                }
                            >

                                {showModel ? (
                                    <CloseIcon />
                                ) : (
                                    <ChatIcon />
                                )}

                            </IconButton>

                        </Badge>


                        {/* CALL END */}

                        <IconButton
                            style={{
                                color: "red",
                            }}
                            onClick={
                                leaveCall
                            }
                        >

                            <CallEndIcon />

                        </IconButton>

                    </div>


                    {/* =================================
                        REMOTE VIDEOS
                    ================================= */}

                    <div className="conferenceView">

                        {videos.map(
                            (item) => (

                                <div
                                    key={
                                        item.socketId
                                    }
                                >

                                    <video
                                        autoPlay
                                        playsInline

                                        ref={(
                                            videoElement
                                        ) => {

                                            if (
                                                videoElement &&
                                                item.stream
                                            ) {

                                                videoElement.srcObject =
                                                    item.stream;
                                            }
                                        }}
                                    />

                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}