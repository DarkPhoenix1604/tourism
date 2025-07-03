import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="p-6">
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Users</h2>
                        <p className="text-gray-600">Manage user accounts and permissions.</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Analytics</h2>
                        <p className="text-gray-600">View website performance metrics.</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="text-lg font-semibold">Settings</h2>
                        <p className="text-gray-600">Configure application settings.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;