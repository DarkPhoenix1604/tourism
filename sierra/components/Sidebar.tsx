"use client"
import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

function Sidebar() {
    const router = useRouter()
    const menuOptions = (
        <>
        <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/explore")}>explore</Button>
            <Button onClick={() => router.push("/bookings")}>bookings</Button>
            <Button onClick={() => router.push("/wishlist")}>wishlist</Button>
            <Button onClick={() => router.push("/accounts")}>accounts</Button>
        </div>
        </>
    );
    return (
        <div className="p-2 md:p-5 bg-gray-200 relative">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>
                                {menuOptions}
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden md:inline">{menuOptions}</div>
        </div>
    )
}
export default Sidebar;