import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. This content is only visible to administrators.</p>
      {/* Add admin-specific content here */}
    </div>
  );
};

export default AdminDashboard;
