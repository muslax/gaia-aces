import { API_ROUTES } from "config/routes";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from 'next/image'

const { ACESGray } = require("components/ACESIcons");
const { useLicense } = require("hooks/useLicense");
const { default: useUser } = require("hooks/useUser");
const { default: Link } = require("next/link");

const ProjectHeader = () => {
  const { user, mutateUser } = useUser();
  const { license, isLoading  } = useLicense();
  const router = useRouter();
  const { pid } = router.query;
  const path = router.asPath;

  useEffect(() => {
    const h = document.getElementById("page-nav").clientHeight
    document.getElementById("page-nav-pad").style.height = h + 'px'
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault()

    await mutateUser(fetchJson(API_ROUTES.Logout, { method: 'POST' }))

    router.push(ROUTES.Home)
  }

  const navigation = [
    { label: 'Overview', href: `/projects/${pid}` },
    { label: 'Modules', href: `/projects/${pid}/modules` },
    { label: 'Persona', href: `/projects/${pid}/persona` },
    { label: 'Guests', href: `/projects/${pid}/guests` },
    { label: 'Deployment', href: `/projects/${pid}/deployment` },
  ]

  // const normal = "block pt-1 pb-2 border-b-4 border-transparent hover:border-indigo-200 text-gray-500 hover:text-indigo-500"
  // const active = "block pt-1 pb-2 text-indigo-600 border-b-4 border-indigo-500 hover:text-indigo-600"
  const normal = "block pt-2 pb-2 border-b-4 border-transparent hover:border-gray-200 text-gray-500 hover:text-green-600"
  const active = "block pt-2 pb-2 text-green-600 border-b-4 border-green-500 hover:text-green-600"

  return <>
    <div id="page-nav" className="bg-white shadow-sms border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="aces-wrap">
        <div className="aces-geist py-4">
          <div className="flex h-7 items-center">
            <div className="flex mr-3 pr-3 md:border-r border-gray-300">
              <Link href="/">
                <a className="inline-block">
                  <ACESGray className="h-6" />
                </a>
              </Link>
            </div>
            <div className="flex flex-grow justify-center md:justify-start text-sm text-gray-800">
              <Link href="/dashboard">
                <a className="inline-flex items-center hover:text-gray-600">
                  <div className="rounded-full bg-gray-100 w-7 h-7 mr-2">
                    {(user?.licenseLogoUrl || license?.logoUrl ) && <Image
                      src={license?.logoUrl ?? user?.licenseLogoUrl}
                      width={28}
                      height={28}
                      className="object-contain rounded-full w-7 h-7"
                    />}
                  </div>
                  <span className="font-bold">
                    {user?.licenseName}
                  </span>
                </a>
              </Link>
            </div>
            <div className="flex items-center text-xs">
              <div className="hidden md:block text-gray-600 font-semibold">
                {user && user.fullname}
              </div>
              <div className="text-xs text-gray-600s leading-4 ml-4">
                <Link href={API_ROUTES.Logout}>
                  <a
                    onClick={handleLogout}
                    className="inline-flex rounded-sm border border-gray-200 hover:border-gray-600 hover:bg-gray-600 text-gray-500 font-medium hover:text-white px-2 py-1"
                  >
                    Logout
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* <div className="aces-wrap bg-white border-b border-gray-300"> */}
        <div className="aces-geist -mb-pxs">
          <ul className="flex items-center justify-center md:justify-start text-sm text-gray-500">
          {navigation.map(({ label, href }, index) => (
            <li key={href} className={index ? 'pt-1 ml-5 sm:ml-6 md:ml-8 lg:ml-9' : 'pt-1'}>
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
    </div>
    <div id="page-nav-pad" className=""></div>
  </>;
}

export default ProjectHeader