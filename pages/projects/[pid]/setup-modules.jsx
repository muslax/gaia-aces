import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import getProject from "hooks/useProject";
import ErrorPage from "components/project/Error";
import { SetupModules } from 'components/project/modules';

const ProjectPage = () => {
  const htmlTitle = "ACES - Setup Modules";
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError, mutate } = getProject(pid);

  if (isLoading) return <></>;

  if (isError) return <ErrorPage title={htmlTitle} code={pid} message="Not Found" />

  if (user.username != project.admin.username) router.push(`/projects/${project._id}/modules`);

  return <>
    <Head>
      <title>{htmlTitle}</title>
    </Head>

    <Hero user={user} project={project} title="ACES Modules" />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t">
        <SetupModules user={user} project={project} mutate={mutate} />
      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;