export function Logo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="56" height="56" rx="12" fill="#4f46e5" fillOpacity="0.1"/>
      <path d="M20 32L28 40L44 24" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}