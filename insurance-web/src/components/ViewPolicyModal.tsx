import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Policy } from '../types';

interface ViewPolicyModalProps {
  policy: Policy | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
}

interface DetailedPolicy extends Policy {
  startDate: string;
  coverageType: string;
  deductibleAmount: number;
  liabilityCoverageAmount: number;
  comprehensiveCoverageAmount: number;
  collisionCoverageAmount: number;
  notes: string;
}

const ViewPolicyModal: React.FC<ViewPolicyModalProps> = ({
  policy,
  onClose,
  formatCurrency
}) => {
  const [detailedPolicy, setDetailedPolicy] = useState<DetailedPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (policy) {
      fetchPolicyDetails(policy.id);
    }
  }, [policy]);

  const fetchPolicyDetails = async (id: number) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get<DetailedPolicy>(`http://localhost:8080/api/insurance/${id}`);
      console.log('Policy details received:', response.data);
      console.log('Received image length:', response.data.vehicleImage?.length || 0);
      console.log('Image preview:', response.data.vehicleImage?.substring(0, 50) + '...');
      setDetailedPolicy(response.data);
    } catch (err) {
      setError('Failed to fetch policy details');
      console.error('Error fetching policy details:', err);
      // Fall back to the basic policy data
      setDetailedPolicy(policy as DetailedPolicy);
    } finally {
      setIsLoading(false);
    }
  };

  if (!policy) return null;

  // Use the detailed policy if available, otherwise fall back to the basic policy
  const displayPolicy = detailedPolicy || policy;
  
  // Check if we have detailed policy
  const hasDetailedPolicy = detailedPolicy !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-800">Policy Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading policy details...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display basic policy info even if detailed fetch failed */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Policy Information</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Policy Number</p>
                      <p className="font-medium text-gray-800">{displayPolicy.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium text-gray-800">{displayPolicy.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Premium Amount</p>
                      <p className="font-medium text-gray-800">{formatCurrency(displayPolicy.premiumAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium text-gray-800">{displayPolicy.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${
                        displayPolicy.status === 'ACTIVE' 
                          ? 'text-green-600' 
                          : displayPolicy.status === 'EXPIRED' 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {displayPolicy.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Image */}
            {displayPolicy.vehicleImage && (
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Vehicle Image</h3>
                <div className="bg-blue-50 p-4 rounded-lg flex justify-center">
                  <img
                    src={displayPolicy.vehicleImage}
                    alt="Vehicle"
                    className="max-h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {/* Policy Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Policy Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-medium text-gray-800">{displayPolicy.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-medium text-gray-800">{displayPolicy.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Premium Amount</p>
                    <p className="font-medium text-gray-800">{formatCurrency(displayPolicy.premiumAmount)}</p>
                  </div>
                  {hasDetailedPolicy && (
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium text-gray-800">{detailedPolicy.startDate || 'N/A'}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium text-gray-800">{displayPolicy.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${
                      displayPolicy.status === 'ACTIVE' 
                        ? 'text-green-600' 
                        : displayPolicy.status === 'EXPIRED' 
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                    }`}>
                      {displayPolicy.status}
                    </p>
                  </div>
                  {hasDetailedPolicy && (
                    <div>
                      <p className="text-sm text-gray-500">Coverage Type</p>
                      <p className="font-medium text-gray-800">{detailedPolicy.coverageType || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vehicle Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Vehicle Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium text-gray-800">{displayPolicy.vehicleRegistration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-medium text-gray-800">{displayPolicy.vehicleMake || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium text-gray-800">{displayPolicy.vehicleModel || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coverage Details */}
            {hasDetailedPolicy && (
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Coverage Details</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Deductible Amount</p>
                      <p className="font-medium text-gray-800">{formatCurrency(detailedPolicy.deductibleAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Liability Coverage</p>
                      <p className="font-medium text-gray-800">{formatCurrency(detailedPolicy.liabilityCoverageAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comprehensive Coverage</p>
                      <p className="font-medium text-gray-800">{formatCurrency(detailedPolicy.comprehensiveCoverageAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Collision Coverage</p>
                      <p className="font-medium text-gray-800">{formatCurrency(detailedPolicy.collisionCoverageAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {hasDetailedPolicy && detailedPolicy.notes && (
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Notes</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800">{detailedPolicy.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPolicyModal; 