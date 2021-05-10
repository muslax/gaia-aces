import Head from "next/head";

export default function ErrorPage({ title, code, message }) {
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t border-gray-300">
        <div className="text-center text-gray-300 text-xl font-light my-20">
          <span className="inline-block font-mono border-b-2 pb-2 mb-1">{code}</span>
          <p className="text-2xl font-bold">Project Not Found</p>
        </div>
      </div>
    </div>
  </>
}