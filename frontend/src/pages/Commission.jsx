import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle } from 'lucide-react';

const Commission = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        details: '',
        referencePhoto: null
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, referencePhoto: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('customerName', formData.customerName);
        data.append('email', formData.email);
        data.append('details', formData.details);
        if (formData.referencePhoto) {
            data.append('referencePhoto', formData.referencePhoto);
        }

        try {
            await axios.post('http://localhost:5000/api/orders', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setFormData({ customerName: '', email: '', details: '', referencePhoto: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '80px 0', background: '#fcfcfc' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Request a Commission</h1>
                <p style={{ textAlign: 'center', marginBottom: '50px', color: '#666' }}>
                    Bring your ideas to life. Fill out the form below and I'll get back to you with a quote.
                </p>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#e8f8f5', borderRadius: '8px' }}>
                        <CheckCircle size={50} color="#2ecc71" style={{ marginBottom: '20px' }} />
                        <h2>Request Sent Successfully!</h2>
                        <p>I will review your request and contact you at {formData.email || 'your email'} shortly.</p>
                        <button className="btn" style={{ marginTop: '20px' }} onClick={() => setSuccess(false)}>Send Another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        {error && <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Your Name</label>
                            <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange}
                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Project Details</label>
                            <textarea name="details" rows="5" required value={formData.details} onChange={handleChange} placeholder="Describe your vision, size preference, etc."
                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }}></textarea>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Reference Photo (Optional)</label>
                            <div style={{ border: '2px dashed #ddd', padding: '30px', textAlign: 'center', borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => document.getElementById('fileInput').click()}>
                                <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                                {formData.referencePhoto ? (
                                    <p style={{ color: '#2ecc71' }}>{formData.referencePhoto.name}</p>
                                ) : (
                                    <>
                                        <Upload color="#999" size={30} style={{ marginBottom: '10px' }} />
                                        <p style={{ color: '#999' }}>Click to Upload Image</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Submit Request'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Or Reach Me Directly</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>WhatsApp / Phone</p>
                            <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" style={{ color: '#e67e22' }}>+1 (555) 123-4567</a>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Email</p>
                            <a href="mailto:contact@elenaartistry.com" style={{ color: '#e67e22' }}>contact@elenaartistry.com</a>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Instagram</p>
                            <a href="https://instagram.com/elena_artistry" target="_blank" rel="noopener noreferrer" style={{ color: '#e67e22' }}>@elena_artistry</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commission;
