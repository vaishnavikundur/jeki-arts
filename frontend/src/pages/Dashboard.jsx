import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Image, List, Check, X, Upload } from 'lucide-react';

const Dashboard = () => {
    const [tab, setTab] = useState('orders'); // 'orders' or 'upload'
    const [orders, setOrders] = useState([]);
    const [artData, setArtData] = useState({ title: '', description: '', category: 'Oil Painting', image: null });
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('adminAuthenticated')) {
            navigate('/admin-login');
        } else {
            fetchOrders();
        }
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
            fetchOrders(); // refresh
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleArtSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', artData.title);
        data.append('description', artData.description);
        data.append('category', artData.category);
        data.append('image', artData.image);

        try {
            await axios.post('http://localhost:5000/api/art', data);
            alert('Artwork Uploaded!');
            setArtData({ title: '', description: '', category: 'Oil Painting', image: null });
        } catch (err) {
            alert('Error uploading art');
        }
    };

    return (
        <div style={{ padding: '60px 0', minHeight: '80vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>Admin Dashboard</h1>
                    <button onClick={() => { localStorage.removeItem('adminAuthenticated'); navigate('/admin-login'); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <button className={`btn ${tab !== 'orders' ? 'btn-outline' : ''}`} onClick={() => setTab('orders')}><List size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Orders</button>
                    <button className={`btn ${tab !== 'upload' ? 'btn-outline' : ''}`} onClick={() => setTab('upload')}><Upload size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Upload Art</button>
                </div>

                <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                    {tab === 'orders' ? (
                        <div>
                            <h2>Received Commissions</h2>
                            {orders.length === 0 ? <p style={{ color: '#999' }}>No orders yet.</p> : (
                                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                            <th style={{ padding: '10px' }}>Customer</th>
                                            <th style={{ padding: '10px' }}>Details</th>
                                            <th style={{ padding: '10px' }}>Ref Photo</th>
                                            <th style={{ padding: '10px' }}>Status</th>
                                            <th style={{ padding: '10px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '15px 10px' }}>{order.customerName}<br /><span style={{ fontSize: '0.8rem', color: '#999' }}>{order.email}</span></td>
                                                <td style={{ padding: '15px 10px', maxWidth: '300px' }}>{order.details}</td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    {order.referencePhoto ? (
                                                        <a href={`http://localhost:5000${order.referencePhoto}`} target="_blank" rel="noopener noreferrer" style={{ color: '#e67e22' }}>View Image</a>
                                                    ) : 'None'}
                                                </td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        background: order.status === 'Accepted' ? '#d4efdf' : order.status === 'Declined' ? '#fadbd8' : '#fdebd0',
                                                        color: order.status === 'Accepted' ? '#145a32' : order.status === 'Declined' ? '#78281f' : '#9a7d0a'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    {order.status === 'Pending' && (
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button title="Accept" onClick={() => handleStatusUpdate(order._id, 'Accepted')} style={{ background: '#27ae60', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>
                                                            <button title="Decline" onClick={() => handleStatusUpdate(order._id, 'Declined')} style={{ background: '#c0392b', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2>Upload New Artwork</h2>
                            <form onSubmit={handleArtSubmit} style={{ maxWidth: '600px', marginTop: '20px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                                    <input type="text" required value={artData.title} onChange={e => setArtData({ ...artData, title: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
                                    <select value={artData.category} onChange={e => setArtData({ ...artData, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <option>Oil Painting</option>
                                        <option>Acrylic</option>
                                        <option>Digital Art</option>
                                        <option>Sketch</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                                    <textarea value={artData.description} onChange={e => setArtData({ ...artData, description: e.target.value })} rows="4"
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}></textarea>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Image</label>
                                    <input type="file" required accept="image/*" onChange={e => setArtData({ ...artData, image: e.target.files[0] })}
                                        style={{ width: '100%' }} />
                                </div>
                                <button type="submit" className="btn">Upload Artwork</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
