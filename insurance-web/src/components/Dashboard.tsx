import React from 'react';

interface DashboardProps {
  stats: {
    total: number;
    active: number;
    expiringSoon: number;
    expired: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
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
  );
};

export default Dashboard; 