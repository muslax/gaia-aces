import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProjectHeader from "hooks/useProjectHeader";
import Info from "components/project/Info";

function getActiveBatchId(project) {
  const lsBatch = window.localStorage.getItem("batch");
  let validId = false;
  project.batches.forEach(b => {
    if (b._id == lsBatch) {
      validId = true;
    }
  })

  if (validId) {
    return lsBatch;
  } else {
    if (project.batches.length > 0) {
      const batchId = project.batches[0]["_id"];
      window.localStorage.setItem('batch', batchId);
      return batchId;
    }
  }

  window.localStorage.setItem('batch', null);
  return null;
}

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  const { project, isLoading, isError } = useProjectHeader(pid);
  
  if (isLoading) return <></>;
  if (isError) { router.push('/not-found') }
  
  getActiveBatchId(project);

  return <>
    <Head>
      <title>ACES - Project Overview</title>
    </Head>

    <Hero project={project} title="Project Info" isIndex />

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