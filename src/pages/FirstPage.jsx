import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../component/UI/Card';
import './FirstPage.css';

export function FirstPage() {
    const navigate = useNavigate();

    const categories = [
        { name: 'Retail', id: 'retail', icon: '🛍️' },
        { name: 'Pantry', id: 'pantry', icon: '🍞' },
        { name: 'Salon Products in Pantry', id: 'salon_products_in_pantry', icon: '🧴' },
        { name: 'Colours', id: 'colours', icon: '🎨' },
        { name: 'Men Hairwash', id: 'men_hairwash', icon: '💇‍♂️' },
        { name: 'Men Facial Room', id: 'men_facial_room', icon: '🧖‍♂️' },
        { name: 'Nail Art', id: 'nail_art', icon: '💅' },
        { name: 'Bridal', id: 'bridal', icon: '👰' }
    ];

    return (
        <div className='dashboard'>
            <div><h1>Dashboard</h1></div>
            <div className="dashboard-grid">
                {categories.map((category) => (
                    <Card
                        key={category.name}
                        className="dashboard-card"
                        onClick={() => navigate(`/stocks?location=${encodeURIComponent(category.id)}`)}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <h2 className="category-title">{category.name}</h2>
                    </Card>
                ))}
            </div>
        </div>
    );
}