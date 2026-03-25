import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // In a real app, use better auth flow
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (res.data.userId) {
                localStorage.setItem('adminAuthenticated', 'true');
                navigate('/admin');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ padding: '100px 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                </div>
            </form>
        </div>
    );
};

export default Login;
