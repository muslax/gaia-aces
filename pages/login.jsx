import { WebLayout } from "components/layout/WebLayout";
import { ROUTES } from "config/routes";
import Head from "next/head";

const LoginPage = () => {

  return <>
    <Head>
      <title>LoginPage</title>
    </Head>
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Login</h1>
      <a className="text-blue-500" href="/protected">PROTECTED</a>
    </div>
  </>;
}

LoginPage.suppressFirstRenderFlicker = false;
LoginPage.redirectAuthenticatedTo = ROUTES.Dashboard;
LoginPage.getLayout = (page) => <WebLayout>{page}</WebLayout>;

export default LoginPage;