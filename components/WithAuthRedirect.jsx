import useUser from "hooks/useUser"
import { useEffect } from "react"
import { NoPageFlicker } from "./NoPageFlicker"
import { NO_PAGE_FLICKER_CLASSNAME } from "./NoPageFlicker"

const handleAuthRedirect = (user, {
  redirectAuthenticatedTo,
  redirectUnAuthenticatedTo,
}) => {
  if (typeof window === 'undefined') return

  if (!user || user.isLoggedIn === false) {
    if (redirectUnAuthenticatedTo !== undefined) {
      const url = new URL(redirectUnAuthenticatedTo, window.location.href)
      window.location.replace(url.toString())
    }
  } else {
    if (redirectAuthenticatedTo !== undefined) {
      window.location.replace(redirectAuthenticatedTo)
    }
  }
}

export function WithAuthRedirect({ children, ...props }) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    document.documentElement.classList.add(NO_PAGE_FLICKER_CLASSNAME);
  }, []);

  if (typeof window !== undefined) {
    console.log('props.redirectAuthenticatedTo', (props.redirectAuthenticatedTo ? props.redirectAuthenticatedTo : '-'))
    console.log('props.redirectUnAuthenticatedTo', (props.redirectUnAuthenticatedTo ? props.redirectUnAuthenticatedTo : '-'))
  }

  if (isLoading) return <></>;

  handleAuthRedirect(user, props);

  const noPageFlicker = (
    props.suppressFirstRenderFlicker ||
    props.redirectUnAuthenticatedTo ||
    props.redirectAuthenticatedTo
  );

  return <>
    {noPageFlicker && <NoPageFlicker />}
    {children}
  </>;
}