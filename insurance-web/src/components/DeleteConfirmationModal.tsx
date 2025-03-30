import React from 'react';
import { Policy } from '../types';

interface DeleteConfirmationModalProps {
  policy: Policy | null;
  isDeleting: boolean;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  policy,
  isDeleting,
  onConfirm,
  onCancel
}) => {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the policy <span className="font-semibold">{policy.policyNumber}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(policy.id)}
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
  );
};

export default DeleteConfirmationModal; 