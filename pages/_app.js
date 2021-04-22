import { WithAuthRedirect } from 'components/WithAuthRedirect';
// import { WithSkeletonLoader } from 'components/WithSkeletonLoader';
import fetchJson from 'lib/fetchJson';
import { pick } from 'lib/utils';
import { SWRConfig } from 'swr';
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
  // const skeletonLoader = Component.skeletonLoader;
  const getLayout = Component.getLayout || ((page) => page);

  const authRedirect = pick(
    Component,
    'redirectAuthenticatedTo',
    'redirectUnAuthenticatedTo',
    'suppressFirstRenderFlicker',
  )

  // return <Component {...pageProps} />
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        }
      }}
    >
      <WithAuthRedirect {...authRedirect}>
        {/* <WithSkeletonLoader skeletonLoader={skeletonLoader}> */}
          {getLayout(<Component {...pageProps} />)}
        {/* </WithSkeletonLoader> */}
      </WithAuthRedirect>
    </SWRConfig>
  )
}

export default MyApp
