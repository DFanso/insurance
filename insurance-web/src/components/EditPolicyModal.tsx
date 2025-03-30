import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Policy } from '../types';

interface EditPolicyModalProps {
  policy: Policy | null;
  onClose: () => void;
  onPolicyUpdated: () => void;
  formatCurrency?: (amount: number) => string;
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

interface EditablePolicy {
  id: number;
  policyNumber: string;
  provider: string;
  vehicleRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  coverageType: string;
  deductibleAmount: number;
  liabilityCoverageAmount: number;
  comprehensiveCoverageAmount: number;
  collisionCoverageAmount: number;
  notes: string;
}

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  policy,
  onClose,
  onPolicyUpdated
}) => {
  const [formData, setFormData] = useState<EditablePolicy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (policy) {
      setSuccessMessage('');
      setError('');
      setErrors({});
      setTouched({});
      fetchPolicyDetails(policy.id);
    } else {
      setFormData(null);
      setSuccessMessage('');
      setError('');
      setErrors({});
      setTouched({});
    }
  }, [policy]);
  
  // Validate fields whenever formData or touched state changes
  useEffect(() => {
    if (formData && Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const fetchPolicyDetails = async (id: number) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get<DetailedPolicy>(`http://localhost:8080/api/insurance/${id}`);
      const detailedPolicy = response.data;
      
      setFormData({
        id: detailedPolicy.id,
        policyNumber: detailedPolicy.policyNumber,
        provider: detailedPolicy.provider,
        vehicleRegistration: detailedPolicy.vehicleRegistration || '',
        vehicleMake: detailedPolicy.vehicleMake || '',
        vehicleModel: detailedPolicy.vehicleModel || '',
        startDate: detailedPolicy.startDate,
        endDate: detailedPolicy.endDate,
        premiumAmount: detailedPolicy.premiumAmount,
        coverageType: detailedPolicy.coverageType,
        deductibleAmount: detailedPolicy.deductibleAmount,
        liabilityCoverageAmount: detailedPolicy.liabilityCoverageAmount,
        comprehensiveCoverageAmount: detailedPolicy.comprehensiveCoverageAmount,
        collisionCoverageAmount: detailedPolicy.collisionCoverageAmount,
        notes: detailedPolicy.notes
      });
    } catch (err) {
      setError('Failed to fetch policy details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData) return false;
    
    // Policy number validation with pattern
    if (!formData.policyNumber) {
      newErrors.policyNumber = 'Policy number is required';
    } else if (!/^[A-Z0-9-]{5,15}$/i.test(formData.policyNumber)) {
      newErrors.policyNumber = 'Policy number should be 5-15 characters (letters, numbers, hyphens)';
    }
    
    // Provider validation
    if (!formData.provider) {
      newErrors.provider = 'Provider is required';
    } else if (formData.provider.length < 2) {
      newErrors.provider = 'Provider name is too short';
    } else if (formData.provider.length > 50) {
      newErrors.provider = 'Provider name is too long (max 50 characters)';
    }
    
    // Premium amount validation
    if (!formData.premiumAmount) {
      newErrors.premiumAmount = 'Premium amount is required';
    } else if (formData.premiumAmount <= 0) {
      newErrors.premiumAmount = 'Premium amount must be greater than zero';
    } else if (formData.premiumAmount > 1000000) {
      newErrors.premiumAmount = 'Premium amount is too high';
    }
    
    // Date validations
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    // Verify end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    // Other coverage validations
    if (formData.deductibleAmount < 0) {
      newErrors.deductibleAmount = 'Deductible amount cannot be negative';
    }
    
    if (formData.liabilityCoverageAmount < 0) {
      newErrors.liabilityCoverageAmount = 'Liability coverage amount cannot be negative';
    }
    
    if (formData.comprehensiveCoverageAmount < 0) {
      newErrors.comprehensiveCoverageAmount = 'Comprehensive coverage amount cannot be negative';
    }
    
    if (formData.collisionCoverageAmount < 0) {
      newErrors.collisionCoverageAmount = 'Collision coverage amount cannot be negative';
    }
    
    // Notes validation (optional)
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes too long (max 500 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleClose = () => {
    setFormData(null);
    setSuccessMessage('');
    setError('');
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const payload = {
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
        notes: formData.notes
      };
      
      await axios.put(`http://localhost:8080/api/insurance/${formData.id}`, payload);
      
      setSuccessMessage('Policy updated successfully');
      onPolicyUpdated();
      handleClose();
    } catch (err) {
      setError('Failed to update policy. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!policy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-800">Edit Policy</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSaving}
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
            <button
              onClick={() => fetchPolicyDetails(policy.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : successMessage ? (
          <div className="p-4 text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : formData && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Policy Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Policy Information</h3>
                <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number*</label>
                    <input
                      type="text"
                      name="policyNumber"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.policyNumber && errors.policyNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.policyNumber && errors.policyNumber && <p className="text-red-500 text-xs mt-1">{errors.policyNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider*</label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.provider && errors.provider ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.provider && errors.provider && <p className="text-red-500 text-xs mt-1">{errors.provider}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.startDate && errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.startDate && errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.endDate && errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.endDate && errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount*</label>
                    <input
                      type="number"
                      name="premiumAmount"
                      value={formData.premiumAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.premiumAmount && errors.premiumAmount ? 'border-red-500' : 'border-gray-300'}`}
                      step="0.01"
                      min="0"
                    />
                    {touched.premiumAmount && errors.premiumAmount && <p className="text-red-500 text-xs mt-1">{errors.premiumAmount}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Type*</label>
                    <select
                      name="coverageType"
                      value={formData.coverageType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="FULL">Full Coverage</option>
                      <option value="LIABILITY">Liability Only</option>
                      <option value="COLLISION">Collision</option>
                      <option value="COMPREHENSIVE">Comprehensive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Vehicle Information</h3>
                <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      name="vehicleRegistration"
                      value={formData.vehicleRegistration}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed here</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                      type="text"
                      name="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed here</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed here</p>
                  </div>
                </div>
              </div>
              
              {/* Coverage Details */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-blue-700 mb-3">Coverage Details</h3>
                <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductible Amount</label>
                    <input
                      type="number"
                      name="deductibleAmount"
                      value={formData.deductibleAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.deductibleAmount && errors.deductibleAmount ? 'border-red-500' : 'border-gray-300'}`}
                      step="0.01"
                      min="0"
                    />
                    {touched.deductibleAmount && errors.deductibleAmount && <p className="text-red-500 text-xs mt-1">{errors.deductibleAmount}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liability Coverage</label>
                    <input
                      type="number"
                      name="liabilityCoverageAmount"
                      value={formData.liabilityCoverageAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.liabilityCoverageAmount && errors.liabilityCoverageAmount ? 'border-red-500' : 'border-gray-300'}`}
                      step="0.01"
                      min="0"
                    />
                    {touched.liabilityCoverageAmount && errors.liabilityCoverageAmount && <p className="text-red-500 text-xs mt-1">{errors.liabilityCoverageAmount}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comprehensive Coverage</label>
                    <input
                      type="number"
                      name="comprehensiveCoverageAmount"
                      value={formData.comprehensiveCoverageAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.comprehensiveCoverageAmount && errors.comprehensiveCoverageAmount ? 'border-red-500' : 'border-gray-300'}`}
                      step="0.01"
                      min="0"
                    />
                    {touched.comprehensiveCoverageAmount && errors.comprehensiveCoverageAmount && <p className="text-red-500 text-xs mt-1">{errors.comprehensiveCoverageAmount}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collision Coverage</label>
                    <input
                      type="number"
                      name="collisionCoverageAmount"
                      value={formData.collisionCoverageAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2 border rounded-md ${touched.collisionCoverageAmount && errors.collisionCoverageAmount ? 'border-red-500' : 'border-gray-300'}`}
                      step="0.01"
                      min="0"
                    />
                    {touched.collisionCoverageAmount && errors.collisionCoverageAmount && <p className="text-red-500 text-xs mt-1">{errors.collisionCoverageAmount}</p>}
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md h-24 ${touched.notes && errors.notes ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Additional notes or comments about this policy..."
                ></textarea>
                {touched.notes && errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                disabled={isSaving}
              >
                {isSaving && (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPolicyModal; 