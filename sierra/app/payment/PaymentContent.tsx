"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react" // or use any calendar icon
import { cn } from "@/lib/utils" // optional, for class merging
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/nextjs"


interface Package {
  _id: string
  name: string
  price: number
}

export default function PaymentContent() {
  const [numPeople, setNumPeople] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const searchParams = useSearchParams()
  const pkgId = searchParams.get("pkgId") || ""
  const [pkg, setPkg] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { user } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ""

  const handleBookingSubmit = async () => {
    if (!pkg || !selectedDate || numPeople < 1) return

    const bookingData = {
      invoiceId: pkg._id,
      packageName: pkg.name,
      paymentMethod,
      paymentAmount: total,
      bookingDate: selectedDate,
      paymentDate: new Date(),
      numPeople,
      userEmail,
    }    

    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!res.ok) throw new Error("Failed to post booking")
      const result = await res.json()
      console.log("Booking successful:", result)

      // Optional: Redirect or show confirmation
      alert("Booking successful!")
    } catch (err) {
      console.error("Booking failed:", err)
      alert("Booking failed. Please try again.")
    }
  }

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/explore/packages/${pkgId}`)
        if (!res.ok) throw new Error("Invalid response")
        const data = await res.json()
        setPkg(data)
      } catch (err) {
        console.error("Failed to fetch package:", err)
      } finally {
        setLoading(false)
      }
    }

    if (pkgId) fetchPackage()
  }, [pkgId])

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!pkg) return <div className="p-6 text-center text-red-600">Invalid package selected.</div>

  const basePrice = pkg.price * numPeople
  const tax = Math.round(basePrice * 0.18)
  const total = basePrice + tax

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Travel Date:</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {selectedDate && (
        <div className="mb-6 mt-4">
          <h3 className="text-lg font-semibold mb-2">Number of People Going:</h3>
          <Input
            type="number"
            min={1}
            max={29}
            placeholder="Enter number of people"
            value={numPeople || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (!isNaN(value)) {
                setNumPeople(Math.min(value, 29))
              } else {
                setNumPeople(0)
              }
            }}
            className="w-[200px]"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Payment Summary</h1>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>Base Price (₹{pkg.price} × {numPeople}): ₹{basePrice}</li>
          <li>GST (18%): ₹{tax}</li>
          <li className="font-semibold text-blue-700">Total: ₹{total}</li>
        </ul>
      </div>



      <h3 className="text-lg font-semibold mb-2">Choose Payment Method:</h3>
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-2 mb-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi">UPI</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card">Credit / Debit Card</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paylater" id="paylater" />
          <Label htmlFor="paylater">Pay Later</Label>
        </div>
      </RadioGroup>

      <Button
        className="w-full"
        disabled={!selectedDate || numPeople < 1}
        onClick={handleBookingSubmit}
      >
        Proceed to Pay ₹{total}
      </Button>

    </div>
  )
}

