import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Image, List, Check, X, Upload } from 'lucide-react';

const Dashboard = () => {
    const [tab, setTab] = useState('orders'); // 'orders', 'upload', 'gallery'
    const [orders, setOrders] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [artData, setArtData] = useState({ title: '', description: '', category: 'Oil Painting', price: '', image: null, status: 'Available' });
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('adminAuthenticated')) {
            navigate('/admin-login');
        } else {
            fetchOrders();
            fetchGallery();
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

    const fetchGallery = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/art');
            setGallery(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (status === 'Cancelled' && !window.confirm('Are you sure you want to cancel this order?')) return;
        
        let priceDetails = '';
        if (status === 'Accepted') {
            priceDetails = prompt('Enter customized price details for this commission:\n(e.g., "$50 for full body, $30 for half body")');
            if (priceDetails === null) return; // User cancelled prompt
        }

        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status, priceDetails });
            fetchOrders(); // refresh
        } catch (Err) {
            alert('Error updating status');
        }
    };

    const handleDeleteArt = async (id) => {
        if (!window.confirm('Are you sure you want to delete this artwork?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/art/${id}`);
            fetchGallery();
            alert('Artwork Deleted');
        } catch (err) {
            alert('Error deleting artwork');
        }
    };

    const handleArtSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', artData.title);
        data.append('description', artData.description);
        data.append('category', artData.category);
        if (artData.image) data.append('image', artData.image);
        data.append('price', artData.price);
        data.append('status', artData.status);

        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/art/${editId}`, data);
                alert('Artwork Updated!');
            } else {
                await axios.post('http://localhost:5000/api/art', data);
                alert('Artwork Uploaded!');
            }
            setArtData({ title: '', description: '', category: 'Oil Painting', price: '', image: null, status: 'Available' });
            setEditId(null);
            fetchGallery();
            if (editId) setTab('gallery'); // Go back to gallery if editing, else stay on upload to add more? Or maybe better to stay on upload form
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error saving art. Please check all fields.');
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
                    <button className={`btn ${tab !== 'gallery' ? 'btn-outline' : ''}`} onClick={() => setTab('gallery')}><Image size={18} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Manage Gallery</button>
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
                                                <td style={{ padding: '15px 10px' }}>
                                                    {order.customerName}<br />
                                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>{order.email}</span><br />
                                                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#333', background: '#eee', padding: '2px 4px', borderRadius: '3px' }}>ID: {order._id}</span>
                                                </td>
                                                <td style={{ padding: '15px 10px', maxWidth: '300px' }}>
                                                    {order.details}
                                                    {order.priceDetails && (
                                                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#555', background: '#f9f9f9', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #3498db' }}>
                                                            <strong>Price Quoted:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{order.priceDetails}</span>
                                                            <br />
                                                            <strong style={{ display: 'inline-block', marginTop: '4px' }}>Agreed by Customer:</strong> {order.customerAgreed ? <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Yes</span> : <span style={{ color: '#e67e22', fontWeight: 'bold' }}>Pending</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    {order.referencePhoto ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                            <a href={`http://localhost:5000${order.referencePhoto}`} target="_blank" rel="noopener noreferrer" style={{ color: '#e67e22', fontSize: '0.9rem' }}>View</a>
                                                            <a href={`http://localhost:5000${order.referencePhoto}`} download={`Reference_${order._id}`} style={{ color: '#3498db', fontSize: '0.9rem' }}>Download</a>
                                                        </div>
                                                    ) : 'None'}
                                                </td>
                                                <td style={{ padding: '15px 10px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        background: order.status === 'Accepted' ? '#d4efdf' : order.status === 'Declined' ? '#fadbd8' : order.status === 'Cancelled' ? '#ebedef' : '#fdebd0',
                                                        color: order.status === 'Accepted' ? '#145a32' : order.status === 'Declined' ? '#78281f' : order.status === 'Cancelled' ? '#5d6d7e' : '#9a7d0a'
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
                                                    {order.status !== 'Cancelled' && order.status !== 'Declined' && (
                                                        <button title="Cancel Order" onClick={() => handleStatusUpdate(order._id, 'Cancelled')} style={{ marginTop: '5px', background: 'transparent', border: '1px solid #999', color: '#666', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'block', width: '100%', marginBottom: '5px' }}>Cancel</button>
                                                    )}
                                                    <button title="Delete Permanently" onClick={async () => {
                                                        if (!window.confirm('Delete this order permanently?')) return;
                                                        try {
                                                            await axios.delete(`http://localhost:5000/api/orders/${order._id}`);
                                                            fetchOrders();
                                                        } catch (e) { alert('Error deleting order'); }
                                                    }} style={{ background: 'transparent', border: '1px solid #c0392b', color: '#c0392b', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'block', width: '100%' }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : tab === 'upload' ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>{editId ? 'Edit Artwork' : 'Upload New Artwork'}</h2>
                                {editId && <button onClick={() => { setEditId(null); setArtData({ title: '', description: '', category: 'Oil Painting', price: '', image: null, status: 'Available' }); }} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>}
                            </div>
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
                                        <option>Sketch</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                                    <textarea value={artData.description} onChange={e => setArtData({ ...artData, description: e.target.value })} rows="4"
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}></textarea>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Price ($)</label>
                                    <input type="number" value={artData.price} onChange={e => setArtData({ ...artData, price: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Status</label>
                                    <select value={artData.status} onChange={e => setArtData({ ...artData, status: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Image {editId && '(Leave empty to keep existing)'}</label>
                                    {editId && !artData.image && (
                                        <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666', border: '1px solid #eee', padding: '10px', borderRadius: '4px', background: '#f9f9f9' }}>
                                            <p style={{ margin: 0 }}>Current Image:</p>
                                            <div style={{ marginTop: '5px', height: '60px', width: '60px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                                {/* We don't have the URL easily here unless we keep it in state, let's just say 'Saved' or try to show it if we store it */}
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#555' }}>
                                                    Saved
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        key={editId || 'new'} // Force reset on mode change
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setArtData({ ...artData, image: e.target.files[0] })}
                                        style={{ width: '100%' }}
                                        required={!editId}
                                    />
                                </div>
                                <button type="submit" className="btn">{editId ? 'Update Artwork' : 'Upload Artwork'}</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2>Manage Gallery</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                                {gallery.map(art => (
                                    <div key={art._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                                        <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <h4 style={{ margin: '10px 0 5px', fontSize: '1rem' }}>{art.title}</h4>
                                        <p style={{ margin: '0 0 10px', color: '#666', fontSize: '0.9rem' }}>${art.price}</p>
                                        <p style={{ fontSize: '0.8rem', color: art.status === 'Available' ? 'green' : 'red', marginBottom: '10px' }}>{art.status}</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => {
                                                setEditId(art._id);
                                                setArtData({ title: art.title, description: art.description, category: art.category, price: art.price, image: null, status: art.status });
                                                setTab('upload');
                                                window.scrollTo(0, 0);
                                            }} style={{ flex: 1, background: '#3498db', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDeleteArt(art._id)} style={{ flex: 1, background: '#e74c3c', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
