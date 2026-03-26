import React, { useState } from 'react';
import api from '../api/api';
import { Upload, CheckCircle, CreditCard, X, Check } from 'lucide-react';
import scannerImg from '../assets/scanner.jpg';

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
    const [showScanner, setShowScanner] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [transactionId, setTransactionId] = useState('');

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
            const res = await api.post('/api/orders', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCreatedOrder(res.data);
            setSuccess(true);
            setFormData({ customerName: '', email: '', details: '', referencePhoto: null });
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending order');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentConfirm = async () => {
        if (!createdOrder) return;
        if (!transactionId.trim()) {
            alert('Please enter the Transaction ID.');
            return;
        }

        try {
            const res = await api.put(`/api/orders/pay/${createdOrder._id}`, { transactionId });
            setCreatedOrder(res.data);
            alert('Payment Proof Submitted! We will verify it shortly.');
            setShowScanner(false);
        } catch (err) {
            alert('Error recording payment. Please try again or contact support.');
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
                        <p>I will review your request and contact you shortly.</p>

                        {(createdOrder && (createdOrder.isPaid || createdOrder.transactionId)) ? (
                            <div style={{ marginTop: '20px', padding: '15px', background: '#d4efdf', borderRadius: '4px', color: '#145a32', fontWeight: 'bold' }}>
                                <Check size={20} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Payment Submitted for Verification
                            </div>
                        ) : (
                            <button className="btn" style={{ marginTop: '20px', background: '#2980b9', width: '100%' }} onClick={() => setShowScanner(true)}>
                                <CreditCard size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Pay Now to Fast-Track
                            </button>
                        )}

                        <button className="btn" style={{ marginTop: '10px', background: 'transparent', color: '#666', border: '1px solid #ddd' }} onClick={() => setSuccess(false)}>
                            Send Another Request
                        </button>
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

                {showScanner && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="fade-in" style={{
                            background: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px',
                            textAlign: 'center', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                            maxHeight: '90vh', overflowY: 'auto'
                        }}>
                            <button onClick={() => setShowScanner(false)} style={{
                                position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none',
                                cursor: 'pointer', color: '#888'
                            }}>
                                <X size={24} />
                            </button>

                            <h2 style={{ marginBottom: '20px' }}>Scan to Pay</h2>
                            <div style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px', display: 'inline-block', marginBottom: '20px' }}>
                                <img src={scannerImg} alt="Payment Scanner" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                            </div>

                            <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                                Scan the QR code, make the payment, and enter the Reference/Transaction ID below.
                            </p>

                            <input
                                type="text"
                                placeholder="Enter Transaction ID / Ref No."
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '20px' }}
                            />

                            <button onClick={handlePaymentConfirm} className="btn" style={{ width: '100%', background: '#27ae60' }}>
                                <Check size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Submit Payment Proof
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Commission;
