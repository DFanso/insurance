import React from 'react';
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
  onRetry: () => void;
  formatCurrency: (amount: number) => string;
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
  onRetry,
  formatCurrency
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 max-w-7xl mx-auto">
      <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">Insurance Policies</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Policy Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => onView(policy)} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button 
                        onClick={() => onConfirmDelete(policy)} 
                        className="text-red-600 hover:text-red-900"
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
                className={`px-3 py-1 rounded ${
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
                  className={`px-3 py-1 rounded ${
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
                className={`px-3 py-1 rounded ${
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