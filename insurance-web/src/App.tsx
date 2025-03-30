import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Import components
import Dashboard from './components/Dashboard'
import PolicyList from './components/PolicyList'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import AddPolicyForm from './components/AddPolicyForm'
import ViewPolicyModal from './components/ViewPolicyModal'
import EditPolicyModal from './components/EditPolicyModal'

// Import types
import { Policy, ApiResponse, PolicyFormData } from './types'

// Define API base URL
const API_BASE_URL = 'http://localhost:8080';

function App() {
  // State for policies data
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingPolicy, setDeletingPolicy] = useState<Policy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  
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
  
  // View policy function
  const viewPolicy = (policy: Policy) => {
    setViewingPolicy(policy);
  };
  
  // Close view policy modal
  const closeViewPolicy = () => {
    setViewingPolicy(null);
  };
  
  // Edit policy function
  const editPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
  };
  
  // Close edit policy modal
  const closeEditPolicy = () => {
    setEditingPolicy(null);
  };
  
  // Handle successful policy update
  const handlePolicyUpdated = () => {
    fetchPolicies(currentPage);
    fetchStatistics();
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
  
  // Add new policy
  const addPolicy = async (formData: PolicyFormData) => {
    try {
      // Format the data for the API
      const policyData = {
        policyNumber: formData.policyNumber,
        provider: formData.provider,
        vehicleId: 1, // In a real app, you'd get this from a vehicles list or create a new vehicle
        startDate: formData.startDate,
        endDate: formData.endDate,
        premiumAmount: formData.premiumAmount,
        coverageType: formData.coverageType,
        deductibleAmount: formData.deductibleAmount,
        liabilityCoverageAmount: formData.liabilityCoverageAmount,
        comprehensiveCoverageAmount: formData.comprehensiveCoverageAmount,
        collisionCoverageAmount: formData.collisionCoverageAmount,
        notes: formData.notes,
        // Adding vehicle details directly for simplicity
        vehicle: {
          registration: formData.vehicleRegistration,
          make: formData.vehicleMake,
          model: formData.vehicleModel
        }
      };
      
      await axios.post(`${API_BASE_URL}/api/insurance`, policyData);
      
      // Refresh data and close form
      fetchPolicies(0); // Go back to first page
      fetchStatistics();
      setIsAddFormOpen(false);
    } catch (error) {
      console.error('Error adding policy:', error);
      throw error;
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
        <Dashboard stats={stats} />
        
        {/* Add Policy Button */}
        <div className="max-w-7xl mx-auto mb-4 flex justify-end">
          <button 
            onClick={() => setIsAddFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Policy
          </button>
        </div>
        
        {/* Policies Table */}
        <PolicyList 
          policies={policies}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onConfirmDelete={confirmDelete}
          onView={viewPolicy}
          onEdit={editPolicy}
          onRetry={() => fetchPolicies(currentPage)}
          formatCurrency={formatCurrency}
        />
        
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
      <DeleteConfirmationModal 
        policy={deletingPolicy}
        isDeleting={isDeleting}
        onConfirm={deletePolicy}
        onCancel={cancelDelete}
      />
      
      {/* Add Policy Form */}
      <AddPolicyForm 
        isOpen={isAddFormOpen}
        onSubmit={addPolicy}
        onCancel={() => setIsAddFormOpen(false)}
      />
      
      {/* View Policy Modal */}
      <ViewPolicyModal
        policy={viewingPolicy}
        onClose={closeViewPolicy}
        formatCurrency={formatCurrency}
      />
      
      {/* Edit Policy Modal */}
      <EditPolicyModal
        policy={editingPolicy}
        onClose={closeEditPolicy}
        onPolicyUpdated={handlePolicyUpdated}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}

export default App
