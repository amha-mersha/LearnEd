'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { useTranslations } from 'next-intl'

interface ErrorAlertProps {
  message: string
  duration?: number
}

export default function ErrorAlert({ message, duration = 5000 }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const t = useTranslations("AppComponentsCore")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md bg-red-50">
      <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-5">
        <XCircle className="h-4 w-4" />
        <AlertTitle>{t("Error")}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}