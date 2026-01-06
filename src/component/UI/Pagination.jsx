import React from 'react';
import { Button } from './Button';
import './Pagination.css';

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    totalElements
}) {
    if (totalPages <= 1 && totalElements <= 0) return null;

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing {totalElements > 0 ? (currentPage * pageSize) + 1 : 0} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
            </div>

            <div className="pagination-controls">
                <Button
                    name="Previous"
                    variant="secondary"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                />

                <span className="page-number">
                    Page {currentPage + 1} of {totalPages || 1}
                </span>

                <Button
                    name="Next"
                    variant="secondary"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                />
            </div>

            <div className="pagination-size">
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="select-input"
                >
                    {[10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>
                            {size} per page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
