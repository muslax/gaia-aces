import { LicenseLayout } from "components/layout/LicenseLayout";
import Dashboard from "components/license/Dashboard";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";

const LicensePage = () => {
  const { user } = useUser()

  return <>
    <Head>
      <title>LicensePage</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist">
        <Dashboard user={user} />
      </div>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;