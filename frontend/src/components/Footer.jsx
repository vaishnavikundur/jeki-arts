import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '40px 0', textAlign: 'center', backgroundColor: '#f9f9f9', marginTop: '60px' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                    <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    <a href="mailto:contact@elenaartistry.com">Email</a>
                    <a href="https://instagram.com/elena_artistry" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
                <p style={{ color: '#777' }}>&copy; {new Date().getFullYear()} Elena Artistry. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
