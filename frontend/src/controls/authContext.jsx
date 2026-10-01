import React, {
    createContext,
    useState,
} from "react";

import server from "../enverment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState(() => {
        try {
            const savedUser = localStorage.getItem("userData");

            return savedUser
                ? JSON.parse(savedUser)
                : {};

        } catch (error) {
            console.error("User data parse error:", error);
            return {};
        }
    });

    const router = useNavigate();

    // =========================================
    // REGISTER
    // =========================================

    const handleRegister = async (
        name,
        username,
        password
    ) => {
        try {

            const request = await client.post(
                "/register",
                {
                    name,
                    username,
                    password,
                }
            );

            if (
                request.status === 200 ||
                request.status === 201
            ) {

                console.log(
                    "REGISTER RESPONSE:",
                    request.data
                );

                // IMPORTANT:
                // Registration ke baad user ko login
                // nahi maana jayega because backend
                // token return nahi kar raha.

                return request.data?.message || "User Registered";
            }

            return request.data;

        } catch (err) {

            console.error(
                "Register Error:",
                err.response?.data || err.message
            );

            throw err;
        }
    };


    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = async (
        username,
        password
    ) => {

        try {

            const request = await client.post(
                "/login",
                {
                    username,
                    password,
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                request.data
            );

            if (request.status !== httpStatus.OK) {
                throw new Error(
                    request.data?.message ||
                    "Login failed"
                );
            }

            const token = request.data?.token;

            if (!token) {
                throw new Error(
                    "Token was not returned by server."
                );
            }

            // Save authentication token
            localStorage.setItem(
                "token",
                token
            );


            // =========================================
            // USER DATA
            // =========================================

            let user =
                request.data?.user ||
                request.data?.data;


            // Backend currently does not return user
            if (!user) {

                const savedUser =
                    localStorage.getItem("userData");

                if (savedUser) {

                    try {

                        const oldUser =
                            JSON.parse(savedUser);

                        user = {
                            ...oldUser,
                            username:
                                oldUser.username ||
                                username,
                        };

                    } catch (error) {

                        console.error(
                            "Saved user parse error:",
                            error
                        );
                    }
                }
            }


            // Final fallback
            if (!user) {

                user = {
                    username: username,
                    name: username,
                };
            }


            // Save user
            setUserData(user);

            localStorage.setItem(
                "userData",
                JSON.stringify(user)
            );


            console.log(
                "FINAL USER DATA:",
                user
            );

            console.log(
                "TOKEN SAVED:",
                localStorage.getItem("token")
            );


            // Go to home
            router("/home");

            return request.data;

        } catch (err) {

            console.error(
                "Login Error:",
                err.response?.data || err.message
            );

            throw err;
        }
    };


    // =========================================
    // GET USER HISTORY
    // =========================================

    const getHistoryOfUser = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "User is not authenticated. Token not found."
                );
            }

            const response =
                await client.get(
                    "/get_all_activity",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(
                "Get History Response:",
                response.data
            );

            if (Array.isArray(response.data)) {
                return response.data;
            }

            if (Array.isArray(response.data?.history)) {
                return response.data.history;
            }

            if (Array.isArray(response.data?.data)) {
                return response.data.data;
            }

            return [];

        } catch (error) {

            console.error(
                "Get History Error:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // =========================================
    // ADD MEETING TO HISTORY
    // =========================================

    const addToUserHistory = async (
        meetingCode
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "User is not authenticated. Token not found."
                );
            }

            const response =
                await client.post(
                    "/add_to_activity",
                    {
                        meeting_code: meetingCode,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(
                "Add History Response:",
                response.data
            );

            return response.data;

        } catch (error) {

            console.error(
                "Add to user history error:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userData");

        setUserData({});

        router("/auth");
    };


    // =========================================
    // CONTEXT
    // =========================================

    const data = {

        userData,
        setUserData,

        handleRegister,
        handleLogin,

        getHistoryOfUser,
        addToUserHistory,

        logout,
    };


    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};