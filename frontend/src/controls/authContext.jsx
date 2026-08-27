import React, {
    createContext,
    useState,
    useEffect,
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

            const savedUser =
                localStorage.getItem("userData");

            return savedUser
                ? JSON.parse(savedUser)
                : {};

        } catch (error) {

            console.error(
                "User data parse error:",
                error
            );

            return {};
        }
    });

    const router = useNavigate();


    /* =========================================
       REGISTER
    ========================================= */

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

            if (request.status === 200 || request.status === 201) {
    const user =
        request.data?.user ||
        request.data?.data ||
        {
            name,
            username,
        };

    setUserData(user);

    localStorage.setItem(
        "userData",
        JSON.stringify(user)
    );

    router("/home");

    return request.data.message;
}
        } catch (err) {

            console.error(
                "Register Error:",
                err
            );

            throw err;
        }
    };


    /* =========================================
       LOGIN
    ========================================= */

    const handleLogin = async (username, password) => {
    try {
        const request = await client.post("/login", {
            username,
            password,
        });

        if (request.status === httpStatus.OK) {

            console.log("LOGIN RESPONSE:", request.data);

            const token = request.data?.token;

            if (!token) {
                throw new Error("Token was not returned by server.");
            }

            // Save token
            localStorage.setItem("token", token);


            /*
             =========================================
             GET USER DATA
             =========================================
            */

            let user =
                request.data?.user ||
                request.data?.data;


            /*
             =========================================
             BACKEND DOES NOT SEND USER
             =========================================
            */

            if (!user) {

                // Check previously saved user
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


            /*
             =========================================
             FINAL FALLBACK
             =========================================
            */

            if (!user) {

                user = {
                    username: username,
                    name: username,
                };
            }


            /*
             =========================================
             SAVE USER
             =========================================
            */

            setUserData(user);

            localStorage.setItem(
                "userData",
                JSON.stringify(user)
            );


            console.log(
                "FINAL USER DATA:",
                user
            );


            router("/home");

            return request.data;
        }

        return request.data;

    } catch (err) {

        console.error(
            "Login Error:",
            err
        );

        throw err;
    }
};

    /* =========================================
       GET USER HISTORY
    ========================================= */

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


            if (
                Array.isArray(
                    response.data
                )
            ) {

                return response.data;
            }

            if (
                Array.isArray(
                    response.data?.history
                )
            ) {

                return response.data.history;
            }

            if (
                Array.isArray(
                    response.data?.data
                )
            ) {

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


    /* =========================================
       ADD MEETING TO HISTORY
    ========================================= */

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
                        meeting_code:
                            meetingCode,
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


    /* =========================================
       LOGOUT
    ========================================= */

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem(
            "userData"
        );

        setUserData({});

        router("/auth");
    };


    /* =========================================
       CONTEXT DATA
    ========================================= */

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