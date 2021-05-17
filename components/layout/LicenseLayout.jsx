import { LicenseHeader } from "./LicenseHeader"

export const LicenseLayout = ({ children, hero = true }) => {
  return (
    <div className="min-h-screen bg-gray-100s bg-opacity-50 bg-gradient-to-t from-white">
      {hero && <LicenseHeader />}
      {children}
    </div>
  )
}