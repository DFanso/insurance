import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Define API base URL
const API_BASE_URL = 'http://localhost:8080';

// Define interfaces for data types
interface Policy {
  id: number;
  policyNumber: string;
  provider: string;
  vehicleRegistration?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  premiumAmount: number;
  endDate: string;
  status: string;
}

interface ApiResponse {
  policies: Policy[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

function App() {
  // State for policies data
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Adding delete confirmation state
  const [deletingPolicy, setDeletingPolicy] = useState<Policy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0
  });
  
  // Pagination settings
  const pageSize = 3;
  
  // Fetch policies data
  const fetchPolicies = async (page = 0) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance?pageNo=${page}&pageSize=${pageSize}&sortBy=id&sortDir=asc`
      );
      
      setPolicies(response.data.policies);
      setCurrentPage(response.data.currentPage);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch policies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete policy function
  const deletePolicy = async (id: number) => {
    setIsDeleting(true);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/insurance/${id}`);
      
      // Refresh the data
      fetchPolicies(currentPage);
      fetchStatistics();
      
      // Reset delete confirmation
      setDeletingPolicy(null);
    } catch (err) {
      setError('Failed to delete policy. Please try again later.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Open delete confirmation
  const confirmDelete = (policy: Policy) => {
    setDeletingPolicy(policy);
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setDeletingPolicy(null);
  };
  
  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      // This would typically be an API call to get statistics
      // For now, we're calculating them from policy statuses
      const activeResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance/active?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
      const expiredResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance/expired?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
      // Get all policies for total count
      const allResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
      // Calculate expiring soon (policies expiring in the next 30 days)
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      const expiringSoonResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance/expiry-range?startDate=${formatDate(today)}&endDate=${formatDate(thirtyDaysLater)}&pageNo=0&pageSize=1&sortBy=endDate&sortDir=asc`
      );
      
      setStats({
        total: allResponse.data.totalItems,
        active: activeResponse.data.totalItems,
        expiringSoon: expiringSoonResponse.data.totalItems,
        expired: expiredResponse.data.totalItems
      });
      
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };
  
  // Helper function to format date for API
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    fetchPolicies(page - 1); // API uses 0-indexed pages, UI uses 1-indexed
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchPolicies();
    fetchStatistics();
  }, []);
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-blue-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md w-full">
        <div className="max-w-full mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center">Insurance Management System</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow w-full px-4 py-8">
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <h3 className="font-medium text-gray-500">Total Policies</h3>
            <p className="text-4xl font-bold text-blue-800">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <h3 className="font-medium text-gray-500">Active Policies</h3>
            <p className="text-4xl font-bold text-blue-800">{stats.active}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <h3 className="font-medium text-gray-500">Expiring Soon</h3>
            <p className="text-4xl font-bold text-blue-800">{stats.expiringSoon}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <h3 className="font-medium text-gray-500">Expired</h3>
            <p className="text-4xl font-bold text-red-600">{stats.expired}</p>
          </div>
        </div>
        
        {/* Policies Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 max-w-7xl mx-auto">
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Insurance Policies</h2>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Add New Policy
            </button>
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
                onClick={() => fetchPolicies(currentPage)} 
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
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button 
                            onClick={() => confirmDelete(policy)} 
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
                    onClick={() => handlePageChange(Math.max(1, currentPage))}
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
                      onClick={() => handlePageChange(page)}
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
                    onClick={() => handlePageChange(currentPage + 2)}
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
        
        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Vehicles</h3>
            <p className="text-gray-600 mb-4">Manage your registered vehicles</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Vehicles
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Reports</h3>
            <p className="text-gray-600 mb-4">Generate insurance reports</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Reports
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Settings</h3>
            <p className="text-gray-600 mb-4">Configure your account settings</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Open Settings
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center">&copy; 2023 Insurance Management System</p>
        </div>
      </footer>
      
      {/* Delete Confirmation Modal */}
      {deletingPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the policy <span className="font-semibold">{deletingPolicy.policyNumber}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => deletePolicy(deletingPolicy.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
