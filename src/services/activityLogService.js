import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Get auth header helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

/**
 * Activity Log Service - API calls for activity logs and audit trail
 */
export const activityLogService = {
    /**
     * Get activity logs with optional filters
     */
    getActivityLogs: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.entityType) params.append('entityType', filters.entityType);
        if (filters.entityId) params.append('entityId', filters.entityId);
        if (filters.operation) params.append('operation', filters.operation);
        if (filters.performedBy) params.append('performedBy', filters.performedBy);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.page !== undefined) params.append('page', filters.page);
        if (filters.size !== undefined) params.append('size', filters.size);

        const response = await axios.get(
            `${API_BASE_URL}/activity-logs?${params.toString()}`,
            getAuthHeader()
        );
        return response.data;
    },

    /**
     * Get activity logs for a specific entity
     */
    getEntityActivityLogs: async (entityType, entityId) => {
        const response = await axios.get(
            `${API_BASE_URL}/activity-logs/entity/${entityType}/${entityId}`,
            getAuthHeader()
        );
        return response.data;
    },

    /**
     * Get filter options for dropdowns
     */
    getFilterOptions: async () => {
        const response = await axios.get(
            `${API_BASE_URL}/activity-logs/filters`,
            getAuthHeader()
        );
        return response.data;
    },

    /**
     * Get all versions of an entity
     */
    getEntityVersions: async (entityType, entityId) => {
        const response = await axios.get(
            `${API_BASE_URL}/audit-trail/${entityType}/${entityId}/versions`,
            getAuthHeader()
        );
        return response.data;
    },

    /**
     * Get entity at a specific revision
     */
    getEntityAtRevision: async (entityType, entityId, revisionNumber) => {
        const response = await axios.get(
            `${API_BASE_URL}/audit-trail/${entityType}/${entityId}/versions/${revisionNumber}`,
            getAuthHeader()
        );
        return response.data;
    },

    /**
     * Compare two versions of an entity
     */
    compareVersions: async (entityType, entityId, rev1, rev2) => {
        const response = await axios.get(
            `${API_BASE_URL}/audit-trail/${entityType}/${entityId}/diff?rev1=${rev1}&rev2=${rev2}`,
            getAuthHeader()
        );
        return response.data;
    }
};

export default activityLogService;
