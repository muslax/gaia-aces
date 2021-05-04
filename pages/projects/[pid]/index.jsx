import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProjectHeader from "hooks/useProjectHeader";
import Info from "components/project/Info";
import { setLocalStorage } from "lib/storage";
import ErrorPage from "components/project/Error";


const ProjectPage = () => {
  const htmlTitle = "ACES - Project Overview"
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProjectHeader(pid);

  if (isLoading) return <></>;

  if (isError) return <ErrorPage title={htmlTitle} code={pid} message="Not Found" />

  setLocalStorage(project);

  return <>
    <Head>
      <title>{htmlTitle}</title>
    </Head>

    <Hero user={user} project={project} title="Project Info" isIndex />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t border-gray-300">
        <Info user={user} project={project} />
      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;