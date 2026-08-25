// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../controls/authContext";
// import { useNavigate } from "react-router-dom";

// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import HomeIcon from "@mui/icons-material/Home";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";

// export default function History() {

//     const { getHistoryOfUser } = useContext(AuthContext);

//     const [meetings, setMeetings] = useState([]);

//     const routeTo = useNavigate();

//     useEffect(() => {

//         const fetchHistory = async () => {
//             try {

//                 const history = await getHistoryOfUser();

//                 console.log("History:", history);

//                 setMeetings(history);

//             } catch (e) {
//                 console.log(e);
//             }
//         };

//         fetchHistory();

//     }, []);

//     let formetDate = (dateString)=>{
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2,"0");
//         const month = (date.getMonth()+1).toString().padStart(2,"0")
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`

//     }

//     return (
//         <div>
//             <IconButton onClick={()=>{
//                 routeTo("/home")

//                 }}>
//                 <HomeIcon/>
//             </IconButton>

//            {meetings.length !== 0 ? meetings.map((meeting) => {

//                 return (
//                     <>
                        
//                         <Card
//                             variant="outlined"
//                             key={meeting._id}
//                             sx={{
//                                 maxWidth: 500,
//                                 margin: "20px auto"
//                             }}
//                         >

//                             <CardContent>

//                                 <Typography
//                                     gutterBottom
//                                     sx={{
//                                         color: "text.secondary",
//                                         fontSize: 14
//                                     }}
//                                 >
//                                     Meeting History
//                                 </Typography>

//                                 <Typography variant="h5" component="div">
//                                     MeetingCode:
//                                     {meeting.meetingCode}
//                                 </Typography>

//                                 <Typography
//                                     sx={{
//                                         color: "text.secondary",
//                                         mb: 1.5
//                                     }}
//                                 >
//                                     Meeting Code
//                                 </Typography>

//                                 <Typography variant="body2">
//                                     Date:
//                                     {formetDate(meeting.date)}
//                                 </Typography>

//                             </CardContent>

//                             <CardActions>

//                                 <Button
//                                     size="small"
//                                     onClick={() => routeTo(`/meeting/${meeting.meetingCode}`)}
//                                 >
//                                     Join Again
//                                 </Button>

//                             </CardActions>

//                         </Card>
//                     </>
//                 );

//             })
//             :null}

//         </div>
//     );
// }


import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../controls/authContext";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Button,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Grid,
    Fade,
    CircularProgress,
} from "@mui/material";

import {
    Home,
    History as HistoryIcon,
    Videocam,
    ArrowForward,
    EventAvailable,
} from "@mui/icons-material";

import "../style/History.css";


export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    /* =========================================
       FETCH HISTORY
    ========================================= */

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                setLoading(true);
                setError("");

                const history = await getHistoryOfUser();

                console.log("History:", history);

                if (Array.isArray(history)) {
                    setMeetings(history);
                } else {
                    setMeetings([]);
                }

            } catch (e) {

                console.error("History Error:", e);

                setMeetings([]);

                if (e?.response?.status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else {

                    setError(
                        e?.response?.data?.message ||
                        "Unable to load meeting history."
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        fetchHistory();

    }, [getHistoryOfUser]);


    /* =========================================
       FORMAT DATE
    ========================================= */

    const formatDate = (dateString) => {

        if (!dateString) {
            return "Unknown date";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Unknown date";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };


    /* =========================================
       JOIN MEETING
    ========================================= */

    const joinMeeting = (meetingCode) => {

        if (!meetingCode) {
            return;
        }

        navigate(`/${meetingCode}`);
    };


    return (

        <Box className="history-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <Box className="history-header">

                <Box className="history-title-section">

                    <IconButton
                        onClick={() => navigate("/home")}
                        className="home-button"
                    >
                        <Home />
                    </IconButton>

                    <Box>

                        <Typography
                            className="history-title"
                        >
                            Meeting History
                        </Typography>

                        <Typography
                            className="history-subtitle"
                        >
                            Jump back into your past
                            connections instantly.
                        </Typography>

                    </Box>

                </Box>


                <Box className="session-counter">

                    <Avatar className="history-avatar">
                        <HistoryIcon />
                    </Avatar>

                    <Typography className="session-text">
                        {meetings.length} Sessions
                    </Typography>

                </Box>

            </Box>


            {/* =====================================
                CONTENT
            ===================================== */}

            <Box className="history-content">


                {/* LOADING */}

                {loading && (

                    <Box className="history-state">

                        <CircularProgress
                            className="history-loader"
                        />

                        <Typography className="state-text">
                            Loading your history...
                        </Typography>

                    </Box>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <Fade in>

                        <Box className="error-box">

                            <Typography className="error-text">
                                {error}
                            </Typography>

                            {error.includes("session") && (

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        navigate("/auth")
                                    }
                                    className="login-again-button"
                                >
                                    Login Again
                                </Button>

                            )}

                        </Box>

                    </Fade>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    meetings.length === 0 && (

                        <Fade in>

                            <Box className="empty-box">

                                <Videocam className="empty-icon" />

                                <Typography className="empty-title">
                                    No sessions found
                                </Typography>

                                <Typography className="empty-description">
                                    Your recorded meeting history
                                    will appear here.
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        navigate("/home")
                                    }
                                    className="start-call-button"
                                >
                                    Start New Call
                                </Button>

                            </Box>

                        </Fade>
                    )}


                {/* MEETING CARDS */}

                {!loading &&
                    !error &&
                    meetings.length > 0 && (

                        <Grid
                            container
                            spacing={3}
                        >

                            {meetings.map(
                                (meeting, index) => (

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        key={
                                            meeting._id ||
                                            index
                                        }
                                    >

                                        <Fade
                                            in
                                            timeout={
                                                400 +
                                                index * 100
                                            }
                                        >

                                            <Card className="meeting-card">

                                                <CardContent className="meeting-card-content">

                                                    {/* CARD TOP */}

                                                    <Box className="meeting-card-top">

                                                        <Box className="ended-call-badge">

                                                            <Box className="status-dot" />

                                                            <Typography className="ended-call-text">
                                                                ENDED CALL
                                                            </Typography>

                                                        </Box>


                                                        <Typography className="meeting-id">

                                                            ID:{" "}

                                                            {meeting
                                                                .meetingCode
                                                                ?.substring(
                                                                    0,
                                                                    8
                                                                )}

                                                            ...

                                                        </Typography>

                                                    </Box>


                                                    {/* MEETING CODE */}

                                                    <Typography className="meeting-code">

                                                        {meeting.meetingCode}

                                                    </Typography>


                                                    {/* DATE */}

                                                    <Box className="meeting-date">

                                                        <EventAvailable />

                                                        <Typography>
                                                            {formatDate(
                                                                meeting.date
                                                            )}
                                                        </Typography>

                                                    </Box>

                                                </CardContent>


                                                {/* ACTION */}

                                                <CardActions className="meeting-actions">

                                                    <Button
                                                        fullWidth
                                                        endIcon={
                                                            <ArrowForward />
                                                        }
                                                        onClick={() =>
                                                            joinMeeting(
                                                                meeting.meetingCode
                                                            )
                                                        }
                                                        className="rejoin-button"
                                                    >
                                                        Rejoin Room
                                                    </Button>

                                                </CardActions>

                                            </Card>

                                        </Fade>

                                    </Grid>

                                )
                            )}

                        </Grid>

                    )}

            </Box>

        </Box>
    );
}