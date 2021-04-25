import { LicenseLayout } from "components/layout/LicenseLayout";
import FormProject from "components/license/FormProject";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";

const LicensePage = () => {
  const { user, isLoading } = useUser();
  
  const router = useRouter();

  if (!user.licenseOwner) router.push(ROUTES.Dashboard);

  if (isLoading || !user.licenseOwner) return null;

  return <>
    <Head>
      <title>ACES - New Project</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist">
        <FormProject user={user} />
      </div>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;