import type { CSSProperties } from 'react'

interface SpacerSectionProps {
  heightDesktop?: number | null
  heightMobile?: number | null
}

const isValidSpacerStep = (value: number | null | undefined) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6

export default function SpacerSection({ heightDesktop, heightMobile }: SpacerSectionProps) {
  const safeDesktopHeight = isValidSpacerStep(heightDesktop)
    ? heightDesktop
    : 6
  const safeMobileHeight = isValidSpacerStep(heightMobile)
    ? heightMobile
    : 6

  return (
    <section
      className="spacer-section"
      style={
        {
          '--spacer-height-desktop': safeDesktopHeight,
          '--spacer-height-mobile': safeMobileHeight,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  )
}
