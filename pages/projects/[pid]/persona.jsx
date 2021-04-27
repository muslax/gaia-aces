import { ProjectLayout } from "components/layout/ProjectLayout";
import { Hero } from "components/project/Hero";
import { ROUTES } from "config/routes";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import useProjectHeader from "hooks/useProjectHeader";
import create from "zustand";

const useStore = create((set, get) =>({
  currentBatch: "LOBAK",
  setCurrentBatch: (_batch) => set((state) => ({ currentBatch: _batch }))
}))

const ProjectPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { pid } = router.query;
  console.log('PID', pid)
  const { project, isLoading, isError } = useProjectHeader(pid);

  if (isLoading) return <></>;
  if (isError) { router.push('/not-found') }


  return <>
    <Head>
      <title>ACES - Project Personae</title>
    </Head>

    <Hero project={project} title="Personae" store={useStore} />

    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t">

      {/* <pre>
        PROJECT: {window.localStorage.getItem('project')}<br/>
        BATCH  : {window.localStorage.getItem('batch')}
      </pre> */}

      <br/>
      <pre>
        {JSON.stringify(project, null, 2)}<br/>
        {/* {JSON.stringify(batch, null, 2)}<br/> */}
      </pre>



      </div>
    </div>
  </>;
}

ProjectPage.suppressFirstRenderFlicker = true;
ProjectPage.redirectUnAuthenticatedTo = ROUTES.Login;
ProjectPage.getLayout = (page) => <ProjectLayout>{page}</ProjectLayout>;

export default ProjectPage;