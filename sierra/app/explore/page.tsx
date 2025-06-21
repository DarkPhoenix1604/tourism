"use client"
import Image from "next/image";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"

interface Package {
    _id: string // MongoDB document ID
    name: string
    description: string
    price: number
    images: string[]
}

export default function ExplorePage() {
    const router = useRouter()
    const [tourismPackages, setTourismPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/explore/packages") // replace with deployed URL in prod
                const data = await res.json()
                setTourismPackages(data)
            } catch (err) {
                console.error("Failed to fetch packages:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPackages()
    }, [])

    const handleBuy = (pkg: Package) => {
        router.push(`/payment?pkgId=${pkg._id}`)
    }

    if (loading) return <div className="p-10 text-center">Loading packages...</div>

    return (
        <div className="w-full">
            {tourismPackages.map((pkg) => (
                <div key={pkg._id} className="w-full min-h-screen flex flex-col border-b border-gray-300">
                    <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
                        <CarouselContent>
                            {pkg.images.map((url, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full h-[500px]">
                                        <Image
                                            src={url}
                                            alt={`Image ${index + 1} of ${pkg.name}`}
                                            fill
                                            className="object-cover rounded-xl"
                                            sizes="100vw"
                                            priority={index === 0}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>

                    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-4">
                        <h2 className="text-3xl font-bold">{pkg.name}</h2>
                        <p className="text-gray-700 text-lg">{pkg.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 text-2xl font-semibold">₹{pkg.price}</span>
                            <Button onClick={() => handleBuy(pkg)}>Buy Now</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
