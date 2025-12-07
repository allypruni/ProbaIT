import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src="/logo.png.png" alt="Pimp Your Grill" className="navbar-logo-img" />
                </NavLink>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/best-grills" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Best Grills
                    </NavLink>
                </li>
                
                {/* Link-uri pentru utilizator autentificat */}
                {user ? (
                    <>
                        <li>
                            <NavLink 
                                to="/profile" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                👤 {user.name || 'Profile'}
                            </NavLink>
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        {/* Link-uri pentru vizitator */}
                        <li>
                            <NavLink 
                                to="/login" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/register" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Register
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
