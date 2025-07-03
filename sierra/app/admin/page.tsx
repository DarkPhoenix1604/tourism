"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type definitions

const BASE_URL = "https://sierra-coi7.onrender.com";

type UserType = {
  _id: string;
  name?: string;
  email: string;
  role?: string;
};

type BookingType = {
  _id: string;
  userEmail: string;
  packageName?: string;
  paymentDate?: string;
};

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", images: "" });

  useEffect(() => {
    const checkAdmin = async () => {
      const safeEmail = user?.emailAddresses?.[0]?.emailAddress;
      if (!isLoaded || !safeEmail) return;

      try {
        const res = await fetch(`${BASE_URL}/api/users`);
        const data: UserType[] = await res.json();
        const matchedUser = data.find(
          (u: UserType) => u.email.toLowerCase() === safeEmail.toLowerCase()
        );
        if (matchedUser?.role === "admin") {
          setIsAdmin(true);
          fetchAllUsers();
          fetchAllBookings();
        }
      } catch (err) {
        console.error("Admin check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [isLoaded, user]);

  const fetchAllUsers = async () => {
    const res = await fetch(`${BASE_URL}/api/users`);
    const data: UserType[] = await res.json();
    setUsers(data);
  };

  const fetchAllBookings = async () => {
    const res = await fetch(`${BASE_URL}/api/bookings/all`, {
      headers: { "x-user-email": user!.emailAddresses[0]!.emailAddress },
    });
    const data: BookingType[] = await res.json();
    setBookings(data);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewExplore = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/explore/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user!.emailAddresses[0]!.emailAddress,
        },
        body: JSON.stringify({
          ...form,
          images: form.images.split(",").map((url) => url.trim()),
          price: parseFloat(form.price),
        }),
      });
      if (res.ok) {
        alert("Package added!");
        setForm({ name: "", description: "", price: "", images: "" });
      } else {
        alert("Failed to add package.");
      }
    } catch (err) {
      console.error("Error posting package", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!isAdmin) return <div className="p-6 text-red-600">Access Denied: Admins Only</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name || "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role || "user"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.userEmail}</TableCell>
                  <TableCell>{b.packageName || "—"}</TableCell>
                  <TableCell>{new Date(b.paymentDate || "").toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Explore Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleFormChange} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea name="description" value={form.description} onChange={handleFormChange} />
          </div>
          <div className="grid gap-2">
            <Label>Price</Label>
            <Input name="price" value={form.price} onChange={handleFormChange} type="number" />
          </div>
          <div className="grid gap-2">
            <Label>Image URLs (comma-separated)</Label>
            <Input name="images" value={form.images} onChange={handleFormChange} />
          </div>
          <Button onClick={submitNewExplore}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
