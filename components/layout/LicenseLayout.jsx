import useUser from "hooks/useUser";
import { LicenseHeader } from "./LicenseHeader"

export const LicenseLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-200 bg-opacity-50 bg-gradient-to-t from-white">
      <LicenseHeader />
      {children}
    </div>
  )
}