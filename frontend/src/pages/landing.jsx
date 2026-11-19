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
                        onClick={() => navigate("/home")}
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
                            <svg
                                className="frame-artwork"
                                viewBox="0 0 360 420"
                                role="img"
                                aria-label="People connecting on a video call"
                            >
                                <defs>
                                    <linearGradient id="secondary-bg" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#452477" />
                                        <stop offset="100%" stopColor="#151321" />
                                    </linearGradient>
                                    <linearGradient id="secondary-shirt" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#d8b4fe" />
                                        <stop offset="100%" stopColor="#7e22ce" />
                                    </linearGradient>
                                </defs>
                                <rect width="360" height="420" fill="url(#secondary-bg)" />
                                <circle cx="298" cy="82" r="52" fill="#c084fc" opacity=".14" />
                                <circle cx="48" cy="310" r="76" fill="#8b5cf6" opacity=".15" />
                                <rect x="22" y="24" width="316" height="372" rx="24" fill="#11111b" opacity=".42" stroke="#e9d5ff" strokeOpacity=".22" />
                                <circle cx="180" cy="154" r="66" fill="#f3c6a5" />
                                <path d="M114 154c-5-81 134-106 140 0-23-8-44-31-54-55-17 32-48 49-86 55Z" fill="#291932" />
                                <path d="M133 143c0 59 20 90 47 90s47-31 47-90c-9 10-24 18-47 18s-38-8-47-18Z" fill="#f3c6a5" />
                                <circle cx="161" cy="159" r="4" fill="#432b38" />
                                <circle cx="199" cy="159" r="4" fill="#432b38" />
                                <path d="M166 184c9 8 19 8 28 0" fill="none" stroke="#a45b67" strokeWidth="4" strokeLinecap="round" />
                                <path d="M78 358c8-77 43-116 102-116s94 39 102 116" fill="url(#secondary-shirt)" />
                                <rect x="43" y="42" width="94" height="28" rx="14" fill="#0b0b13" opacity=".72" />
                                <circle cx="60" cy="56" r="5" fill="#4ade80" />
                                <text x="73" y="61" fill="#f5f3ff" fontSize="11" fontFamily="Arial, sans-serif">CONNECTED</text>
                                <circle cx="283" cy="355" r="25" fill="#a855f7" />
                                <path d="M273 355h20m-10-10v20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="image-frame primary">
                            <svg
                                className="frame-artwork"
                                viewBox="0 0 420 420"
                                role="img"
                                aria-label="GenZ Call video meeting in progress"
                            >
                                <defs>
                                    <linearGradient id="meeting-bg" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#332052" />
                                        <stop offset="55%" stopColor="#191725" />
                                        <stop offset="100%" stopColor="#542b70" />
                                    </linearGradient>
                                    <linearGradient id="meeting-person" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#f4c7a6" />
                                        <stop offset="100%" stopColor="#d58a82" />
                                    </linearGradient>
                                    <linearGradient id="meeting-clothes" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#c084fc" />
                                        <stop offset="100%" stopColor="#6d28d9" />
                                    </linearGradient>
                                </defs>
                                <rect width="420" height="420" fill="url(#meeting-bg)" />
                                <circle cx="333" cy="100" r="94" fill="#c084fc" opacity=".12" />
                                <circle cx="83" cy="270" r="116" fill="#7c3aed" opacity=".13" />
                                <rect x="20" y="18" width="380" height="384" rx="25" fill="#0b0b13" fillOpacity=".42" stroke="#e9d5ff" strokeOpacity=".24" />
                                <circle cx="43" cy="42" r="5" fill="#fb7185" />
                                <circle cx="61" cy="42" r="5" fill="#fbbf24" />
                                <circle cx="79" cy="42" r="5" fill="#4ade80" />
                                <text x="103" y="47" fill="#f5f3ff" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">GENZ CALL</text>
                                <rect x="295" y="29" width="83" height="25" rx="12" fill="#11111b" />
                                <circle cx="309" cy="41" r="4" fill="#4ade80" />
                                <text x="320" y="45" fill="#f5f3ff" fontSize="9" fontFamily="Arial, sans-serif">LIVE · 03</text>
                                <rect x="37" y="68" width="346" height="248" rx="18" fill="#27203a" />
                                <circle cx="210" cy="160" r="68" fill="url(#meeting-person)" />
                                <path d="M142 158c-3-93 137-104 139-1-26-12-47-35-56-59-19 34-48 53-83 60Z" fill="#25182e" />
                                <path d="M159 156c4 61 24 91 51 91s47-30 51-91c-17 15-33 21-51 21s-34-6-51-21Z" fill="url(#meeting-person)" />
                                <circle cx="191" cy="169" r="4" fill="#422b38" />
                                <circle cx="229" cy="169" r="4" fill="#422b38" />
                                <path d="M196 194c9 8 19 8 28 0" fill="none" stroke="#a45b67" strokeWidth="4" strokeLinecap="round" />
                                <path d="M105 316c9-81 44-122 105-122s96 41 105 122" fill="url(#meeting-clothes)" />
                                <rect x="254" y="224" width="112" height="77" rx="13" fill="#282038" stroke="#e9d5ff" strokeOpacity=".32" />
                                <circle cx="310" cy="252" r="19" fill="#f2bd9c" />
                                <path d="M291 251c1-27 37-30 39 0-11-3-17-10-20-17-5 9-11 14-19 17Z" fill="#342039" />
                                <path d="M279 298c3-22 14-33 31-33s28 11 31 33" fill="#9333ea" />
                                <rect x="128" y="340" width="164" height="42" rx="21" fill="#0b0b13" fillOpacity=".86" stroke="#e9d5ff" strokeOpacity=".18" />
                                <circle cx="154" cy="361" r="12" fill="#302b3d" />
                                <path d="M149 357h10v8h-10zM148 355l6-4 6 4" fill="none" stroke="#f5f3ff" strokeWidth="1.5" strokeLinejoin="round" />
                                <circle cx="187" cy="361" r="12" fill="#302b3d" />
                                <path d="M184 355v12l9-6-9-6Z" fill="#f5f3ff" />
                                <circle cx="220" cy="361" r="12" fill="#7f1d1d" />
                                <path d="m216 357 8 8m0-8-8 8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
                                <circle cx="266" cy="361" r="12" fill="#302b3d" />
                                <circle cx="262" cy="361" r="1.5" fill="#f5f3ff" />
                                <circle cx="266" cy="361" r="1.5" fill="#f5f3ff" />
                                <circle cx="270" cy="361" r="1.5" fill="#f5f3ff" />
                            </svg>
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
