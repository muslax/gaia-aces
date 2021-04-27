import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProjectHeader from "hooks/useProjectHeader";
import Info from "components/project/Info";

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProjectHeader(pid);

  if (isLoading) return <></>;
  if (isError) { router.push('/not-found') }


  return <>
    <Head>
      <title>ACES - Project Overview</title>
    </Head>

    <Hero project={project} title="Project Info" />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t border-gray-300">
        {/* <pre> {JSON.stringify(project, null, 2)} </pre> */}
        <Info user={user} project={project} pid={pid} />
      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;