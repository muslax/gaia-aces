import { ACESGray } from "components/ACESIcons";
import { API_ROUTES, ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import fetchJson from "lib/fetchJson";
import Link from 'next/link';
import { useRouter } from "next/router";

export const LicenseHeader = () => {
  const { user, isLoading, mutateUser } = useUser();

  const handleLogout = async (e) => {
    e.preventDefault()
    await mutateUser(fetchJson(API_ROUTES.Logout, { method: 'POST' }))
    router.push(ROUTES.Home)
  }

  async function updateSession() {
    const url = '/api/post?q=test-update-session'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        key: 'licenseLogoUrl',
        value: 'https://res.cloudinary.com/ptkj/image/upload/v1618901451/aces/g8fmbc2rv37qkk20p6ev.jpg'
      })
    })

    if (response) mutateUser();
  }

  return <>
    <div className="aces-wrap bg-white border-b border-gray-200">
      <div className="aces-geist py-4">
        <div className="flex h-7 items-center">
          <div className="flex mr-3 border-r- border-gray-300">
            <Link href="/">
              <a className="inline-block">
                <ACESGray className="h-6" />
              </a>
            </Link>
          </div>
          <div className="flex flex-grow">
            <div className="inline-flex items-center text-gray-800s hover:text-gray-600">
              <span className="text-sm text-gray-600">
                By Gaia Solutions
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs">
            <div className="hidden sm:block font-semibold uppercase">
              {user && user.fullname}
            </div>
            <div className="text-xs text-gray-600 leading-4 ml-3">
              <Link href={API_ROUTES.Logout}>
                <a
                  onClick={handleLogout}
                  className="inline-flex rounded bg-gray-500 text-white hover:bg-gray-600 font-medium px-2 py-1"
                >
                  Logout
                </a>
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="my-4">
          <button
            className="inline-flex rounded-sm border border-plum-400 hover:border-plum-600 hover:bg-plum-600 text-plum-600 font-medium hover:text-white px-2 py-1"
            onClick={updateSession}
          >
            Update Cookie
          </button>
        </div> */}
      </div>
    </div>
    <Hero user={user} isLoading={isLoading} />
    <Navigation />
  </>;
}

const Hero = ({ user, isLoading }) => {
  return (
    <div className="aces-wrap bg-white">
      <div className="aces-geist py-8">
        <div className="flex justify-center sm:justify-start">
          <div className="">
            <div className="flex flex-row items-center justify-center">
              <div className="flex-0 mr-4 sm:mr-5 -ml-8 sm:-ml-1">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-100 shadow-sm">
                  {user && user.licenseLogoUrl && (
                    <img
                      id="licenseLogo"
                      src={user.licenseLogoUrl}
                      width='100%'
                      height='100%'
                      className="w-full h-full object-contain rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex-0 md:flex-grow">
                {isLoading && <>
                  <div className="text-xs text-gray-400 leading-tight uppercase md:mb-1">
                    ACES License Type
                  </div>
                  <div className="license-name text-2xl sm:text-3xl lg:text-4xl text-gray-400 leading-snug tracking-tight">
                    License Name
                  </div>
                  <div className="text-xs text-gray-400 md:mt-1">
                    Expiry Date
                  </div>
                </>}
                {user && <>
                  <div className="text-xs text-gray-500 leading-tight uppercase md:mb-1">
                    Aces {user.licenseType} License
                  </div>
                  <div className="license-name text-2xl sm:text-3xl lg:text-4xl text-gray-800 leading-snug tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-500">
                      {user.licenseName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 md:mt-1">
                    {user.licenseExpiryDate.substr(0, 10)}
                  </div>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Navigation = () => {
  const router = useRouter()
  const path = router.pathname
  const navigation = [
    { label: 'Dashboard', href: ROUTES.Dashboard },
    { label: 'Clients', href: ROUTES.Clients },
    { label: 'Users', href: ROUTES.Users },
    { label: 'License', href: ROUTES.License },
    { label: 'Billing', href: ROUTES.Billing },
  ]

  const normal = "block pt-1 pb-1 border-b-4 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-600"
  const active = "block pt-1 pb-1 text-plum-600 border-b-4 border-plum-500 hover:text-plum-600"

  return (
    <div className="aces-wrap bg-white border-b border-gray-300">
      <div className="aces-geist -mb-px">
        <ul className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
        {navigation.map(({ label, href }, index) => (
          <li key={href} className={index ? 'ml-6 sm:ml-8 lg:ml-8' : ''}>
            <Link href={href}>
              <a className={href === path ? active : normal}>
                <div className="">
                  {label}
                </div>
              </a>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}