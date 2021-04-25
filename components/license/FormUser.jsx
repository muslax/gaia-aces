import { ROUTES } from "config/routes";
import fetchJson from "lib/fetchJson";
import Link from "next/link";
import { useState } from "react";
import Heading from "./Heading";

export default function FormUser({ user, mutate }) {
  // const { mutate } = useUsers();
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdUser, setCreatedUser] = useState(null)

  async function SubmitUser(e) {
    e.preventDefault();
    setSubmitting(true);

    const url = "/api/post?q=new-user"
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        fullname: fullname,
        username: username,
        email: email
      }),
    })

    if (response) {
      setSubmitting(false);
      setCreatedUser(response);
      mutate()
    }
  }

  return <>
    <Heading title="Add New User">
      <Link href={ROUTES.Users}>
        <a className="inline-flex items-center bg-white shadow-sm hover:shadow rounded-sm px-4 h-8 border border-red-400 hover:border-red-500 text-sm text-red-500 font-semibold">
          Cancel
        </a>
      </Link>
    </Heading>
    <div className="rounded-md border px-3 py-3">
      {!createdUser && (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-bs">
            <td colspan="2" className="px-2 py-2 text-lgs">
              Semua kolom harus diisi.
            </td>
          </tr>
          <tr className="border-bs">
            <td colspan="2" className="px-2">
              <div className={(submitting ? 'progress' : '') + " h-1 bg-gray-200s border-t border-gray-400"}></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2 pt-5">Nama lengkap:</td>
            <td className="p-2 pt-5">
              <input type="text"
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Email:</td>
            <td className="p-2">
              <input type="text"
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Username:</td>
            <td className="p-2">
              <input type="text" placeholder="Minimal 6 karakter"
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Password:</td>
            <td className="p-2">
              <input type="text" disabled placeholder="Password akan dibuat oleh sistem"
                className="w-full text-sm rounded border border-gray-300 bg-gray-100 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-3"></td>
            <td className="p-3 text-white">
              <button
                className="h-8 px-5 focus:outline-none rounded bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 font-medium mr-3"
                onClick={SubmitUser}
              >
                Save User
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      )}
      {createdUser && (
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-bs">
            <td colspan="2" className="px-2 py-2 text-lgs">
              Berhasil menyimpan data user.
            </td>
          </tr>
          <tr className="border-bs">
            <td colspan="2" className="px-2">
              <div className="h-1 bg-gray-200s border-t border-gray-400"></div>
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2 pt-5">Nama lengkap:</td>
            <td className="p-2 pt-5">
              <input type="text" disabled value={createdUser.fullname}
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Email:</td>
            <td className="p-2">
              <input type="text" disabled value={createdUser.email}
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Username:</td>
            <td className="p-2">
              <input type="text" disabled value={createdUser.username}
                className="w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Password:</td>
            <td className="p-2">
              <input type="text" disabled value={createdUser.password}
                className="w-full text-sm rounded border border-gray-300 bg-gray-100 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2"
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2"></td>
            <td className="p-2 text-white">
              <button
                className="inline-flex items-center h-8 px-5 focus:outline-none rounded bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 font-medium mr-3"
                onClick={e => {
                  setEmail('')
                  setFullname('')
                  setUsername('')
                  setCreatedUser(null);
                }}
              >
                Create More
              </button>
              <a href="/users"
                className="inline-flex items-center h-8 px-5 focus:outline-none rounded bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 font-medium mr-3"
              >
                Done
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      )}
    </div>
    <style jsx>{`
      .progress {
        background-image: url(/mango-in-progress-01.gif);
      }
    `}</style>
  </>
}