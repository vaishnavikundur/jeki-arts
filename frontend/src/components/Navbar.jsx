import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <Palette color="#e67e22" />
                    <span>Elena Artistry</span>
                </Link>
                <div style={{ display: 'flex', gap: '25px' }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/commission" className="nav-link">Commission</Link>
                    <Link to="/admin-login" className="nav-link">Admin</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
