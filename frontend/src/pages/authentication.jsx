
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