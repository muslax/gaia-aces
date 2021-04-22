import { LicenseLayout } from "components/layout/LicenseLayout";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";

const LicensePage = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return (
    <div className="h-40 bg-yellow-500">
      ...
    </div>
  );

  return <>
    <Head>
      <title>LicensePage</title>
    </Head>
    <div className="max-w-xl mx-auto">
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout>{page}</LicenseLayout>;

export default LicensePage;