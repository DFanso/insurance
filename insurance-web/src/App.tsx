import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Import components
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
  const pageSize = 10;
  
  // Add new state for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // Fetch policies data
  const fetchPolicies = async (page = 0) => {
    setIsLoading(true);
    setError('');
    
    try {
      let url = `${API_BASE_URL}/api/insurance`;
      const queryParams = new URLSearchParams();
      
      // Add pagination and sorting parameters
      queryParams.append('pageNo', page.toString());
      queryParams.append('pageSize', pageSize.toString());
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortDir', sortDir);

      // If there's a search term, use the search endpoint
      if (searchTerm) {
        url = `${API_BASE_URL}/api/insurance/search`;
        queryParams.append('searchTerm', searchTerm);
      }

      // Append query parameters to URL
      url += `?${queryParams.toString()}`;
      
      const response = await axios.get<ApiResponse>(url);
      
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
        vehicleId: 1,
        startDate: formData.startDate,
        endDate: formData.endDate,
        premiumAmount: formData.premiumAmount,
        coverageType: formData.coverageType,
        deductibleAmount: formData.deductibleAmount,
        liabilityCoverageAmount: formData.liabilityCoverageAmount,
        comprehensiveCoverageAmount: formData.comprehensiveCoverageAmount,
        collisionCoverageAmount: formData.collisionCoverageAmount,
        notes: formData.notes,
        vehicleImage: formData.vehicleImage,
        vehicle: {
          registration: formData.vehicleRegistration,
          make: formData.vehicleMake,
          model: formData.vehicleModel
        }
      };

      console.log('Submitting policy with image length:', policyData.vehicleImage?.length || 0);
      console.log('Image preview:', policyData.vehicleImage?.substring(0, 50) + '...');
      
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
      const activeResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance/active?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
      const expiredResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance/expired?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
      const allResponse = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/insurance?pageNo=0&pageSize=1&sortBy=id&sortDir=asc`
      );
      
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
    fetchPolicies(page - 1);
  };
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // Reset to first page when searching
    fetchPolicies(0); // Fetch first page with search term
  };
  
  // Handle sort
  const handleSort = (newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    fetchPolicies(currentPage);
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
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="max-w-7xl mx-auto px-4">
          <h1>Insurance Management System</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="content-section">
        {/* Dashboard stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Policies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Policies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.expiringSoon}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.expired}</div>
            <div className="stat-label">Expired Policies</div>
          </div>
        </div>
        
        {/* Add Policy Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsAddFormOpen(true)}
            className="action-button"
          >
            Add New Policy
          </button>
        </div>
        
        {/* Policies Table */}
        <div className="table-container">
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
            onSearch={handleSearch}
            onSort={handleSort}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2025 Insurance Management System</p>
        </div>
      </footer>
      
      {/* Modals */}
      <DeleteConfirmationModal 
        policy={deletingPolicy}
        isDeleting={isDeleting}
        onConfirm={deletePolicy}
        onCancel={cancelDelete}
      />
      
      <AddPolicyForm 
        isOpen={isAddFormOpen}
        onSubmit={addPolicy}
        onCancel={() => setIsAddFormOpen(false)}
      />
      
      <ViewPolicyModal
        policy={viewingPolicy}
        onClose={closeViewPolicy}
        formatCurrency={formatCurrency}
      />
      
      <EditPolicyModal
        policy={editingPolicy}
        onClose={closeEditPolicy}
        onPolicyUpdated={handlePolicyUpdated}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

export default App;
