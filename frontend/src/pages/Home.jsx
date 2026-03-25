import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import scannerImg from '../assets/scanner.jpg';

const Home = () => {
    const [artworks, setArtworks] = useState([]);
    const [selectedArt, setSelectedArt] = useState(null);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [buyerDetails, setBuyerDetails] = useState({ name: '', email: '', transactionId: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchArt();
    }, []);

    const fetchArt = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/art');
            setArtworks(res.data);
        } catch (err) {
            console.error('Error fetching art:', err);
        }
    };

    const handleBuyClick = (art) => {
        setSelectedArt(art);
        setShowBuyModal(true);
    };

    const handleConfirmPurchase = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!buyerDetails.transactionId) {
            alert('Please enter Transaction ID');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/art/buy/${selectedArt._id}`, {
                customerName: buyerDetails.name,
                email: buyerDetails.email,
                transactionId: buyerDetails.transactionId
            });
            alert('Purchase Successful! We will verify your payment.');
            setShowBuyModal(false);
            setBuyerDetails({ name: '', email: '', transactionId: '' });
            fetchArt();
        } catch (err) {
            alert(err.response?.data?.message || 'Error buying art');
        } finally {
            setLoading(false);
        }
    };

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
                                        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>
                                            {art.category}
                                            {art.price > 0 && <span style={{ float: 'right', fontWeight: 'bold', color: '#e67e22' }}>${art.price}</span>}
                                        </p>
                                        {art.status === 'Sold' ? (
                                            <button disabled style={{ width: '100%', background: '#bdc3c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'not-allowed' }}>SOLD</button>
                                        ) : (
                                            <button onClick={() => handleBuyClick(art)} style={{ width: '100%', background: '#27ae60', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' }}>
                                                Buy Now
                                            </button>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {/* Buy Modal */}
            {showBuyModal && selectedArt && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="fade-in" style={{
                        background: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '450px',
                        position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button onClick={() => setShowBuyModal(false)} style={{
                            position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none',
                            cursor: 'pointer', color: '#888'
                        }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '10px', paddingRight: '20px' }}>Purchase Artwork</h2>
                        <p style={{ marginBottom: '20px', color: '#666' }}>{selectedArt.title} - <strong style={{ color: '#e67e22' }}>${selectedArt.price}</strong></p>

                        <form onSubmit={handleConfirmPurchase}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Your Name</label>
                                <input type="text" required value={buyerDetails.name} onChange={e => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
                                <input type="email" required value={buyerDetails.email} onChange={e => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>

                            <div style={{ textAlign: 'center', margin: '20px 0', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <p style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>Scan to Pay</p>
                                <img src={scannerImg} alt="QR Code" style={{ maxWidth: '150px', display: 'inline-block', border: '1px solid #eee', padding: '5px', borderRadius: '4px' }} />
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Scan with your payment app</p>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Transaction / Reference ID</label>
                                <input type="text" required value={buyerDetails.transactionId} onChange={e => setBuyerDetails({ ...buyerDetails, transactionId: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Enter ID from payment app" />
                            </div>

                            <button type="submit" className="btn" style={{ width: '100%', background: '#27ae60' }} disabled={loading}>
                                {loading ? 'Processing...' : <span><Check size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Confirm Purchase</span>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
