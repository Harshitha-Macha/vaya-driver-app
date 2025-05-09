"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
}

export default function OtpInput({ value, onChange, length = 4 }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split("").concat(Array(length - value.length).fill("")))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    // Update internal state when value prop changes
    setOtp(value.split("").concat(Array(length - value.length).fill("")))
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value

    // Only accept numbers
    if (!/^\d*$/.test(newValue)) return

    // Take the last character if multiple characters are pasted
    const digit = newValue.slice(-1)

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Call the onChange callback with the new value
    onChange(newOtp.join(""))

    // Move focus to the next input if a digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only accept numbers
    if (!/^\d+$/.test(pastedData)) return

    // Take only the first 'length' characters
    const digits = pastedData.slice(0, length).split("")

    // Fill the OTP array with the pasted digits
    const newOtp = [...Array(length).fill("")]
    digits.forEach((digit, index) => {
      newOtp[index] = digit
    })

    setOtp(newOtp)
    onChange(newOtp.join(""))

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          // ref={(el) => (inputRefs.current[index] = el)}
          ref={(el) => {inputRefs.current[index] = el;}}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-black"
        />
      ))}
    </div>
  )
}
