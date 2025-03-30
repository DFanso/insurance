import React, { useState, useEffect } from 'react';
import { Policy } from '../types';

interface PolicyListProps {
  policies: Policy[];
  isLoading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onConfirmDelete: (policy: Policy) => void;
  onView: (policy: Policy) => void;
  onEdit: (policy: Policy) => void;
  onRetry: () => void;
  formatCurrency: (amount: number) => string;
  onSearch: (searchTerm: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
}

const PolicyList: React.FC<PolicyListProps> = ({
  policies,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onConfirmDelete,
  onView,
  onEdit,
  onRetry,
  formatCurrency,
  onSearch,
  onSort
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Reset search when component unmounts or policies change
  useEffect(() => {
    return () => {
      setSearchTerm('');
    };
  }, [policies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      // If search is cleared, reset to normal listing
      onSearch('');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleSort = (field: string) => {
    const newSortDir = field === sortBy && sortDir === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDir(newSortDir);
    onSort(field, newSortDir);
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span className="ml-1 inline-block">
      {field === sortBy ? (
        sortDir === 'asc' ? '↑' : '↓'
      ) : '↕'}
    </span>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 max-w-7xl mx-auto">
      <div className="p-6 bg-blue-600 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Insurance Policies</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by vehicle make, model, or registration..."
              className="px-4 py-2 rounded-md text-gray-800 w-96 bg-white shadow-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                searchTerm.trim() 
                  ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm' 
                  : 'bg-white/50 text-white cursor-not-allowed'
              }`}
              disabled={!searchTerm.trim()}
            >
              Search
            </button>
            {searchTerm.trim() && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-6 py-2 rounded-md font-medium bg-red-50 text-red-600 hover:bg-red-100 shadow-sm transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </div>
        <div className="text-sm text-blue-100">
          Enter vehicle details to search policies (e.g., Toyota, Camry, ABC123)
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading policies...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={onRetry} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-blue-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('policyNumber')}
                >
                  Policy Number
                  <SortIcon field="policyNumber" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('provider')}
                >
                  Provider
                  <SortIcon field="provider" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('vehicleMake')}
                >
                  Vehicle
                  <SortIcon field="vehicleMake" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('premiumAmount')}
                >
                  Premium
                  <SortIcon field="premiumAmount" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('endDate')}
                >
                  Expiry Date
                  <SortIcon field="endDate" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{policy.policyNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {policy.vehicleMake} {policy.vehicleModel} ({policy.vehicleRegistration})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(policy.premiumAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => onView(policy)} 
                        className="!shadow-none !transform-none bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                        style={{ transform: 'none' }}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onEdit(policy)} 
                        className="!shadow-none !transform-none bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                        style={{ transform: 'none' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onConfirmDelete(policy)} 
                        className="!shadow-none !transform-none bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        style={{ transform: 'none' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No policies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!isLoading && !error && policies.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{policies.length > 0 ? currentPage * pageSize + 1 : 0}</span> to{" "}
                <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage))}
                disabled={currentPage === 0}
                className={`!shadow-none !transform-none px-3 py-1 rounded ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`!shadow-none !transform-none px-3 py-1 rounded ${
                    page === currentPage + 1
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange(currentPage + 2)}
                disabled={currentPage + 1 >= totalPages}
                className={`!shadow-none !transform-none px-3 py-1 rounded ${
                  currentPage + 1 >= totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyList; 