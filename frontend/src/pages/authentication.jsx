// // import React, { useContext, useState } from "react";

// // import Avatar from "@mui/material/Avatar";
// // import Button from "@mui/material/Button";
// // import TextField from "@mui/material/TextField";
// // import Box from "@mui/material/Box";
// // import Grid from "@mui/material/Grid";
// // import Snackbar from "@mui/material/Snackbar";

// // import { AuthContext } from "../controls/authContext.jsx";

// // export default function Authentication() {

// //     // useContext component ke andar hona chahiye
// //     const { handleRegister, handleLogin } = useContext(AuthContext);

// //     const [name, setName] = useState("");
// //     const [formState, setFormState] = useState(0);
// //     const [UserName, setUserName] = useState("");
// //     const [password, setPassword] = useState("");

// //     const [error, setError] = useState("");
// //     const [message, setMessage] = useState("");
// //     const [open, setOpen] = useState(false);


// //     const handleAuth = async (e) => {

// //     e.preventDefault();

// //     setError("");

// //     try {

// //         // SIGN IN
// //         if (formState === 0) {

// //             const result = await handleLogin(
// //                 UserName,
// //                 password
// //             );

// //             console.log(result);

// //             setMessage("Login successful");
// //             setOpen(true);

// //         }

// //         // SIGN UP
// //         else {

// //             const result = await handleRegister(
// //                 name,
// //                 UserName,
// //                 password
// //             );

// //             console.log(result);

// //             setMessage(result);

// //             setUserName("");
// //             setPassword("");
// //             setName("");

// //             setOpen(true);

// //             // Register ke baad Sign In par le jao
// //             setFormState(0);
// //         }

// //     } catch (err) {

// //         console.log(err);

// //         setError(
// //             err?.response?.data?.message ||
// //             "Something went wrong"
// //         );
// //     }
// // };
// //     return (

// //         <Grid
// //             container
// //             component="main"
// //             sx={{ height: "100vh" }}
// //         >

// //             <Grid
// //                 item
// //                 xs={false}
// //                 sm={4}
// //                 md={7}
// //                 sx={{
// //                     backgroundImage:
// //                         "url(https://source.unsplash.com/random?wallpapers)",
// //                     backgroundRepeat: "no-repeat",
// //                     backgroundColor: (t) =>
// //                         t.palette.mode === "light"
// //                             ? t.palette.grey[50]
// //                             : t.palette.grey[900],
// //                     backgroundSize: "cover",
// //                     backgroundPosition: "center",
// //                 }}
// //             />

// //             <Grid
// //                 item
// //                 xs={12}
// //                 sm={8}
// //                 md={5}
// //             >

// //                 {/* YAHAN TUMHARA ORIGINAL ALIGNMENT */}

// //                 <Box
// //                     sx={{
// //                         my: 8,
// //                         mx: 4,
// //                         display: "flex",
// //                         flexDirection: "column",
// //                         alignItems: "center",
// //                     }}
// //                 >

// //                     <Avatar
// //                         sx={{
// //                             m: 1,
// //                             bgcolor: "secondary.main"
// //                         }}
// //                     />

// //                     <div>

// //                         <Button
// //                             variant={
// //                                 formState === 0
// //                                     ? "contained"
// //                                     : "outlined"
// //                             }
// //                             onClick={() => {
// //                                 setFormState(0);
// //                                 setError("");
// //                             }}
// //                         >
// //                             Sign In
// //                         </Button>

// //                         <Button
// //                             variant={
// //                                 formState === 1
// //                                     ? "contained"
// //                                     : "outlined"
// //                             }
// //                             onClick={() => {
// //                                 setFormState(1);
// //                                 setError("");
// //                             }}
// //                         >
// //                             Sign Up
// //                         </Button>

// //                     </div>


// //                     <Box
// //                         component="form"
// //                         noValidate
// //                         onSubmit={handleAuth}
// //                         sx={{ mt: 1 }}
// //                     >

// //                         {formState === 1 ? (

// //                             <TextField
// //                                 margin="normal"
// //                                 required
// //                                 fullWidth
// //                                 id="fullname"
// //                                 value={name}
// //                                 label="FullName"
// //                                 name="Fullname"
// //                                 onChange={(e) =>
// //                                     setName(e.target.value)
// //                                 }
// //                                 autoFocus
// //                             />

// //                         ) : null}


// //                         <TextField
// //                             margin="normal"
// //                             required
// //                             fullWidth
// //                             id="username"
// //                             label="UserName"
// //                             value={UserName}
// //                             name="username"
// //                             onChange={(e) =>
// //                                 setUserName(e.target.value)
// //                             }
// //                             autoFocus
// //                         />


// //                         <TextField
// //                             margin="normal"
// //                             required
// //                             fullWidth
// //                             name="password"
// //                             label="Password"
// //                             value={password}
// //                             onChange={(e) =>
// //                                 setPassword(e.target.value)
// //                             }
// //                             type="password"
// //                             id="password"
// //                         />


// //                         <p style={{ color: "red" }}>
// //                             {error}
// //                         </p>


// //                         <Button
// //                             type="submit"
// //                             fullWidth
// //                             variant="contained"
// //                             sx={{
// //                                 mt: 3,
// //                                 mb: 2
// //                             }}
// //                         >
// //                             {formState === 0
// //                                 ? "Login"
// //                                 : "Register"}
// //                         </Button>

// //                     </Box>

// //                 </Box>

// //             </Grid>


// //             <Snackbar
// //                 open={open}
// //                 autoHideDuration={4000}
// //                 message={message}
// //                 onClose={() => setOpen(false)}
// //             />

// //         </Grid>
// //     );
// // }

// import React, { useContext, useState } from "react";
// import Snackbar from "@mui/material/Snackbar";

// import { AuthContext } from "../controls/authContext.jsx";

// import "./Authentication.css";

// export default function Authentication() {

//     const { handleRegister, handleLogin } = useContext(AuthContext);

//     const [name, setName] = useState("");
//     const [formState, setFormState] = useState(0);
//     const [UserName, setUserName] = useState("");
//     const [password, setPassword] = useState("");

//     const [error, setError] = useState("");
//     const [message, setMessage] = useState("");
//     const [open, setOpen] = useState(false);

//     const [showPassword, setShowPassword] = useState(false);

//     const handleAuth = async (e) => {

//         e.preventDefault();

//         setError("");

//         try {

//             // SIGN IN
//             if (formState === 0) {

//                 const result = await handleLogin(
//                     UserName,
//                     password
//                 );

//                 console.log(result);

//                 setMessage("Login successful");
//                 setOpen(true);

//             }

//             // SIGN UP
//             else {

//                 const result = await handleRegister(
//                     name,
//                     UserName,
//                     password
//                 );

//                 console.log(result);

//                 setMessage(result);

//                 setUserName("");
//                 setPassword("");
//                 setName("");

//                 setOpen(true);

//                 // Register ke baad Sign In
//                 setFormState(0);
//             }

//         } catch (err) {

//             console.log(err);

//             setError(
//                 err?.response?.data?.message ||
//                 "Something went wrong"
//             );
//         }
//     };

//     return (
//         <main className="auth-page">

//             {/* Background glow */}
//             <div className="auth-glow auth-glow-one"></div>
//             <div className="auth-glow auth-glow-two"></div>

//             <section className="auth-card">

//                 {/* Logo */}
//                 <div className="auth-logo">
//                     <span className="auth-logo-icon">▣</span>
//                 </div>

//                 {/* Heading */}
//                 <div className="auth-heading">

//                     <h1>
//                         {formState === 0
//                             ? "Welcome Back"
//                             : "Create Account"}
//                     </h1>

//                     <p>
//                         {formState === 0
//                             ? "Enter your details to access the lounge."
//                             : "Create your account and join the lounge."}
//                     </p>

//                 </div>

//                 {/* Tabs */}
//                 <div className="auth-tabs">

//                     <button
//                         type="button"
//                         className={
//                             formState === 0
//                                 ? "auth-tab active"
//                                 : "auth-tab"
//                         }
//                         onClick={() => {
//                             setFormState(0);
//                             setError("");
//                         }}
//                     >
//                         SIGN IN
//                     </button>

//                     <button
//                         type="button"
//                         className={
//                             formState === 1
//                                 ? "auth-tab active"
//                                 : "auth-tab"
//                         }
//                         onClick={() => {
//                             setFormState(1);
//                             setError("");
//                         }}
//                     >
//                         SIGN UP
//                     </button>

//                 </div>

//                 {/* Form */}
//                 <form
//                     className="auth-form"
//                     onSubmit={handleAuth}
//                 >

//                     {/* Full Name */}
//                     {formState === 1 && (
//                         <div className="auth-field">

//                             <label htmlFor="fullname">
//                                 FULL NAME
//                             </label>

//                             <div className="auth-input-wrapper">

//                                 <span className="auth-input-icon">
//                                     ◉
//                                 </span>

//                                 <input
//                                     id="fullname"
//                                     type="text"
//                                     value={name}
//                                     placeholder="John Doe"
//                                     onChange={(e) =>
//                                         setName(e.target.value)
//                                     }
//                                     required
//                                     autoFocus
//                                 />

//                             </div>

//                         </div>
//                     )}

//                     {/* Username */}
//                     <div className="auth-field">

//                         <label htmlFor="username">
//                             USERNAME
//                         </label>

//                         <div className="auth-input-wrapper">

//                             <span className="auth-input-icon">
//                                 @
//                             </span>

//                             <input
//                                 id="username"
//                                 type="text"
//                                 value={UserName}
//                                 placeholder="johndoe"
//                                 name="username"
//                                 onChange={(e) =>
//                                     setUserName(e.target.value)
//                                 }
//                                 required
//                                 autoFocus={formState === 0}
//                             />

//                         </div>

//                     </div>

//                     {/* Password */}
//                     <div className="auth-field">

//                         <label htmlFor="password">
//                             PASSWORD
//                         </label>

//                         <div className="auth-input-wrapper">

//                             <span className="auth-input-icon">
//                                 ◇
//                             </span>

//                             <input
//                                 id="password"
//                                 type={
//                                     showPassword
//                                         ? "text"
//                                         : "password"
//                                 }
//                                 value={password}
//                                 placeholder="••••••••"
//                                 name="password"
//                                 onChange={(e) =>
//                                     setPassword(e.target.value)
//                                 }
//                                 required
//                             />

//                             <button
//                                 type="button"
//                                 className="password-toggle"
//                                 onClick={() =>
//                                     setShowPassword(!showPassword)
//                                 }
//                                 aria-label="Toggle password visibility"
//                             >
//                                 {showPassword ? "◉" : "○"}
//                             </button>

//                         </div>

//                     </div>

//                     {/* Error */}
//                     {error && (
//                         <div className="auth-error">
//                             <span>!</span>
//                             {error}
//                         </div>
//                     )}

//                     {/* Remember / Forgot */}
//                     {formState === 0 && (
//                         <div className="auth-options">

//                             <label className="remember-me">

//                                 <input type="checkbox" />

//                                 <span>
//                                     Remember me
//                                 </span>

//                             </label>

//                             <button
//                                 type="button"
//                                 className="forgot-password"
//                             >
//                                 Forgot password?
//                             </button>

//                         </div>
//                     )}

//                     {/* Submit */}
//                     <button
//                         type="submit"
//                         className="auth-submit"
//                     >

//                         <span>
//                             {formState === 0
//                                 ? "ENTER LOUNGE"
//                                 : "CREATE ACCOUNT"}
//                         </span>

//                         <span className="submit-arrow">
//                             →
//                         </span>

//                     </button>

//                 </form>

//                 {/* Terms */}
//                 <p className="auth-terms">

//                     By continuing, you agree to our{" "}

//                     <span>Terms of Service</span>

//                     {" & "}

//                     <span>Privacy Policy</span>.

//                 </p>

//             </section>

//             {/* Snackbar */}
//             <Snackbar
//                 open={open}
//                 autoHideDuration={4000}
//                 message={message}
//                 onClose={() => setOpen(false)}
//                 anchorOrigin={{
//                     vertical: "bottom",
//                     horizontal: "center"
//                 }}
//             />

//         </main>
//     );
// }
import React, { useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

import { AuthContext } from "../controls/authContext.jsx";

import '../style/Autheentication.css';

export default function Authentication() {

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [formState, setFormState] = useState(0);
    const [UserName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async (e) => {

        e.preventDefault();

        setError("");

        try {

            // SIGN IN
            if (formState === 0) {

                const result = await handleLogin(
                    UserName,
                    password
                );

                console.log(result);

                setMessage("Login successful");
                setOpen(true);

            }

            // SIGN UP
            else {

                const result = await handleRegister(
                    name,
                    UserName,
                    password
                );

                console.log(result);

                setMessage(result);

                setUserName("");
                setPassword("");
                setName("");

                setOpen(true);

                // Register ke baad Sign In
                setFormState(0);
            }

        } catch (err) {

            console.log(err);

            setError(
                err?.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <main className="auth-page">

            {/* Background glow */}
            <div className="auth-glow auth-glow-one"></div>
            <div className="auth-glow auth-glow-two"></div>

            <section className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo-icon">▣</span>
                </div>

                {/* Heading */}
                <div className="auth-heading">

                    <h1>
                        {formState === 0
                            ? "Welcome Back"
                            : "Create Account"}
                    </h1>

                    <p>
                        {formState === 0
                            ? "Enter your details to access the lounge."
                            : "Create your account and join the lounge."}
                    </p>

                </div>

                {/* Tabs */}
                <div className="auth-tabs">

                    <button
                        type="button"
                        className={
                            formState === 0
                                ? "auth-tab active"
                                : "auth-tab"
                        }
                        onClick={() => {
                            setFormState(0);
                            setError("");
                        }}
                    >
                        SIGN IN
                    </button>

                    <button
                        type="button"
                        className={
                            formState === 1
                                ? "auth-tab active"
                                : "auth-tab"
                        }
                        onClick={() => {
                            setFormState(1);
                            setError("");
                        }}
                    >
                        SIGN UP
                    </button>

                </div>

                {/* Form */}
                <form
                    className="auth-form"
                    onSubmit={handleAuth}
                >

                    {/* Full Name */}
                    {formState === 1 && (
                        <div className="auth-field">

                            <label htmlFor="fullname">
                                FULL NAME
                            </label>

                            <div className="auth-input-wrapper">

                                <span className="auth-input-icon">
                                    ◉
                                </span>

                                <input
                                    id="fullname"
                                    type="text"
                                    value={name}
                                    placeholder="Name"
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                    autoFocus
                                />

                            </div>

                        </div>
                    )}

                    {/* Username */}
                    <div className="auth-field">

                        <label htmlFor="username">
                            USERNAME
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                @
                            </span>

                            <input
                                id="username"
                                type="text"
                                value={UserName}
                                placeholder="UserName"
                                name="username"
                                onChange={(e) =>
                                    setUserName(e.target.value)
                                }
                                required
                                autoFocus={formState === 0}
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="auth-field">

                        <label htmlFor="password">
                            PASSWORD
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                ◇
                            </span>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                placeholder="••••••••"
                                name="password"
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? "◉" : "○"}
                            </button>

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="auth-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {/* Remember / Forgot */}
                    {formState === 0 && (
                        <div className="auth-options">

                            <label className="remember-me">

                                <input type="checkbox" />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>

                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="auth-submit"
                    >

                        <span>
                            {formState === 0
                                ? "ENTER LOUNGE"
                                : "CREATE ACCOUNT"}
                        </span>

                        <span className="submit-arrow">
                            →
                        </span>

                    </button>

                </form>

                {/* Terms */}
                <p className="auth-terms">

                    By continuing, you agree to our{" "}

                    <span>Terms of Service</span>

                    {" & "}

                    <span>Privacy Policy</span>.

                </p>

            </section>

            {/* Snackbar */}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            />

        </main>
    );
}