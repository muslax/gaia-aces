import Head from "next/head";

export default function ErrorPage({ title, code, message }) {
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <div className="aces-wrap pb-28">
      <div className="aces-geist border-t border-gray-300">
        <div className="text-center text-gray-300 text-3xl font-light my-20">
          <span className="inline-block font-mono border-b-2 pb-2">{code}</span>
          <p className="text-7xl font-bold">&lt;{message}/&gt;</p>
        </div>
      </div>
    </div>
  </>
}