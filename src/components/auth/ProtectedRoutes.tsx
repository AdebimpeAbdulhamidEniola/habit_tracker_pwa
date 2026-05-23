"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "../shared/SplashScreen"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const router = useRouter()

    useEffect(() => {
        //fixed react not likely setting state directly inside useefffect by creating the effect logic as function adand calling the function
        const checkAuth = () => {
            try {
                const sessionString = localStorage.getItem("habit-tracker-session")

                if (sessionString) {
                    const sessionData = JSON.parse(sessionString)

                    if (sessionData.userId) {
                        setIsAuthenticated(true)
                    } else {
                        router.replace("/login")
                    }
                } else {
                    router.replace("/login")
                }
            } catch (error: unknown) {
                router.replace("/login")
            } finally {
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [router])

    if (isChecking) {
        return <SplashScreen />
    }

    if (!isAuthenticated) {
        return null
    }

    return children
}

export default ProtectedRoutes