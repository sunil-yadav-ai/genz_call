import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../controls/authContext";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);

    const routeTo = useNavigate();

    useEffect(() => {

        const fetchHistory = async () => {
            try {

                const history = await getHistoryOfUser();

                console.log("History:", history);

                setMeetings(history);

            } catch (e) {
                console.log(e);
            }
        };

        fetchHistory();

    }, []);

    let formetDate = (dateString)=>{
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2,"0");
        const month = (date.getMonth()+1).toString().padStart(2,"0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`

    }

    return (
        <div>
            <IconButton onClick={()=>{
                routeTo("/home")

                }}>
                <HomeIcon/>
            </IconButton>

           {meetings.length !== 0 ? meetings.map((meeting) => {

                return (
                    <>
                        
                        <Card
                            variant="outlined"
                            key={meeting._id}
                            sx={{
                                maxWidth: 500,
                                margin: "20px auto"
                            }}
                        >

                            <CardContent>

                                <Typography
                                    gutterBottom
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: 14
                                    }}
                                >
                                    Meeting History
                                </Typography>

                                <Typography variant="h5" component="div">
                                    MeetingCode:
                                    {meeting.meetingCode}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        mb: 1.5
                                    }}
                                >
                                    Meeting Code
                                </Typography>

                                <Typography variant="body2">
                                    Date:
                                    {formetDate(meeting.date)}
                                </Typography>

                            </CardContent>

                            <CardActions>

                                <Button
                                    size="small"
                                    onClick={() => routeTo(`/meeting/${meeting.meetingCode}`)}
                                >
                                    Join Again
                                </Button>

                            </CardActions>

                        </Card>
                    </>
                );

            })
            :null}

        </div>
    );
}