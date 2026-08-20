import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function LandingPage(){

    const router = useNavigate()
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'><h2>GenZ Video Call</h2></div>
                <div className='navlist'>
                    <p onClick={()=>{
                        router("/guest")
                    }}>Join as Guest</p>
                    <p onClick={()=>{
                        router("/auth")
                    }}>Register</p>
                    <div  role='button' >
                        <p onClick={()=>{
                            router("/auth")
                        }}>Login</p>
                    </div>
                </div>
            </nav>

            <div className='landingMainContainer'>
                <div> <h1><span style={{ color: " #b26308" }}> Connect</span> with your loved Ones </h1>
                <p>Cover a distance by GenZ Video Call</p>
                <div className='linkContainer' role='button'>
                    <Link className='link_button' to={"/auth"}>Get Stated</Link>
                </div>
                </div>
                
                
                <div>
                    <img className='image_call' src="/photo1.png" alt="image" />
                    <img className='image_call1' src="/photo2.png" alt="image" />
                </div>
            </div>

        </div>
    )
}