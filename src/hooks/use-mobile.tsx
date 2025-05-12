'use client'
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // For some older browsers, use addListener fallback
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }

    // Initial check
    setIsMobile(mql.matches)

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return isMobile
}
