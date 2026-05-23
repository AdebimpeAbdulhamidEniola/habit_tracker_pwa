"use client"

import React from "react"
import ProtectedRoutes from "@/components/auth/ProtectedRoutes"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoutes>
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </ProtectedRoutes>
    )
}