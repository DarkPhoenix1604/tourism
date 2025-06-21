"use client"
import { Button } from "./ui/button"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
function NewDocumentButton() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const handleCreateNewDocument = () => {
        startTransition(async() => {
            // const { docId } = await CreateNewDocument();
            // router.push(`/oc/${docId}`)
        })
    }
    return (
        <Button onClick={handleCreateNewDocument} disabled={!isPending}>New Document</Button>
    )
}
export default NewDocumentButton