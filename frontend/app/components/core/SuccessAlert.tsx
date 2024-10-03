'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

interface SuccessAlertProps {
  message: string
  duration?: number
}

export default function SuccessAlert({ message, duration = 5000 }: SuccessAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert 
        variant="default" 
        className="animate-in fade-in slide-in-from-top-5 border-green-500 bg-green-50 text-green-900"
      >
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}