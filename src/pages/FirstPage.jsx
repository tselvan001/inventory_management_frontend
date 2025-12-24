import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../component/UI/Card';
import './FirstPage.css';

export function FirstPage() {
    const navigate = useNavigate();

    const categories = [
        { name: 'Pantry', icon: '🍞' },
        { name: 'Retail', icon: '🛍️' },
        { name: 'Hair', icon: '💇‍♀️' },
        { name: 'Skin', icon: '🧴' },
        { name: 'Oil', icon: '🛢️' },
        { name: 'Pedicure', icon: '💅' }
    ];

    return (
        <div className='dashboard'>
            <div><h1>Dashboard</h1></div>
            <div className="dashboard-grid">
                {categories.map((category) => (
                    <Card
                        key={category.name}
                        className="dashboard-card"
                        onClick={() => navigate(`/stocks?location=${encodeURIComponent(category.name)}`)}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <h2 className="category-title">{category.name}</h2>
                    </Card>
                ))}
            </div>
        </div>
    );
}