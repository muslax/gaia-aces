import { LicenseLayout } from "components/layout/LicenseLayout";
import FormUser from "components/license/FormUser";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";

const LicensePage = () => {
  const { user, isLoading, mutateUser } = useUser()
  const router = useRouter();

  if (!user.licenseOwner || user.licenseType == 'personal') router.push(ROUTES.Users);

  if (isLoading || !user.licenseOwner) return null;

  return <>
    <Head>
      <title>ACES - New User</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist">
        <FormUser user={user} mutate={mutateUser} />
      </div>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;