import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        const fetchArt = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/art');
                setArtworks(res.data);
            } catch (err) {
                console.error('Error fetching art:', err);
            }
        };
        fetchArt();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(to right, #fdfbfb 0%, #ebedee 100%)',
                padding: '100px 0',
                textAlign: 'center'
            }} className="fade-in">
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: '#2c3e50' }}>
                        Transform Your Vision Into <span style={{ color: '#d35400', fontStyle: 'italic' }}>Timeless Art</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Specializing in oil paintings and custom commissions. Capture your most cherished memories on canvas.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/commission" className="btn">Start Your Commission <ArrowRight size={18} style={{ marginLeft: 5 }} /></Link>
                        <button className="btn btn-outline" onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}>View Gallery</button>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>Selected Works</h2>

                    {artworks.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>No artwork uploaded yet. (Admin needs to upload)</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '30px'
                        }}>
                            {artworks.map(art => (
                                <div key={art._id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: '0.3s' }}>
                                    <div style={{ height: '300px', overflow: 'hidden' }}>
                                        <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div style={{ padding: '20px', background: '#fff' }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{art.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#888' }}>{art.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
