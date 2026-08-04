import React from 'react'
import "../App.css";

export default function LandingPage(){
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'><h2>GenZ Video Call</h2></div>
                <div className='navlist'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

        </div>
    )
}