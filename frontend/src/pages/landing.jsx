// import React from 'react'
// import { Link, useNavigate } from "react-router-dom";
// import "../App.css";

// export default function LandingPage(){

//     const router = useNavigate()
//     return (
//         <div className='landingPageContainer'>
//             <nav>
//                 <div className='navHeader'><h2>GenZ Video Call</h2></div>
//                 <div className='navlist'>
//                     <p onClick={()=>{
//                         router("/guest")
//                     }}>Join as Guest</p>
//                     <p onClick={()=>{
//                         router("/auth")
//                     }}>Register</p>
//                     <div  role='button' >
//                         <p onClick={()=>{
//                             router("/auth")
//                         }}>Login</p>
//                     </div>
//                 </div>
//             </nav>

//             <div className='landingMainContainer'>
//                 <div> <h1><span style={{ color: " #b26308" }}> Connect</span> with your loved Ones </h1>
//                 <p>Cover a distance by GenZ Video Call</p>
//                 <div className='linkContainer' role='button'>
//                     <Link className='link_button' to={"/auth"}>Get Stated</Link>
//                 </div>
//                 </div>
                
                
//                 <div>
//                     <img className='image_call' src="/photo1.png" alt="image" />
//                     <img className='image_call1' src="/photo2.png" alt="image" />
//                 </div>
//             </div>

//         </div>
//     )
// }

import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../App.css'

/**
 * GenZ Video Call Landing Page
 * Redesigned for high-fidelity, premium look while preserving all React logic.
 * 
 * Features:
 * - Responsive navigation with glassmorphism
 * - Hero section with balanced visual weight
 * - Modern typography and consistent spacing
 * - High-quality image integration
 */
export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className='landing-page-wrapper'>
            {/* Navigation Bar */}
            <nav className="main-nav">
                <div className='nav-logo'>
                    <h2>GenZ <span className="text-accent">Video Call</span></h2>
                </div>
                <div className='nav-actions'>
                    <button 
                        className="nav-link" 
                        onClick={() => navigate("/guest")}
                    >
                        Join as Guest
                    </button>
                    <button 
                        className="nav-link" 
                        onClick={() => navigate("/auth")}
                    >
                        Register
                    </button>
                    <button 
                        className="nav-btn-primary" 
                        onClick={() => navigate("/auth")}
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className='hero-section'>
                <div className="hero-content">
                    <div className="hero-badge">Next Gen Connection</div>
                    <h1 className="hero-title">
                        <span className="text-accent">Connect</span> with your loved ones
                    </h1>
                    <p className="hero-description">
                        Experience crystal clear communication. Cover the distance with the next generation of video calling.
                    </p>
                    <div className='hero-cta'>
                        <Link className='btn-main' to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                
                {/* Visual Section */}
                <div className="hero-visuals">
                    <div className="image-stack">
                        <div className="image-frame secondary">
                             <img src="../photo1.png" alt="People laughing on call" />
                        </div>
                        <div className="image-frame primary">
                             <img src="photo2.png" alt="Connecting globally" />
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="blob-decoration"></div>
                </div>
            </main>

            {/* Background Decorations */}
            <div className="bg-overlay"></div>
        </div>
    );
}
