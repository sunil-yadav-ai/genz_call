import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../style/videoComponent.module.css";
import { io } from "socket.io-client";


const server_url = "http://localhost:8000";

const peerConfigConnections = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

export default function VideoMeet() {
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const localVideoRef = useRef(null);

    const connectionsRef = useRef({});

    const [username, setUsername] = useState("");
    const [askForUsername, setAskForUsername] = useState(true);

    const [videos, setVideos] = useState([]);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);

    // -----------------------------------------
    // GET CAMERA + MICROPHONE
    // -----------------------------------------

    const getMedia = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

            window.localStream = stream;

            setVideo(true);
            setAudio(true);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            console.log("Camera and microphone started");

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

    // -----------------------------------------
    // ATTACH LOCAL VIDEO
    // -----------------------------------------

    useEffect(() => {
        if (
            !askForUsername &&
            localVideoRef.current &&
            window.localStream
        ) {
            localVideoRef.current.srcObject =
                window.localStream;

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

    // -----------------------------------------
    // HANDLE SIGNAL
    // -----------------------------------------

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

            // -------------------------
            // SDP
            // -------------------------

            if (signal.sdp) {
                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        signal.sdp
                    )
                );

                if (signal.sdp.type === "offer") {
                    const answer =
                        await peer.createAnswer();

                    await peer.setLocalDescription(
                        answer
                    );

                    socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                            sdp: peer.localDescription,
                        })
                    );
                }
            }

            // -------------------------
            // ICE
            // -------------------------

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

    // -----------------------------------------
    // CREATE PEER CONNECTION
    // -----------------------------------------

    const createPeerConnection = (
        socketListId
    ) => {
        const peer =
            new RTCPeerConnection(
                peerConfigConnections
            );

        connectionsRef.current[socketListId] =
            peer;

        // -------------------------
        // ICE CANDIDATE
        // -------------------------

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

        // -------------------------
        // REMOTE STREAM
        // -------------------------

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
                                      stream: remoteStream,
                                  }
                                : item
                    );
                }

                return [
                    ...oldVideos,
                    {
                        socketId:
                            socketListId,
                        stream: remoteStream,
                    },
                ];
            });
        };

        // -------------------------
        // CONNECTION STATE
        // -------------------------

        peer.onconnectionstatechange = () => {
            console.log(
                "Connection:",
                socketListId,
                peer.connectionState
            );
        };

        // -------------------------
        // ADD LOCAL TRACKS
        // -------------------------

        if (window.localStream) {
            window.localStream
                .getTracks()
                .forEach((track) => {
                    peer.addTrack(
                        track,
                        window.localStream
                    );
                });
        }

        return peer;
    };

    // -----------------------------------------
    // CREATE OFFER
    // -----------------------------------------

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
                    sdp: peer.localDescription,
                })
            );
        } catch (error) {
            console.log(
                "Offer error:",
                error
            );
        }
    };

    // -----------------------------------------
    // CONNECT TO SOCKET SERVER
    // -----------------------------------------

    const connect = async () => {
        if (!username.trim()) {
            alert("Please enter your username");
            return;
        }

        // First start camera + microphone
        const stream = await getMedia();

        if (!stream) {
            return;
        }

        // Connect socket
        socketRef.current = io(server_url, {
            transports: ["websocket", "polling"],
        });

        // Signal
        socketRef.current.on(
            "signal",
            gotMessageFromServer
        );

        // Socket connected
        socketRef.current.on(
            "connect",
            () => {
                console.log(
                    "Socket connected:",
                    socketRef.current.id
                );

                socketIdRef.current =
                    socketRef.current.id;

                socketRef.current.emit(
                    "join-call",
                    window.location.href
                );
            }
        );

        // ---------------------------------
        // USER JOINED
        // ---------------------------------

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

        // ---------------------------------
        // USER LEFT
        // ---------------------------------

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

        setAskForUsername(false);
    };

    // -----------------------------------------
    // VIDEO ENABLE / DISABLE
    // -----------------------------------------

    const toggleVideo = () => {
        if (!window.localStream) {
            return;
        }

        const videoTrack =
            window.localStream.getVideoTracks()[0];

        if (videoTrack) {
            videoTrack.enabled =
                !videoTrack.enabled;

            setVideo(
                videoTrack.enabled
            );
        }
    };

    // -----------------------------------------
    // AUDIO ENABLE / DISABLE
    // -----------------------------------------

    const toggleAudio = () => {
        if (!window.localStream) {
            return;
        }

        const audioTrack =
            window.localStream.getAudioTracks()[0];

        if (audioTrack) {
            audioTrack.enabled =
                !audioTrack.enabled;

            setAudio(
                audioTrack.enabled
            );
        }
    };

    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------

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

            if (window.localStream) {
                window.localStream
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

                window.localStream = null;
            }
        };
    }, []);

    // -----------------------------------------
    // UI
    // -----------------------------------------

    return (
        <div className="videoMeetContainer">

            {/* =========================
                LOBBY
            ========================= */}

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
                            ref={
                                localVideoRef
                            }
                            autoPlay
                            muted
                            playsInline
                        />

                    </div>

                </div>
            ) : (

                /* =========================
                   MEETING
                ========================= */

                <div className="meetVideoContainer">

                    <h1>
                        Welcome, {username}
                    </h1>

                    

                    <div className="localVideoContainer">

                        <video

                            className="meetUserVideo"
                            ref={
                                localVideoRef
                            }
                            autoPlay
                            muted
                            playsInline
                        />

                    </div>

                    {/* CONTROLS */}

                    <div className="controls">

                        <Button
                            variant="contained"
                            onClick={
                                toggleVideo
                            }
                        >
                            {video
                                ? "Turn Camera Off"
                                : "Turn Camera On"}
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                toggleAudio
                            }
                        >
                            {audio
                                ? "Mute"
                                : "Unmute"}
                        </Button>

                    </div>

                    {/* REMOTE VIDEOS */}

                    <div >

                        {videos.map(
                            (item) => (
                                <div
                                    key={
                                        item.socketId
                                    }
                                    className="remoteVideoContainer"
                                >

                                    <h3>
                                        {item.socketId}
                                    </h3>

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