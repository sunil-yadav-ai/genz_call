import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../controls/authContext";

export default function HomeComponent() {
    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");
    const {addToUserHistory} = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            alert("Please enter a meeting code");
            return;
        }
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode.trim()}`);
    };

    return (
        <div className="navBar">

            {/* Logo / Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <h3>Genz Video Call</h3>
            </div>

            {/* Join Meeting */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}
            >
                <input
                    type="text"
                    placeholder="Enter meeting code"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                />

                <button onClick={handleJoinVideoCall}>
                    Join
                </button>

                <IconButton onClick={
                    ()=>{
                        navigate("/history")
                    }
                }>
                    <RestoreIcon />
                    <p>History</p>
                    
                </IconButton>
                
                <Button onClick={()=>{
                    localStorage.removeItem("token")
                    navigate("/auth")
                }}>
                    Logout
                </Button>
            </div>
            
            <div className="rightPanel">
                <img src="/call.svg" alt="" />
            </div>

        </div>
    );
}