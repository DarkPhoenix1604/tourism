"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface Booking {
  _id: string
  paymentMethod: string
  paymentAmount: number
  packageName: string
  paymentDate: string // ISO string
}

export default function TableElement() {
  const { user } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ""
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!userEmail) return

    const fetchBookings = async () => {
      try {
        const res = await fetch(`https://sierra-coi7.onrender.com/api/bookings/user/${userEmail}`)
        const data = await res.json()
        setBookings(data)
      } catch (err) {
        console.error("Error fetching bookings:", err)
      }
    }

    fetchBookings()
  }, [userEmail])

  return (
    <div className="grid grid-cols-1">
      <div className="col-span-full text-center text-lg font-semibold mb-4 text-gray-600">
        Account Sheet
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell className="font-medium">{booking._id}</TableCell>
              <TableCell>{booking.packageName}</TableCell>
              <TableCell>{booking.paymentMethod}</TableCell>
              <TableCell>
                {new Date(booking.paymentDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">₹{booking.paymentAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
