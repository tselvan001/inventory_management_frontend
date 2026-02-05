import api from './api';

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

        const response = await api.get(`/activity-logs?${params.toString()}`);
        return response.data;
    },

    /**
     * Get activity logs for a specific entity
     */
    getEntityActivityLogs: async (entityType, entityId) => {
        const response = await api.get(`/activity-logs/entity/${entityType}/${entityId}`);
        return response.data;
    },

    /**
     * Get filter options for dropdowns
     */
    getFilterOptions: async () => {
        const response = await api.get('/activity-logs/filters');
        return response.data;
    },

    /**
     * Get all versions of an entity
     */
    getEntityVersions: async (entityType, entityId) => {
        const response = await api.get(`/audit-trail/${entityType}/${entityId}/versions`);
        return response.data;
    },

    /**
     * Get entity at a specific revision
     */
    getEntityAtRevision: async (entityType, entityId, revisionNumber) => {
        const response = await api.get(`/audit-trail/${entityType}/${entityId}/versions/${revisionNumber}`);
        return response.data;
    },

    /**
     * Compare two versions of an entity
     */
    compareVersions: async (entityType, entityId, rev1, rev2) => {
        const response = await api.get(`/audit-trail/${entityType}/${entityId}/diff?rev1=${rev1}&rev2=${rev2}`);
        return response.data;
    }
};

export default activityLogService;
