import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../component/UI/Card';
import { dashboardService } from '../services/api';
import './Dashboard.css';

export function Dashboard() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                const response = await dashboardService.getLocations();
                setLocations(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching locations:', err);
                setError('Failed to load locations');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    if (loading) {
        return (
            <div className='dashboard'>
                <div><h1>Dashboard</h1></div>
                <div className="dashboard-loading">Loading locations...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='dashboard'>
                <div><h1>Dashboard</h1></div>
                <div className="dashboard-error">{error}</div>
            </div>
        );
    }

    return (
        <div className='dashboard'>
            <div><h1>Dashboard</h1></div>
            <div className="dashboard-grid">
                {locations.map((location) => (
                    <Card
                        key={location.id}
                        className="dashboard-card"
                        onClick={() => navigate(`/stocks?locationId=${location.id}`)}
                    >
                        <div className="category-icon">{location.icon || '📦'}</div>
                        <h2 className="category-title">{location.name}</h2>
                    </Card>
                ))}
            </div>
        </div>
    );
}