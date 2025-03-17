"use client"

import { useEffect, useState } from "react"

export function useBreakpoint(breakpoint: number): boolean {
  const [isBelow, setIsBelow] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkSize()

    // Add event listener
    window.addEventListener("resize", checkSize)

    // Clean up
    return () => window.removeEventListener("resize", checkSize)
  }, [breakpoint])

  return isBelow
}

