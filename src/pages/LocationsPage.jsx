import React, { useState, useEffect } from 'react';
import { locationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './LocationsPage.css';

export function LocationsPage() {
    const { hasPermission } = useAuth();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        type: 'NON_RETAIL'
    });

    const canManage = hasPermission('MANAGE_LOCATION');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await locationService.getAll();
            setLocations(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError('Failed to load locations');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (location = null) => {
        if (location) {
            setEditingLocation(location);
            setFormData({
                name: location.name || '',
                icon: location.icon || '',
                type: location.type || 'NON_RETAIL'
            });
        } else {
            setEditingLocation(null);
            setFormData({
                name: '',
                icon: '',
                type: 'NON_RETAIL'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLocation(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLocation) {
                await locationService.update(editingLocation.id, formData);
            } else {
                await locationService.create(formData);
            }
            handleCloseModal();
            fetchLocations();
        } catch (err) {
            console.error('Error saving location:', err);
            setError('Failed to save location');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to archive this location?')) return;
        try {
            await locationService.delete(id);
            fetchLocations();
        } catch (err) {
            console.error('Error deleting location:', err);
            setError('Failed to delete location');
        }
    };

    if (!canManage) {
        return (
            <div className="locations-page">
                <h1>Access Denied</h1>
                <p>You do not have permission to manage locations.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="locations-page"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="locations-page">
            <div className="locations-header">
                <h1>Manage Locations</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Add Location
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="locations-table-container">
                <table className="locations-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location) => (
                            <tr key={location.id}>
                                <td className="icon-cell">{location.icon || '📦'}</td>
                                <td>{location.name}</td>
                                <td>
                                    <span className={`type-badge ${location.type?.toLowerCase()}`}>
                                        {location.type === 'RETAIL' ? 'Retail' : 'Non-Retail'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${location.status?.toLowerCase()}`}>
                                        {location.status}
                                    </span>
                                </td>
                                <td>{location.displayOrder}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => handleOpenModal(location)}>
                                        Edit
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(location.id)}>
                                        Archive
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Icon (emoji)</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 🛍️"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type *</label>
                                <select name="type" value={formData.type} onChange={handleInputChange}>
                                    <option value="RETAIL">Retail</option>
                                    <option value="NON_RETAIL">Non-Retail</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingLocation ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
