import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProject from "hooks/useProject";
import Personae from "components/project/Personae";
import ErrorPage from "components/project/Error";

const ProjectPage = () => {
  const htmlTitle = "ACES - Project Personae";
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProject(pid);

  if (isLoading) return <></>;

  if (isError) return <ErrorPage title={htmlTitle} code={pid} message="Not Found" />

  return <>
    <Head>
      <title>{htmlTitle}</title>
    </Head>

    <Hero user={user} project={project} title="Personae" />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t">
        <Personae user={user} project={project} />
      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;