'use client';

import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useUser();
  const [role, setRole] = useState<"student" | "host" | null>(null);

  const fetchUserRole = async () => {
    if (user?.primaryEmailAddress) {
      try {
        // Check if role is stored in localStorage
        const storedRole = localStorage.getItem("userRole");
        const storedUserId = localStorage.getItem("userId");

        if (storedRole && storedUserId) {
          setRole(storedRole as "student" | "host");
        } else {
          // If role not found in localStorage, fetch it from the API
          const response = await fetch("/api/getUserRole", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
          });

          if (response.ok) {
            const data = await response.json();
            const userRole = data.role?.toLowerCase() || null;

            if (userRole) {
              setRole(userRole as "student" | "host");
              localStorage.setItem("userRole", userRole);
              localStorage.setItem("userId", data.hostId);
            } else {
              // Redirect to onboarding if no role is found
              window.location.href = "/Onboarding";
            }
          } else {
            console.error("Failed to fetch user role:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
  };

  useEffect(() => {
    if (user && role == null && window.location.pathname !== '/Onboarding') {
      fetchUserRole();
    }
    if(!user){
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    }
  }, [user]);



  useEffect(()=> {
    if(role == null && user){
      fetchUserRole()
    }
    
  },[role])

  return (
    <header className="flex justify-between items-center p-5">
      <Link href="/">
        <h1 className="text-blue-600 text-lg font-bold">Career Explorer</h1>
      </Link>
      <nav className="flex space-x-4">
        <Link href="/Explore" className="text-gray-600">
          Search
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl={"/Onboarding"} />
          {() => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
          }}
        </SignedOut>
        <SignedIn>
          {role === "student" && (
            <Link href="/registered_events" className="text-gray-600">
              Your Events
            </Link>
          )}
          {role === "host" && (
            <Link href="/manage_events" className="text-gray-600">
              Events
            </Link>
          )}
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}
