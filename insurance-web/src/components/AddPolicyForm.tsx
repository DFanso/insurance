import React, { useState, useEffect } from 'react';
import { PolicyFormData } from '../types';

interface AddPolicyFormProps {
  onSubmit: (formData: PolicyFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const AddPolicyForm: React.FC<AddPolicyFormProps> = ({ onSubmit, onCancel, isOpen }) => {
  const initialFormData: PolicyFormData = {
    policyNumber: '',
    provider: '',
    vehicleRegistration: '',
    vehicleMake: '',
    vehicleModel: '',
    premiumAmount: 0,
    startDate: '',
    endDate: '',
    coverageType: 'FULL',
    deductibleAmount: 0,
    liabilityCoverageAmount: 0,
    comprehensiveCoverageAmount: 0,
    collisionCoverageAmount: 0,
    notes: '',
    vehicleImage: ''
  };

  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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
    
    // Vehicle registration validation
    if (!formData.vehicleRegistration) {
      newErrors.vehicleRegistration = 'Vehicle registration is required';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(formData.vehicleRegistration)) {
      newErrors.vehicleRegistration = 'Invalid registration format (2-10 alphanumeric characters)';
    }
    
    // Vehicle make validation
    if (!formData.vehicleMake) {
      newErrors.vehicleMake = 'Vehicle make is required';
    } else if (formData.vehicleMake.length < 2) {
      newErrors.vehicleMake = 'Vehicle make is too short';
    }
    
    // Vehicle model validation
    if (!formData.vehicleModel) {
      newErrors.vehicleModel = 'Vehicle model is required';
    } else if (formData.vehicleModel.length < 1) {
      newErrors.vehicleModel = 'Vehicle model is too short';
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
    
    // Image validation
    if (formData.vehicleImage && formData.vehicleImage.length > 5000000) { // 5MB limit
      newErrors.vehicleImage = 'Image size is too large (max 5MB)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name, 'Size:', file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Base64 string length:', base64String.length);
        console.log('Base64 string preview:', base64String.substring(0, 50) + '...');
        setFormData(prev => ({
          ...prev,
          vehicleImage: base64String
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData(initialFormData);
      setTouched({});
      setImagePreview('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-800">Add New Policy</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
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
                    placeholder="e.g., POL-123456"
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
                    placeholder="e.g., ABC Insurance"
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
                    placeholder="0.00"
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
                
                {/* Vehicle Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Vehicle preview"
                            className="mx-auto h-32 w-auto"
                          />
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="vehicle-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="vehicle-image"
                            name="vehicleImage"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                            onBlur={handleBlur}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                  {touched.vehicleImage && errors.vehicleImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleImage}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vehicle Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Vehicle Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number*</label>
                  <input
                    type="text"
                    name="vehicleRegistration"
                    value={formData.vehicleRegistration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md ${touched.vehicleRegistration && errors.vehicleRegistration ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., ABC123"
                  />
                  {touched.vehicleRegistration && errors.vehicleRegistration && <p className="text-red-500 text-xs mt-1">{errors.vehicleRegistration}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make*</label>
                  <input
                    type="text"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md ${touched.vehicleMake && errors.vehicleMake ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Toyota"
                  />
                  {touched.vehicleMake && errors.vehicleMake && <p className="text-red-500 text-xs mt-1">{errors.vehicleMake}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model*</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded-md ${touched.vehicleModel && errors.vehicleModel ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Camry"
                  />
                  {touched.vehicleModel && errors.vehicleModel && <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>}
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00"
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
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPolicyForm; 