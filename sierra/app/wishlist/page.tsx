"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarDays, Edit, Trash2, Save } from "lucide-react"
import { format } from "date-fns"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

interface Place {
  id: number
  name: string
  date: Date
  isEditing?: boolean
}

export default function ExplorePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [newPlace, setNewPlace] = useState("")
  const [newDate, setNewDate] = useState<Date | undefined>()
  const [idCounter, setIdCounter] = useState(1)
  const { user } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || ""

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/wishlist/user/${userEmail}`)
        const data = await res.json()
        const formattedPlaces = data.map((item: any, index: number) => ({
          id: index + 1,
          name: item.placeName,
          date: new Date(item.visitDate),
        }))
        setPlaces(formattedPlaces)
        setIdCounter(formattedPlaces.length + 1)
      } catch (err) {
        console.error("Failed to fetch itinerary:", err)
      }
    }

    if (userEmail) fetchItinerary()
  }, [userEmail])

  const handleAddPlace = async () => {
    if (newPlace.trim() === "" || !newDate) return
    if (places.find((p) => p.name.toLowerCase() === newPlace.trim().toLowerCase())) return

    const newEntry = {
      id: idCounter,
      name: newPlace.trim(),
      date: newDate,
    }
    setPlaces([...places, newEntry])
    setNewPlace("")
    setNewDate(undefined)
    setIdCounter(idCounter + 1)

    try {
      const res = await fetch("http://localhost:8000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          places: [
            {
              name: newEntry.name,
              visitDate: newEntry.date.toISOString(),
            },
          ],
        }),
      })
      if (!res.ok) throw new Error("Failed to save place")
    } catch (err) {
      console.error("Error saving place:", err)
    }
  }

  const handleDelete = async (id: number) => {
    const deleted = places.find((p) => p.id === id)
    setPlaces(places.filter((p) => p.id !== id))

    try {
      await fetch(`http://localhost:8000/api/wishlist/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          placeName: deleted?.name,
        }),
      })
    } catch (err) {
      console.error("Error deleting place:", err)
    }
  }

  const handleEditToggle = (id: number) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEditing: !p.isEditing } : { ...p, isEditing: false }))
    )
  }

  const handleNameChange = (id: number, newName: string) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, name: newName } : p)))
  }

  const handleDateChange = (id: number, newDate: Date) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, date: newDate } : p)))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-6">Plan Your Trip</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <Input
          placeholder="Add a new place..."
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-gray-300">
                <CalendarDays className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {newDate && (
            <span className="text-sm text-muted-foreground">
              {format(newDate, "PPP")}
            </span>
          )}
        </div>
        <Button onClick={handleAddPlace} disabled={!newPlace || !newDate}>
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex justify-between items-center"
          >
            <div className="flex-1">
              {place.isEditing ? (
                <Input
                  value={place.name}
                  onChange={(e) => handleNameChange(place.id, e.target.value)}
                  className="mb-2"
                />
              ) : (
                <h2 className="text-lg font-semibold">{place.name}</h2>
              )}
              <p className="text-sm text-gray-500">📅 {format(place.date, "PPP")}</p>
            </div>

            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="icon" onClick={() => handleEditToggle(place.id)}>
                <Edit size={18} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarDays size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={place.date}
                    onSelect={(date) => date && handleDateChange(place.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(place.id)}>
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}