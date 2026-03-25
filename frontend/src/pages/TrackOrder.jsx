import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CreditCard, XCircle, Check, X } from 'lucide-react';
import scannerImg from '../assets/scanner.jpg';

const TrackOrder = () => {
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const orderIdParam = params.get('orderId');
        
        if (emailParam) setEmail(emailParam);
        if (orderIdParam) setOrderId(orderIdParam);
        
        if (emailParam && orderIdParam) {
            fetchOrderData(emailParam, orderIdParam);
        }
    }, []);

    const fetchOrderData = async (queryEmail, queryOrderId) => {
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const res = await axios.post('https://jeki-arts.onrender.com/api/orders/track', { email: queryEmail, orderId: queryOrderId });
            setOrder(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Order not found');
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        fetchOrderData(email, orderId);
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const res = await axios.put(`https://jeki-arts.onrender.com/api/orders/cancel-customer/${order._id}`, { email });
            setOrder(res.data);
            alert('Order cancelled successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Error cancelling order');
        }
    };

    const handlePayment = () => {
        setShowScanner(true);
    };

    const confirmPayment = async () => {
        if (!order) return;
        if (!transactionId.trim()) {
            alert('Please enter the Transaction ID.');
            return;
        }

        try {
            const res = await axios.put(`https://jeki-arts.onrender.com/api/orders/pay/${order._id}`, { transactionId });
            setOrder(res.data);
            alert('Payment Proof Submitted! We will verify it shortly.');
            setShowScanner(false);
        } catch (err) {
            alert('Payment failed to record.');
        }
    };

    const handleAgree = async () => {
        if (!window.confirm('Are you sure you agree to these price details?')) return;
        try {
            const res = await axios.put(`https://jeki-arts.onrender.com/api/orders/agree/${order._id}`, { email });
            setOrder(res.data);
            alert('Agreed! You can now proceed to payment.');
        } catch (err) {
            alert(err.response?.data?.message || 'Error agreeing to price');
        }
    };

    return (
        <div style={{ padding: '80px 0', minHeight: '60vh' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Track Your Order</h1>

                <form onSubmit={handleTrack} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Order ID</label>
                        <input type="text" required value={orderId} onChange={e => setOrderId(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Received in email" />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Searching...' : <span><Search size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Track Order</span>}
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
                </form>

                {order && (
                    <div className="fade-in" style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>Order Status</h3>
                            <span style={{
                                padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem',
                                background: order.status === 'Accepted' ? '#d4efdf' : order.status === 'Declined' ? '#fadbd8' : order.status === 'Cancelled' ? '#ebedef' : '#fdebd0',
                                color: order.status === 'Accepted' ? '#145a32' : order.status === 'Declined' ? '#78281f' : order.status === 'Cancelled' ? '#5d6d7e' : '#9a7d0a'
                            }}>{order.status}</span>
                        </div>

                        <p><strong>Ref:</strong> {order._id}</p>
                        <p><strong>Details:</strong> {order.details}</p>
                        {order.referencePhoto && <p><strong>File:</strong> Uploaded</p>}

                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            {order.status === 'Pending' && (
                                <button onClick={handleCancel} style={{ background: 'transparent', border: '1px solid #c0392b', color: '#c0392b', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                                    <XCircle size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Cancel Order
                                </button>
                            )}

                            {order.status === 'Accepted' && !order.customerAgreed && (
                                <div className="fade-in" style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #3498db', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Price Quoted by Artist</h4>
                                    <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 15px 0', color: '#555', fontSize: '0.95rem' }}>{order.priceDetails || 'No specific details provided. Base price applies.'}</p>
                                    <button onClick={handleAgree} className="btn" style={{ width: '100%', background: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> I Agree to this Price
                                    </button>
                                </div>
                            )}

                            {order.status === 'Accepted' && order.customerAgreed && !order.isPaid && !order.transactionId && (
                                <button onClick={handlePayment} className="btn" style={{ width: '100%', background: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Pay Now to Start
                                </button>
                            )}

                            {order.status === 'Accepted' && order.customerAgreed && (order.isPaid || order.transactionId) && (
                                <div style={{ textAlign: 'center', color: '#27ae60', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> {order.isPaid ? 'Paid - Processing' : 'Payment Submitted for Verification'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

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

                        <button onClick={confirmPayment} className="btn" style={{ width: '100%', background: '#27ae60' }}>
                            <Check size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Submit Payment Proof
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrder;
