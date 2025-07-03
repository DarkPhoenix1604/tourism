'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!isLoaded || !user?.emailAddresses?.[0]?.emailAddress) return;

            try {
                const res = await fetch(`https://sierra-coi7.onrender.com//api/users`);
                console.log(res);
                const data = await res.json();

                const matchedUser = data.find(
                    (u: { email: string; role?: string }) =>
                      u.email.toLowerCase() ===
                      user.emailAddresses[0].emailAddress.toLowerCase()
                  );
                  
                if (matchedUser?.role === 'admin') {
                    setIsAdmin(true);
                }

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setLoading(false);
            }
        };

        checkAdmin();
    }, [isLoaded, user]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!isAdmin) return <div className="p-6 text-red-600">Access Denied: Admins Only</div>;

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
