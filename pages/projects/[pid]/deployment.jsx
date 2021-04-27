import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProjectHeader from "hooks/useProjectHeader";

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProjectHeader(pid);
  const currentBatch = window.localStorage.getItem("batch");

  if (isLoading) return <></>;
  if (isError) { router.push('/not-found') }


  return <>
    <Head>
      <title>ACES - Project Deployment</title>
    </Head>

    <Hero project={project} title="Deployment" />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t">
        <pre>
          {JSON.stringify(project, null, 2)}<br/>
          {/* {JSON.stringify(batch, null, 2)}<br/> */}
        </pre>      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;