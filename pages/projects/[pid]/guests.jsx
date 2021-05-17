import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProject from "hooks/useProject";
import ErrorPage from "components/project/Error";
import { Guests } from "components/project/guests";
import { useState } from "react";

const ProjectPage = () => {
  const htmlTitle = "ACES - Project Guests";
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProject(pid);

  const [hero, setHero] = useState(true)

  if (isLoading) return <></>;

  if (isError) return <ErrorPage title={htmlTitle} code={pid} message="Not Found" />

  return <>
    <Head>
      <title>{htmlTitle}</title>
    </Head>

    {hero && <Hero user={user} project={project} title="Guests" />}

    <div className="aces-wrap pb-28">
      <div className="aces-geist">
        <Guests user={user} project={project} setHero={setHero} />
      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;