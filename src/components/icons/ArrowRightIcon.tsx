export interface ArrowRightIconProps {
  width?: number
  height?: number
  className?: string
  'aria-hidden'?: boolean
}

export default function ArrowRightIcon({
  width = 21,
  height = 15,
  className,
  'aria-hidden': ariaHidden = true,
}: ArrowRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 21 15"
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M13.0967 14.2965L19.8827 7.29803L13.0967 0.296509" />
      <path d="M19.8816 7.29785H0" />
    </svg>
  )
}
