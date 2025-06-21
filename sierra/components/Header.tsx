'use client'
import { SignedOut, SignedIn, useUser, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
    const {user} = useUser();
  return (
    <div className="flex items-center justify-between p-5">
    {user && (
        <h1 className="text-2xl">{user?.firstName}{`'s`} Space</h1>
    )}

    <SignedOut>
      <SignInButton/>
    </SignedOut>
    <SignedIn>
      <UserButton/>
    </SignedIn>

    </div>
  )
}

export default Header

