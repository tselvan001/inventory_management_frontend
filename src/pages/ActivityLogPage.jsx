import React, { useState, useEffect, useCallback } from 'react';
import { activityLogService } from '../services/activityLogService';
import AuditTrailModal from '../component/AuditTrailModal';
import './ActivityLogPage.css';

export const ActivityLogPage = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        entityTypes: [],
        users: [],
        operations: ['CREATE', 'UPDATE', 'DELETE']
    });
    const [filters, setFilters] = useState({
        entityType: '',
        operation: '',
        performedBy: '',
        startDate: '',
        endDate: '',
        page: 0,
        size: 20
    });
    const [pagination, setPagination] = useState({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showAuditModal, setShowAuditModal] = useState(false);

    const fetchActivityLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await activityLogService.getActivityLogs(filters);
            setActivityLogs(response.content || []);
            setPagination({
                totalElements: response.totalElements || 0,
                totalPages: response.totalPages || 0,
                currentPage: response.number || 0
            });
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            // Interceptor handles 401/403 redirects
            if (!error.response || ![401, 403].includes(error.response.status)) {
                setActivityLogs([]);
            }
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchFilterOptions = async () => {
        try {
            const options = await activityLogService.getFilterOptions();
            setFilterOptions(options);
        } catch (error) {
            console.error('Error fetching filter options:', error);
            // Interceptor handles 401/403
        }
    };

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 0 // Reset page on filter change
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            entityType: '',
            operation: '',
            performedBy: '',
            startDate: '',
            endDate: '',
            page: 0,
            size: 20
        });
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleViewAuditTrail = (activity) => {
        setSelectedActivity(activity);
        setShowAuditModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return {
            primary: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            secondary: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const getOperationIcon = (operation) => {
        switch (operation) {
            case 'CREATE': return '➕';
            case 'UPDATE': return '✏️';
            case 'DELETE': return '🗑️';
            default: return '📝';
        }
    };

    const getEntityTypeIcon = (entityType) => {
        switch (entityType) {
            case 'STOCK': return '📦';
            case 'USER': return '👤';
            case 'ROLE': return '🔐';
            case 'SOLD_STOCK': return '💰';
            case 'TAKEN_STOCK': return '📤';
            case 'EMPTY_STOCK': return '📭';
            default: return '📄';
        }
    };

    return (
        <div className="activity-log-container">
            <div className="activity-log-header">
                <h1>
                    <span className="icon">📋</span>
                    Activity Logs
                </h1>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Module</label>
                        <select
                            name="entityType"
                            value={filters.entityType}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Modules</option>
                            {filterOptions.entityTypes.map(type => (
                                <option key={type} value={type}>{type.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Operation</label>
                        <select
                            name="operation"
                            value={filters.operation}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Operations</option>
                            {filterOptions.operations.map(op => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>User</label>
                        <select
                            name="performedBy"
                            value={filters.performedBy}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Users</option>
                            {filterOptions.users.map(user => (
                                <option key={user} value={user}>{user}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Start Date</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label>End Date</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>

                <div className="filter-actions">
                    <button className="btn-filter secondary" onClick={handleClearFilters}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Activity Log Table */}
            <div className="activity-log-table-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading activity logs...</span>
                    </div>
                ) : activityLogs.length === 0 ? (
                    <div className="empty-state">
                        <span className="icon">📭</span>
                        <p>No activity logs found</p>
                    </div>
                ) : (
                    <>
                        <table className="activity-log-table">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Module</th>
                                    <th>Operation</th>
                                    <th>Entity</th>
                                    <th>Performed By</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLogs.map((log) => {
                                    const dateFormatted = formatDate(log.createdTime);
                                    return (
                                        <tr key={log.activityLogId}>
                                            <td>
                                                <div className="date-cell">
                                                    <span className="date-primary">{dateFormatted.primary}</span>
                                                    <span className="date-secondary">{dateFormatted.secondary}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="entity-type-badge">
                                                    {getEntityTypeIcon(log.entityType)} {log.entityType?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`operation-badge ${log.operation?.toLowerCase()}`}>
                                                    {getOperationIcon(log.operation)} {log.operation}
                                                </span>
                                            </td>
                                            <td>{log.entityName || `#${log.entityId}`}</td>
                                            <td>{log.createdBy}</td>
                                            <td>{log.description}</td>
                                            <td>
                                                <button
                                                    className="btn-audit-trail"
                                                    onClick={() => handleViewAuditTrail(log)}
                                                >
                                                    🔍 View Audit Trail
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={pagination.currentPage === 0}
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                            >
                                ← Previous
                            </button>
                            <span className="pagination-info">
                                Page {pagination.currentPage + 1} of {pagination.totalPages || 1}
                                {' '}({pagination.totalElements} total)
                            </span>
                            <button
                                className="pagination-btn"
                                disabled={pagination.currentPage >= pagination.totalPages - 1}
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Audit Trail Modal */}
            {showAuditModal && selectedActivity && (
                <AuditTrailModal
                    entityType={selectedActivity.entityType}
                    entityId={selectedActivity.entityId}
                    entityName={selectedActivity.entityName}
                    targetRevisionNumber={selectedActivity.revisionNumber}
                    onClose={() => {
                        setShowAuditModal(false);
                        setSelectedActivity(null);
                    }}
                />
            )}
        </div>
    );
};

export default ActivityLogPage;
