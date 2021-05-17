import FormRow from "components/form/FormRow";
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
      <div className="aces-geist py-6">
        <div className="rounded border border-gray-300 pt-3 pb-2 mb-6x">
          <FormRow label="Kolom panjang perlu pendek" placeholder="Test" />
          <FormRow label="Kolom panjang perlu pendek" value="Disable" disabled />
          <FormRow label="Kolom panjang perlu pendek" type="date" disabled value="2021-06-21" />
          <FormRow label="Kolom panjang perlu pendek" type="textarea" />
          <FormRow label="Kolom panjang perlu pendek" value="Notation" type="" />
        </div>
      </div>
    </div>
  </>;
}

LicensePage.suppressFirstRenderFlicker = true;
LicensePage.redirectUnAuthenticatedTo = ROUTES.Login;
LicensePage.getLayout = (page) => <LicenseLayout hero={false}>{page}</LicenseLayout>;

export default LicensePage;