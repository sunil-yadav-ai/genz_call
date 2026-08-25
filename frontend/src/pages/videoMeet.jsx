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
    const [askForUsername, setAskForUsername] = useState(true);

    const [videos, setVideos] = useState([]);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);

    const [screenAvailable, setScreenAvailable] =
        useState(false);

    const [screen, setScreen] = useState(false);

    // =========================================
    // CHAT
    // =========================================

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(0);
    const [showModel, setShowModel] = useState(true);

    // =========================================
    // SCREEN SHARE AVAILABLE
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
            const signal =
                typeof message === "string"
                    ? JSON.parse(message)
                    : message;

            const peer =
                connectionsRef.current[fromId];

            if (!peer) {
                console.log(
                    "Peer not found:",
                    fromId
                );
                return;
            }

            // =================================
            // SDP
            // =================================

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

                    if (
                        socketRef.current &&
                        socketRef.current.connected
                    ) {
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
            }

            // =================================
            // ICE
            // =================================

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

        // =================================
        // ICE CANDIDATE
        // =================================

        peer.onicecandidate = (event) => {
            if (
                event.candidate &&
                socketRef.current &&
                socketRef.current.connected
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

        // =================================
        // REMOTE STREAM
        // =================================

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

        // =================================
        // CONNECTION STATE
        // =================================

        peer.onconnectionstatechange = () => {
            console.log(
                "Connection:",
                socketListId,
                peer.connectionState
            );

            if (
                peer.connectionState ===
                    "failed" ||
                peer.connectionState ===
                    "closed" ||
                peer.connectionState ===
                    "disconnected"
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

        // =================================
        // ADD LOCAL TRACKS
        // =================================

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

            if (
                socketRef.current &&
                socketRef.current.connected
            ) {
                socketRef.current.emit(
                    "signal",
                    socketListId,
                    JSON.stringify({
                        sdp:
                            peer.localDescription,
                    })
                );
            }
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
                sender:
                    typeof sender === "string"
                        ? sender
                        : "User",

                data:
                    typeof data === "string"
                        ? data
                        : JSON.stringify(data),

                socketId:
                    socketIdSender,
            },
        ]);

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
    // CONNECT
    // =========================================

    const connect = async () => {
        if (!username.trim()) {
            alert(
                "Please enter your username"
            );

            return;
        }

        // =================================
        // CAMERA + MIC
        // =================================

        const stream =
            await getMedia();

        if (!stream) {
            return;
        }

        // =================================
        // CREATE SOCKET
        // =================================

        const newSocket = io(
            server_url,
            {
                transports: [
                    "polling",
                    "websocket",
                ],

                reconnection: true,

                reconnectionAttempts: 5,

                timeout: 10000,
            }
        );

        socketRef.current =
            newSocket;

        // =================================
        // SOCKET CONNECT
        // =================================

        newSocket.on(
            "connect",
            () => {
                console.log(
                    "Socket connected:",
                    newSocket.id
                );

                socketIdRef.current =
                    newSocket.id;

                newSocket.emit(
                    "join-call",
                    window.location.href
                );
            }
        );

        // =================================
        // SOCKET ERROR
        // =================================

        newSocket.on(
            "connect_error",
            (error) => {
                console.error(
                    "Socket connection error:",
                    error.message
                );
            }
        );

        // =================================
        // DISCONNECT
        // =================================

        newSocket.on(
            "disconnect",
            (reason) => {
                console.log(
                    "Socket disconnected:",
                    reason
                );
            }
        );

        // =================================
        // WEBRTC SIGNAL
        // =================================

        newSocket.on(
            "signal",
            gotMessageFromServer
        );

        // =================================
        // CHAT
        // =================================

        newSocket.on(
            "chat-message",
            addMessage
        );

        // =================================
        // USER JOINED
        // =================================

        newSocket.on(
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

                if (
                    !Array.isArray(clients)
                ) {
                    console.error(
                        "Invalid clients list:",
                        clients
                    );

                    return;
                }

                // Create peer connection
                clients.forEach(
                    (socketListId) => {
                        if (
                            socketListId ===
                            socketIdRef.current
                        ) {
                            return;
                        }

                        if (
                            !connectionsRef
                                .current[
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
                        (
                            socketListId
                        ) => {
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

        // =================================
        // USER LEFT
        // =================================

        newSocket.on(
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

                    delete connectionsRef
                        .current[id];
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

        // =================================
        // ENTER MEETING
        // =================================

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

        socketRef.current.emit(
            "chat-message",
            message,
            username,
            socketIdRef.current
        );

        setMessage("");
    };

    // =========================================
    // TOGGLE CHAT
    // =========================================

    const handleChat = () => {
        setShowModel(
            (prev) => !prev
        );

        if (!showModel) {
            setNewMessage(0);
        }
    };

    // =========================================
    // TOGGLE VIDEO
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
    // TOGGLE AUDIO
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

            if (
                localVideoRef.current
            ) {
                localVideoRef.current.srcObject =
                    screenStream;
            }

            setScreen(true);

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

        if (screenStream) {
            screenStream
                .getTracks()
                .forEach((track) =>
                    track.stop()
                );
        }

        if (
            localVideoRef.current
        ) {
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
        if (screen) {
            stopScreenShare();
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
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
                socketRef.current = null;
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

                localStreamRef.current =
                    null;
            }
        };
    }, []);

    // =========================================
    // UI
    // =========================================

    return (
        <div className="videoMeetContainer">

            {/* =====================================
                LOBBY
            ===================================== */}

            {askForUsername ? (

                <div className="lobbyContainer">

                    <div className="lobbyCard">

                        {/* VIDEO PREVIEW */}

                        <div className="lobbyPreview">

                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                            />

                            {!video && (
                                <div className="cameraOffIcon">
                                    <VideocamOffIcon />
                                </div>
                            )}

                        </div>

                        {/* JOIN FORM */}

                        <div className="lobbyForm">

                            <h2>
                                Ready to join?
                            </h2>

                            <p>
                                Setup your camera and mic before entering the session.
                            </p>

                            <TextField
                                fullWidth
                                label="DISPLAY NAME"
                                placeholder="Enter your name"
                                variant="outlined"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        connect();
                                    }
                                }}
                                className="usernameInput"
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={connect}
                                className="joinButton"
                            >
                                Join Meeting
                            </Button>

                        </div>

                    </div>

                </div>

            ) : (

                /* =====================================
                   MEETING
                ===================================== */

                <div className="meetingPage">

                    {/* HEADER */}

                    <header className="meetingHeader">

                        <div className="brandSection">

                            <div className="brandIcon">
                                <VideocamIcon />
                            </div>

                            <span className="brandName">
                                GenZ Video Call
                            </span>

                            <span className="liveBadge">
                                ● LIVE
                            </span>

                        </div>

                        <div className="headerNavigation">

                            <span>
                                Explore
                            </span>

                            <span>
                                Friends
                            </span>

                            <span>
                                Clips
                            </span>

                        </div>

                        <div className="headerRight">

                            <div className="participantCount">
                                👥 {videos.length + 1}
                            </div>

                            <div className="profileCircle">
                                {username
                                    ? username
                                        .substring(0, 1)
                                        .toUpperCase()
                                    : "S"}
                            </div>

                        </div>

                    </header>

                    {/* MAIN CONTENT */}

                    <div className="meetingContent">

                        {/* VIDEO AREA */}

                        <main className="videoArea">

                            <div className="videoGrid">

                                {/* REMOTE VIDEOS */}

                                {videos.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            className="videoCard"
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

                                            <div className="videoUserInfo">

                                                <span className="userAvatar">
                                                    {index ===
                                                    0
                                                        ? "SJ"
                                                        : "MK"}
                                                </span>

                                                <span>
                                                    {index ===
                                                    0
                                                        ? "Sarah Jenkins"
                                                        : "Marcus King"}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                                {/* EMPTY STATE */}

                                {videos.length ===
                                    0 && (

                                    <div className="videoCard emptyVideo">

                                        <div className="emptyAvatar">
                                            EL
                                        </div>

                                        <span>
                                            Waiting for participant...
                                        </span>

                                    </div>

                                )}

                                {/* LOCAL VIDEO */}

                                <div className="videoCard localVideoCard">

                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                    />

                                    <div className="videoUserInfo">

                                        <span className="userAvatar">

                                            {username
                                                ? username
                                                    .substring(
                                                        0,
                                                        2
                                                    )
                                                    .toUpperCase()
                                                : "ME"}

                                        </span>

                                        <span>
                                            {username ||
                                                "You"}
                                        </span>

                                    </div>

                                </div>

                                {/* SCREEN SHARE */}

                                {screen && (

                                    <div className="videoCard screenCard">

                                        <div className="screenIcon">
                                            <ScreenShareIcon />
                                        </div>

                                        <span>
                                            Screen Sharing
                                        </span>

                                    </div>

                                )}

                            </div>

                            {/* CONTROLS */}

                            <div className="bottomControls">

                                {/* MIC */}

                                {audioAvailable && (

                                    <button
                                        className={
                                            audio
                                                ? "controlButton"
                                                : "controlButton activeOff"
                                        }
                                        onClick={
                                            toggleAudio
                                        }
                                    >

                                        {audio ? (
                                            <MicIcon />
                                        ) : (
                                            <MicOffIcon />
                                        )}

                                    </button>

                                )}

                                {/* CAMERA */}

                                {videoAvailable && (

                                    <button
                                        className={
                                            video
                                                ? "controlButton"
                                                : "controlButton activeOff"
                                        }
                                        onClick={
                                            toggleVideo
                                        }
                                    >

                                        {video ? (
                                            <VideocamIcon />
                                        ) : (
                                            <VideocamOffIcon />
                                        )}

                                    </button>

                                )}

                                {/* SCREEN */}

                                {screenAvailable && (

                                    <button
                                        className="controlButton"
                                        onClick={
                                            toggleScreenShare
                                        }
                                    >

                                        {screen ? (
                                            <StopScreenShareIcon />
                                        ) : (
                                            <ScreenShareIcon />
                                        )}

                                    </button>

                                )}

                                {/* CHAT */}

                                <Badge
                                    badgeContent={
                                        newMessage
                                    }
                                    color="error"
                                    max={999}
                                >

                                    <button
                                        className="controlButton"
                                        onClick={
                                            handleChat
                                        }
                                    >

                                        {showModel ? (
                                            <CloseIcon />
                                        ) : (
                                            <ChatIcon />
                                        )}

                                    </button>

                                </Badge>

                                {/* LEAVE */}

                                <button
                                    className="leaveButton"
                                    onClick={
                                        leaveCall
                                    }
                                >

                                    <CallEndIcon />

                                    <span>
                                        Leave
                                    </span>

                                </button>

                            </div>

                            {/* SMALL LOCAL PREVIEW */}

                            <div className="smallLocalPreview">

                                <video
                                    autoPlay
                                    muted
                                    playsInline
                                    ref={(
                                        videoElement
                                    ) => {

                                        if (
                                            videoElement &&
                                            localStreamRef.current
                                        ) {
                                            videoElement.srcObject =
                                                localStreamRef.current;
                                        }

                                    }}
                                />

                                <div className="previewLabel">
                                    You
                                </div>

                            </div>

                        </main>

                        {/* CHAT SIDEBAR */}

                        {showModel && (

                            <aside className="meetingChat">

                                {/* HEADER */}

                                <div className="chatTop">

                                    <div className="chatTitle">

                                        <ChatIcon />

                                        <h2>
                                            Meeting Chat
                                        </h2>

                                    </div>

                                    <button
                                        className="chatClose"
                                        onClick={
                                            handleChat
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                                <div className="chatTime">
                                    Live Chat
                                </div>

                                {/* MESSAGES */}

                                <div className="chatMessages">

                                    {messages.length ===
                                    0 ? (

                                        <div className="emptyChat">

                                            <ChatIcon />

                                            <p>
                                                No messages yet
                                            </p>

                                            <span>
                                                Start the conversation
                                            </span>

                                        </div>

                                    ) : (

                                        messages.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <div
                                                    className="chatMessage"
                                                    key={
                                                        index
                                                    }
                                                >

                                                    <div className="chatUser">

                                                        <div className="chatAvatar">

                                                            {item.sender
                                                                ? item.sender
                                                                    .substring(
                                                                        0,
                                                                        2
                                                                    )
                                                                    .toUpperCase()
                                                                : "U"}

                                                        </div>

                                                        <span>
                                                            {item.sender ||
                                                                "User"}
                                                        </span>

                                                    </div>

                                                    <div className="messageBubble">

                                                        {typeof item.data ===
                                                        "string"
                                                            ? item.data
                                                            : JSON.stringify(
                                                                  item.data
                                                              )}

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                                {/* CHAT INPUT */}

                                <div className="chatInputArea">

                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Type a message..."
                                        variant="outlined"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {

                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {

                                                e.preventDefault();

                                                sendMessage();

                                            }

                                        }}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">

                                                        <IconButton
                                                            onClick={
                                                                sendMessage
                                                            }
                                                            className="sendButton"
                                                        >
                                                            <SendRoundedIcon />
                                                        </IconButton>

                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                </div>

                            </aside>

                        )}

                    </div>

                    {/* FOOTER */}

                    <footer className="meetingFooter">

                        <span>
                            © 2026 GenZ Video Call
                        </span>

                        <span>
                            ⚙
                        </span>

                    </footer>

                </div>

            )}

        </div>
    );
}