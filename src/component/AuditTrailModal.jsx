import React, { useState, useEffect } from 'react';
import { activityLogService } from '../services/activityLogService';
import './AuditTrailModal.css';

const AuditTrailModal = ({ entityType, entityId, entityName, targetRevisionNumber, onClose }) => {
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [compareMode, setCompareMode] = useState(false);
    const [compareVersions, setCompareVersions] = useState([]);
    const [diff, setDiff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [diffLoading, setDiffLoading] = useState(false);

    useEffect(() => {
        fetchVersions();
    }, [entityType, entityId]);

    const fetchVersions = async () => {
        setLoading(true);
        try {
            const data = await activityLogService.getEntityVersions(entityType, entityId);
            setVersions(data || []);

            if (data && data.length > 0) {
                // If a target revision is specified, find and select it
                let versionToSelect = data[0]; // Default to latest
                let versionIndex = 0;

                if (targetRevisionNumber) {
                    const targetIndex = data.findIndex(v => v.revisionNumber === targetRevisionNumber);
                    if (targetIndex >= 0) {
                        versionToSelect = data[targetIndex];
                        versionIndex = targetIndex;
                    }
                }

                setSelectedVersion(versionToSelect);

                // Show diff with previous version, or initial state if first version
                if (versionIndex < data.length - 1) {
                    fetchDiff(data[versionIndex + 1].revisionNumber, versionToSelect.revisionNumber);
                } else {
                    showInitialState(versionToSelect);
                }
            }
        } catch (error) {
            console.error('Error fetching versions:', error);
            setVersions([]);
        } finally {
            setLoading(false);
        }
    };

    const showInitialState = (version) => {
        const entityData = version.entityData || {};
        const differences = {};

        Object.entries(entityData).forEach(([key, value]) => {
            differences[key] = {
                fieldName: key,
                oldValue: null,
                newValue: value,
                changeType: 'ADDED'
            };
        });

        setDiff({
            revision1: null,
            revision2: version.revisionNumber,
            versionNumber1: null,
            versionNumber2: version.versionNumber,
            differences: differences
        });
    };

    const fetchDiff = async (rev1, rev2) => {
        setDiffLoading(true);
        try {
            const data = await activityLogService.compareVersions(entityType, entityId, rev1, rev2);
            setDiff(data);
        } catch (error) {
            console.error('Error fetching diff:', error);
            setDiff(null);
        } finally {
            setDiffLoading(false);
        }
    };

    const handleVersionClick = (version) => {
        if (compareMode) {
            // In compare mode, toggle selection
            if (compareVersions.includes(version.revisionNumber)) {
                setCompareVersions(compareVersions.filter(v => v !== version.revisionNumber));
            } else if (compareVersions.length < 2) {
                setCompareVersions([...compareVersions, version.revisionNumber]);
            }
        } else {
            // In normal mode, select version and show diff with previous
            setSelectedVersion(version);
            const versionIndex = versions.findIndex(v => v.revisionNumber === version.revisionNumber);
            if (versionIndex < versions.length - 1) {
                fetchDiff(versions[versionIndex + 1].revisionNumber, version.revisionNumber);
            } else {
                // First version - show initial state
                showInitialState(version);
            }
        }
    };

    const handleCompare = () => {
        if (compareVersions.length === 2) {
            const [rev1, rev2] = compareVersions.sort((a, b) => a - b);
            fetchDiff(rev1, rev2);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    const getRevisionTypeClass = (type) => {
        switch (type?.toLowerCase()) {
            case 'add': return 'add';
            case 'mod': return 'mod';
            case 'del': return 'del';
            default: return 'mod';
        }
    };

    const getRevisionTypeLabel = (type) => {
        switch (type?.toLowerCase()) {
            case 'add': return 'Created';
            case 'mod': return 'Updated';
            case 'del': return 'Deleted';
            default: return type;
        }
    };

    return (
        <div className="audit-trail-overlay" onClick={onClose}>
            <div className="audit-trail-modal" onClick={e => e.stopPropagation()}>
                <div className="audit-trail-header">
                    <h2>
                        🔍 Audit Trail: <span className="entity-name">{entityName || `${entityType} #${entityId}`}</span>
                    </h2>
                    <button className="btn-close-modal" onClick={onClose}>×</button>
                </div>

                <div className="audit-trail-content">
                    {loading ? (
                        <div className="modal-loading">
                            <div className="loading-spinner"></div>
                            <span>Loading version history...</span>
                        </div>
                    ) : (
                        <>
                            {/* Diff View Section */}
                            <div className="diff-section">
                                <div className="diff-header">
                                    <h3>Changes</h3>
                                    {diff && (
                                        <div className="version-info">
                                            {diff.versionNumber1 ? (
                                                `Comparing: Ver ${diff.versionNumber1} → Ver ${diff.versionNumber2}`
                                            ) : (
                                                `Initial Record: Ver ${diff.versionNumber2}`
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="diff-container">
                                    {diffLoading ? (
                                        <div className="modal-loading">
                                            <div className="loading-spinner"></div>
                                            <span>Loading diff...</span>
                                        </div>
                                    ) : diff && Object.keys(diff.differences).length > 0 ? (
                                        <table className="diff-table">
                                            <thead>
                                                <tr>
                                                    <th>Field</th>
                                                    {!compareMode && selectedVersion?.revisionType?.toLowerCase() === 'add' ? null : <th>Old Value</th>}
                                                    {!compareMode && selectedVersion?.revisionType?.toLowerCase() === 'del' ? null : <th>New Value</th>}
                                                    <th>Change</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(diff.differences).map(([key, fieldDiff]) => (
                                                    <tr key={key} className={`diff-row ${fieldDiff.changeType.toLowerCase()}`}>
                                                        <td className="field-name">{key}</td>
                                                        {!compareMode && selectedVersion?.revisionType?.toLowerCase() === 'add' ? null : (
                                                            <td className="old-value">
                                                                {formatValue(fieldDiff.oldValue)}
                                                            </td>
                                                        )}
                                                        {!compareMode && selectedVersion?.revisionType?.toLowerCase() === 'del' ? null : (
                                                            <td className="new-value">
                                                                {formatValue(fieldDiff.newValue)}
                                                            </td>
                                                        )}
                                                        <td>
                                                            <span className={`change-type-badge ${fieldDiff.changeType.toLowerCase()}`}>
                                                                {fieldDiff.changeType}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="no-changes">
                                            <span className="icon">✨</span>
                                            <p>No changes to display</p>
                                            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                                Select a version to see its changes
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Version List Section */}
                            <div className="versions-section">
                                <div className="versions-header">
                                    <h3>Version History</h3>
                                    <label className="compare-mode-toggle">
                                        <input
                                            type="checkbox"
                                            checked={compareMode}
                                            onChange={(e) => {
                                                setCompareMode(e.target.checked);
                                                setCompareVersions([]);
                                            }}
                                        />
                                        Compare Mode
                                    </label>
                                </div>
                                <div className="versions-list">
                                    {versions.length === 0 ? (
                                        <div className="no-changes">
                                            <span className="icon">📭</span>
                                            <p>No version history available</p>
                                        </div>
                                    ) : (
                                        versions.map((version) => (
                                            <div
                                                key={version.revisionNumber}
                                                className={`version-item ${!compareMode && selectedVersion?.revisionNumber === version.revisionNumber ? 'selected' : ''
                                                    } ${compareMode && compareVersions.includes(version.revisionNumber) ? 'compare-selected' : ''
                                                    } ${targetRevisionNumber === version.revisionNumber ? 'target-revision' : ''}`}
                                                onClick={() => handleVersionClick(version)}
                                            >
                                                <div className="version-item-header">
                                                    <span className="version-number">Ver {version.versionNumber}</span>
                                                    <span className={`version-type ${getRevisionTypeClass(version.revisionType)}`}>
                                                        {getRevisionTypeLabel(version.revisionType)}
                                                    </span>
                                                </div>
                                                <div className="version-date">
                                                    {formatDate(version.revisionDate)}
                                                </div>
                                                {version.modifiedBy && (
                                                    <div className="version-user">
                                                        By: {version.modifiedBy}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                                {compareMode && (
                                    <div className="compare-actions">
                                        <button
                                            className="btn-compare"
                                            disabled={compareVersions.length !== 2}
                                            onClick={handleCompare}
                                        >
                                            Compare Selected Versions
                                        </button>
                                        <div className="compare-selection-info">
                                            {compareVersions.length === 0 && 'Select 2 versions to compare'}
                                            {compareVersions.length === 1 && 'Select 1 more version'}
                                            {compareVersions.length === 2 && (
                                                `Comparing Ver ${versions.find(v => v.revisionNumber === compareVersions[0])?.versionNumber} & 
                                                 Ver ${versions.find(v => v.revisionNumber === compareVersions[1])?.versionNumber}`
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditTrailModal;
