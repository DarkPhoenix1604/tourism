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
  paymentDate: string
  bookingDate: string
  numPeople: number
}

export default function UpcomingBookingsPage() {
  const { user } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ""
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!userEmail) return

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings/user/${userEmail}`)
        const data = await res.json()

        const upcoming = data.filter((booking: Booking) => {
          const today = new Date()
          const tripDate = new Date(booking.bookingDate)
          return tripDate >= today
        })

        setBookings(upcoming)
      } catch (err) {
        console.error("Error fetching bookings:", err)
      }
    }

    fetchBookings()
  }, [userEmail])

  return (
    <div className="grid grid-cols-1 max-w-5xl mx-auto px-4 py-10">
      <div className="col-span-full text-center text-2xl font-bold mb-6 text-gray-800">
        Upcoming Bookings
      </div>
      <Table>
        <TableCaption>Only your upcoming trips are shown here.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Date of Trip</TableHead>
            <TableHead>People</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No upcoming bookings found.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.packageName}</TableCell>
                <TableCell>
                  {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{booking.numPeople}</TableCell>
                <TableCell>{booking.paymentMethod}</TableCell>
                <TableCell className="text-right">₹{booking.paymentAmount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
