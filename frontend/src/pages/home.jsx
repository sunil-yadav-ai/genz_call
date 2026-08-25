// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../App.css";


// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import RestoreIcon from "@mui/icons-material/Restore";
// import { AuthContext } from "../controls/authContext";

// export default function HomeComponent() {
//     const navigate = useNavigate();

//     const [meetingCode, setMeetingCode] = useState("");
//     const {addToUserHistory} = useContext(AuthContext);

//     const handleJoinVideoCall = async () => {
//         if (!meetingCode.trim()) {
//             alert("Please enter a meeting code");
//             return;
//         }
//         await addToUserHistory(meetingCode)
//         navigate(`/${meetingCode.trim()}`);
//     };

//     return (
//         <div className="navBar">

//             {/* Logo / Name */}
//             <div style={{ display: "flex", alignItems: "center" }}>
//                 <h3>Genz Video Call</h3>
//             </div>

//             {/* Join Meeting */}
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px"
//                 }}
//             >
//                 <input
//                     type="text"
//                     placeholder="Enter meeting code"
//                     value={meetingCode}
//                     onChange={(e) => setMeetingCode(e.target.value)}
//                 />

//                 <button onClick={handleJoinVideoCall}>
//                     Join
//                 </button>

//                 <IconButton onClick={
//                     ()=>{
//                         navigate("/history")
//                     }
//                 }>
//                     <RestoreIcon />
//                     <p>History</p>
                    
//                 </IconButton>
                
//                 <Button onClick={()=>{
//                     localStorage.removeItem("token")
//                     navigate("/auth")
//                 }}>
//                     Logout
//                 </Button>
//             </div>
            
//             <div className="rightPanel">
//                 <img src="/call.svg" alt="" />
//             </div>

//         </div>
//     );
// }

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../controls/authContext";

import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import {
    Videocam,
    History,
    Contacts,
    Settings,
    Logout,
    Keyboard,
    ArrowForward,
    DashboardOutlined,
    Search,
} from "@mui/icons-material";


export default function Home() {

    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory,userData } = useContext(AuthContext);


    /* =========================================
       JOIN VIDEO CALL
    ========================================= */

    const handleJoinVideoCall = async () => {

        const code = meetingCode.trim();

        if (!code) {
            alert("Please enter a meeting code");
            return;
        }

        try {

            await addToUserHistory(code);

            navigate(`/${code}`);

        } catch (error) {

            console.error(
                "Failed to add meeting to history:",
                error
            );

        }
    };


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/auth");
    };


    /* =========================================
       ENTER KEY
    ========================================= */

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {
            handleJoinVideoCall();
        }
    };


    return (
        <>

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
                bgcolor: "#090b10",
                color: "#fff",
                fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                overflow: "hidden",
            }}
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Box
                sx={{
                    width: 270,
                    flexShrink: 0,

                    display: {
                        xs: "none",
                        md: "flex",
                    },

                    flexDirection: "column",

                    bgcolor: "rgba(13, 16, 23, 0.96)",

                    borderRight:
                        "1px solid rgba(255,255,255,0.06)",

                    position: "relative",

                    zIndex: 10,
                }}
            >

                {/* Logo */}

                <Box
                    sx={{
                        px: 3,
                        py: 3.2,

                        display: "flex",
                        alignItems: "center",

                        gap: 1.5,
                    }}
                >

                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,

                            background:
                                "linear-gradient(135deg, #6d28d9, #a855f7)",

                            boxShadow:
                                "0 0 25px rgba(139,92,246,0.28)",
                        }}
                    >
                        <Videocam />
                    </Avatar>

                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: 750,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        GenZ{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "#c084fc",
                            }}
                        >
                            Call
                        </Box>
                    </Typography>

                </Box>


                <Divider
                    sx={{
                        borderColor:
                            "rgba(255,255,255,0.05)",
                    }}
                />


                {/* Navigation */}

                <List
                    sx={{
                        px: 1.5,
                        pt: 2,
                        flexGrow: 1,
                    }}
                >

                    {/* Start Meeting */}

                    <ListItem
                        onClick={() => navigate("/home")}
                        sx={{
                            borderRadius: 2.5,
                            mb: 0.7,
                            py: 1.25,
                            cursor: "pointer",

                            bgcolor:
                                "rgba(139,92,246,0.13)",

                            color: "#c084fc",

                            border:
                                "1px solid rgba(139,92,246,0.10)",

                            "&:hover": {
                                bgcolor:
                                    "rgba(139,92,246,0.18)",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <Videocam />
                        </ListItemIcon>

                        <ListItemText
                            primary="Start Meeting"
                            primaryTypographyProps={{
                                fontWeight: 650,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>


                    {/* Active Calls */}

                    <ListItem
                        sx={{
                            borderRadius: 2.5,
                            mb: 0.7,
                            py: 1.25,
                            cursor: "pointer",

                            color:
                                "rgba(255,255,255,0.55)",

                            "&:hover": {
                                bgcolor:
                                    "rgba(255,255,255,0.045)",
                                color: "#fff",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <DashboardOutlined />
                        </ListItemIcon>

                        <ListItemText
                            primary="Active Calls"
                            primaryTypographyProps={{
                                fontWeight: 550,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>


                    {/* History */}

                    <ListItem
                        onClick={() => navigate("/history")}
                        sx={{
                            borderRadius: 2.5,
                            mb: 0.7,
                            py: 1.25,
                            cursor: "pointer",

                            color:
                                "rgba(255,255,255,0.55)",

                            "&:hover": {
                                bgcolor:
                                    "rgba(255,255,255,0.045)",
                                color: "#fff",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <History />
                        </ListItemIcon>

                        <ListItemText
                            primary="History"
                            primaryTypographyProps={{
                                fontWeight: 550,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>


                    {/* Contacts */}

                    <ListItem
                        sx={{
                            borderRadius: 2.5,
                            mb: 0.7,
                            py: 1.25,
                            cursor: "pointer",

                            color:
                                "rgba(255,255,255,0.55)",

                            "&:hover": {
                                bgcolor:
                                    "rgba(255,255,255,0.045)",
                                color: "#fff",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <Contacts />
                        </ListItemIcon>

                        <ListItemText
                            primary="Contacts"
                            primaryTypographyProps={{
                                fontWeight: 550,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>

                </List>


                {/* Bottom Navigation */}

                <Box
                    sx={{
                        px: 1.5,
                        pb: 2,
                    }}
                >

                    <ListItem
                        sx={{
                            borderRadius: 2.5,
                            py: 1.25,
                            cursor: "pointer",

                            color:
                                "rgba(255,255,255,0.55)",

                            "&:hover": {
                                bgcolor:
                                    "rgba(255,255,255,0.045)",
                                color: "#fff",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <Settings />
                        </ListItemIcon>

                        <ListItemText
                            primary="Settings"
                            primaryTypographyProps={{
                                fontWeight: 550,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>


                    <ListItem
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2.5,
                            py: 1.25,
                            cursor: "pointer",

                            color: "#f87171",

                            "&:hover": {
                                bgcolor:
                                    "rgba(248,113,113,0.07)",
                            },
                        }}
                    >

                        <ListItemIcon
                            sx={{
                                color: "inherit",
                                minWidth: 43,
                            }}
                        >
                            <Logout />
                        </ListItemIcon>

                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                fontWeight: 550,
                                fontSize: "0.9rem",
                            }}
                        />

                    </ListItem>

                </Box>

            </Box>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,

                    position: "relative",

                    overflowY: "auto",

                    background:
                        `
                        radial-gradient(
                            circle at 80% 15%,
                            rgba(124,58,237,0.10),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 20% 85%,
                            rgba(168,85,247,0.055),
                            transparent 28%
                        )
                        `,
                }}
            >

                {/* Background Glow */}

                <Box
                    sx={{
                        position: "absolute",
                        width: 350,
                        height: 350,

                        top: -180,
                        right: -150,

                        borderRadius: "50%",

                        background: "#7c3aed",

                        filter: "blur(140px)",

                        opacity: 0.07,

                        pointerEvents: "none",
                    }}
                />


                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.5,
                            sm: 4,
                            md: 5,
                        },

                        py: {
                            xs: 2,
                            md: 3,
                        },

                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        gap: 2,

                        position: "relative",

                        zIndex: 2,

                        borderBottom:
                            "1px solid rgba(255,255,255,0.04)",
                    }}
                >

                    {/* Search */}

                    <TextField
                        placeholder="Search calls..."
                        size="small"

                        sx={{
                            width: {
                                xs: "100%",
                                sm: 300,
                            },

                            "& .MuiOutlinedInput-root": {
                                height: 42,

                                borderRadius: 2.5,

                                color: "#fff",

                                bgcolor:
                                    "rgba(255,255,255,0.025)",

                                "& fieldset": {
                                    borderColor:
                                        "rgba(255,255,255,0.06)",
                                },

                                "&:hover fieldset": {
                                    borderColor:
                                        "rgba(139,92,246,0.3)",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor:
                                        "#8b5cf6",
                                },
                            },

                            "& input::placeholder": {
                                color:
                                    "rgba(255,255,255,0.35)",
                                opacity: 1,
                            },
                        }}

                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">

                                    <Search
                                        sx={{
                                            color:
                                                "rgba(255,255,255,0.3)",
                                            fontSize: 20,
                                        }}
                                    />

                                </InputAdornment>
                            ),
                        }}
                    />


                    {/* Profile */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            sx={{
                                textAlign: "right",

                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                }}
                            >
                               {userData?.name || userData?.username || "User"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.6rem",
                                    color:
                                        "rgba(255,255,255,0.38)",
                                    letterSpacing:
                                        "0.12em",
                                }}
                            >
                                PRO TIER
                            </Typography>

                        </Box>


                        <Avatar
                            sx={{
                                width: 43,
                                height: 43,

                                bgcolor:
                                    "rgba(139,92,246,0.15)",

                                color: "#c084fc",

                                border:
                                    "2px solid #8b5cf6",

                                boxShadow:
                                    "0 0 18px rgba(139,92,246,0.18)",
                            }}
                        >
                           {(userData?.name ||
        userData?.username ||
        "U")
        .charAt(0)
        .toUpperCase()}
                        </Avatar>

                    </Box>

                </Box>


                {/* =================================================
                    HERO
                ================================================= */}

                <Box
                    sx={{
                        maxWidth: 1400,

                        mx: "auto",

                        px: {
                            xs: 2.5,
                            sm: 4,
                            md: 5,
                        },

                        py: {
                            xs: 5,
                            md: 8,
                        },

                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "1fr 1fr",
                        },

                        gap: {
                            xs: 6,
                            lg: 8,
                        },

                        alignItems: "center",
                    }}
                >

                    {/* HERO TEXT */}

                    <Box>

                        {/* System */}

                        <Typography
                            sx={{
                                color: "#c084fc",

                                fontSize: "0.68rem",

                                fontWeight: 800,

                                letterSpacing: "0.16em",

                                mb: 2.5,

                                display: "flex",

                                alignItems: "center",

                                gap: 1,
                            }}
                        >

                            <Box
                                component="span"
                                sx={{
                                    width: 7,
                                    height: 7,

                                    borderRadius: "50%",

                                    bgcolor: "#8b5cf6",

                                    boxShadow:
                                        "0 0 12px #8b5cf6",
                                }}
                            />

                            SYSTEM ONLINE

                        </Typography>


                        {/* Heading */}

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: "2.8rem",
                                    sm: "3.5rem",
                                    md: "4.2rem",
                                },

                                fontWeight: 800,

                                lineHeight: 1.04,

                                letterSpacing:
                                    "-0.045em",

                                mb: 2.5,

                                color: "#f5f5f7",
                            }}
                        >

                            Connect in
                            <br />

                            <Box
                                component="span"
                                sx={{
                                    color: "#a855f7",

                                    textShadow:
                                        "0 0 30px rgba(168,85,247,0.18)",
                                }}
                            >
                                High Definition.
                            </Box>

                        </Typography>


                        {/* Description */}

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.58)",

                                fontSize: {
                                    xs: "0.95rem",
                                    md: "1.08rem",
                                },

                                maxWidth: 540,

                                lineHeight: 1.7,

                                mb: 4,
                            }}
                        >
                            Secure, instant, and frictionless
                            video conferencing. Enter a code
                            to join an active session or start
                            your own room.
                        </Typography>


                        {/* =================================================
                            JOIN MEETING
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",

                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },

                                gap: 1.5,

                                p: 1.2,

                                bgcolor:
                                    "rgba(255,255,255,0.025)",

                                border:
                                    "1px solid rgba(255,255,255,0.065)",

                                borderRadius: 3.5,

                                backdropFilter:
                                    "blur(20px)",

                                maxWidth: 550,

                                boxShadow:
                                    "0 15px 50px rgba(0,0,0,0.18)",
                            }}
                        >

                            <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Enter meeting code"
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    onKeyDown={handleKeyDown}

                                    InputProps={{
                                        disableUnderline: true,

                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Keyboard
                                                    sx={{
                                                        color: "rgba(255,255,255,0.28)",
                                                        ml: 1,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),

                                        sx: {
                                            height: 54,
                                            color: "#fff",
                                            fontSize: "0.95rem",
                                            px: 1,
                                        },
                                    }}

                                    sx={{
                                        "& input::placeholder": {
                                            color: "rgba(255, 255, 255, 0.7)",
                                            opacity: 1,
                                        },
                                    }}
                                />

                            <Button
                                variant="contained"

                                onClick={
                                    handleJoinVideoCall
                                }

                                endIcon={
                                    <ArrowForward />
                                }

                                sx={{
                                    height: 54,

                                    px: 3,

                                    borderRadius: 2.5,

                                    flexShrink: 0,

                                    textTransform: "none",

                                    fontSize: "0.9rem",

                                    fontWeight: 700,

                                    background:
                                        "linear-gradient(100deg, #6d28d9, #8b5cf6, #a855f7)",

                                    boxShadow:
                                        "0 8px 25px rgba(139,92,246,0.25)",

                                    "&:hover": {
                                        background:
                                            "linear-gradient(100deg, #7c3aed, #9333ea, #c084fc)",

                                        boxShadow:
                                            "0 12px 30px rgba(139,92,246,0.35)",

                                        transform:
                                            "translateY(-1px)",
                                    },

                                    transition:
                                        "all 0.25s ease",
                                }}
                            >
                                Join Meeting
                            </Button>

                        </Box>

                    </Box>


                    {/* =================================================
                        VISUAL CARD
                    ================================================= */}

                    <Box
                        sx={{
                            position: "relative",

                            display: {
                                xs: "none",
                                lg: "block",
                            },
                        }}
                    >

                        {/* Glow */}

                        <Box
                            sx={{
                                position: "absolute",

                                width: 280,
                                height: 280,

                                left: "50%",
                                top: "50%",

                                transform:
                                    "translate(-50%, -50%)",

                                borderRadius: "50%",

                                background:
                                    "#7c3aed",

                                filter: "blur(100px)",

                                opacity: 0.13,
                            }}
                        />


                        {/* Main Card */}

                        <Box
                            sx={{
                                width: "100%",

                                aspectRatio: "4 / 3",

                                bgcolor:
                                    "rgba(255,255,255,0.025)",

                                borderRadius: 5,

                                border:
                                    "1px solid rgba(255,255,255,0.07)",

                                overflow: "hidden",

                                position: "relative",

                                display: "flex",

                                alignItems: "center",

                                justifyContent:
                                    "center",

                                boxShadow:
                                    "0 30px 70px rgba(0,0,0,0.4)",
                            }}
                        >

                            {/* Abstract Background */}

                            <Box
                                sx={{
                                    position: "absolute",

                                    inset: 0,

                                    background:
                                        `
                                        radial-gradient(
                                            circle at 50% 40%,
                                            rgba(139,92,246,0.18),
                                            transparent 35%
                                        ),
                                        linear-gradient(
                                            135deg,
                                            rgba(139,92,246,0.08),
                                            transparent
                                        )
                                        `,
                                }}
                            />


                            {/* Grid Lines */}

                            <Box
                                sx={{
                                    position: "absolute",

                                    inset: 0,

                                    opacity: 0.15,

                                    backgroundImage:
                                        `
                                        linear-gradient(
                                            rgba(255,255,255,0.06) 1px,
                                            transparent 1px
                                        ),
                                        linear-gradient(
                                            90deg,
                                            rgba(255,255,255,0.06) 1px,
                                            transparent 1px
                                        )
                                        `,

                                    backgroundSize:
                                        "45px 45px",
                                }}
                            />


                            {/* Camera Icon */}

                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,

                                    position: "relative",

                                    bgcolor:
                                        "rgba(139,92,246,0.12)",

                                    border:
                                        "2px solid rgba(192,132,252,0.35)",

                                    boxShadow:
                                        "0 0 50px rgba(139,92,246,0.18)",
                                }}
                            >

                                <Videocam
                                    sx={{
                                        fontSize: 58,

                                        color: "#a855f7",

                                        filter:
                                            "drop-shadow(0 0 12px rgba(168,85,247,0.5))",
                                    }}
                                />

                            </Avatar>


                            {/* Floating Meeting Card */}

                            <Box
                                sx={{
                                    position: "absolute",

                                    bottom: 25,
                                    left: 25,
                                    right: 25,

                                    p: 2,

                                    bgcolor:
                                        "rgba(20,21,29,0.78)",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius: 3,

                                    backdropFilter:
                                        "blur(20px)",

                                    display: "flex",

                                    alignItems: "center",

                                    gap: 1.8,

                                    boxShadow:
                                        "0 15px 40px rgba(0,0,0,0.3)",
                                }}
                            >

                                <Avatar
                                    sx={{
                                        width: 45,
                                        height: 45,

                                        bgcolor:
                                            "rgba(139,92,246,0.15)",

                                        color: "#c084fc",

                                        border:
                                            "2px solid #8b5cf6",

                                        fontSize: "0.75rem",

                                        fontWeight: 700,
                                    }}
                                >
                                    DS
                                </Avatar>


                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        minWidth: 0,
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            fontSize:
                                                "0.85rem",

                                            fontWeight: 700,
                                        }}
                                    >
                                        Design Sync
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,0.4)",

                                            fontSize:
                                                "0.58rem",

                                            letterSpacing:
                                                "0.1em",
                                        }}
                                    >
                                        STARTS IN 5M
                                    </Typography>

                                </Box>


                                <Button
                                    size="small"
                                    sx={{
                                        color: "#c084fc",

                                        textTransform:
                                            "none",

                                        fontSize:
                                            "0.7rem",

                                        fontWeight: 700,

                                        "&:hover": {
                                            bgcolor:
                                                "rgba(139,92,246,0.08)",
                                        },
                                    }}
                                >
                                    Quick Join
                                </Button>

                            </Box>

                        </Box>

                    </Box>

                </Box>

            </Box>

        </Box>
        </>
    );
}