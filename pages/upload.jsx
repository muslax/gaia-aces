import { LicenseLayout } from "components/layout/LicenseLayout";
import Upload from "components/license/Upload";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";

const LicensePage = () => {
  const { user, isLoading, mutateUser } = useUser()
  const router = useRouter();

  if (!user.licenseOwner) router.push(ROUTES.Users);

  if (isLoading || !user.licenseOwner) return null;

  return <>
    <Head>
      <title>ACES - Upload Logo</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist">
        <Upload user={user} />
      </div>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;