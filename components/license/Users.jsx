import useUsers from "hooks/useUsers";
import fetchJson from "lib/fetchJson";
import Link from "next/link";
import { useState } from "react";
import Heading from "./Heading";

export default function Users({ user }) {
  const { users, isLoading, isError, mutate } = useUsers();

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [resetUserResponse, setUserResetResponse] = useState(null)
  const [passwordDialog, setPasswordDialog] = useState(false)

  if (isError || isLoading) return <></>;

  async function DeleteUser() {
    if (!selected) return false;

    setModal('Deleting user...');

    const url = '/api/post?q=delete-user';
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected}),
    })

    if (response) {
      mutate()
    }

    setSelected(null);
    setModal(null);
  }

  async function DisableUser() {
    if (!selected) return false;

    setModal('Deactivating user...');

    const url = '/api/post?q=disable-user';
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected}),
    })

    if (response) {
      mutate()
    }

    setSelected(null);
    setModal(null);
  }

  async function ActivateUser() {
    if (!selected) return false;

    setModal('Activating user...');

    const url = '/api/post?q=activate-user';
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected}),
    })

    if (response) {
      mutate()
    }

    setSelected(null);
    setModal(null);
  }

  async function ResetPassword() {
    if (!selected) return false;

    setModal('Resetting password...');

    const url = '/api/post?q=reset-user';
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: selected}),
    })

    if (response) {
      console.log('RESPONSE', response);
      setSelected(null);
      setModal(null);
      setUserResetResponse(response);
      mutate()
    }

    setSelected(null);
    setModal(null);
  }

  return <>
    <Heading title="Daftar User">
      {user.licenseOwner && user.licenseType == 'corporate' && <Link href="/new-user">
        <a className="inline-flex items-center bg-white shadow-sm hover:shadow rounded-sm px-4 h-8 border border-plum-500 hover:border-plum-600 text-sm text-plum-600 font-semibold">
          Add User
        </a>
      </Link>}
    </Heading>
    <table className="w-full text-sm">

      <thead className="font-semibold">
        <tr className="border-b border-gray-300 border-opacity-50">
          <td className="w-9 p-0">
            <div className="rounded-tl-md bg-gray-200 bg-opacity-50 pt-4 pb-3 px-1">&nbsp;</div>
          </td>
          <td className="p-0">
            <div className="bg-gray-200 bg-opacity-50 p-3 pt-4">Nama &amp; Email</div>
          </td>
          <td className="w-32 text-center p-0">
            <div className="rounded-tr-md bg-gray-200 bg-opacity-50 p-3 pt-4">&lt;&gt;</div>
          </td>
        </tr>
      </thead>

      {users.map(person => (
        <tbody key={person._id}>
          <tr className="border-b border-gray-200 hover:bg-gray-50s">
            <td className="py-2 pl-3 text-center">
              <div className="mx-auto w-6 h-6 rounded-full bg-gray-300"></div>
            </td>
            <td className="px-3 py-2">
              <div className={'font-medium truncate ' + (person.disabled ? 'text-gray-400' : '')}>
                {person.fullname}
              </div>
              <div className="text-gray-500 font-light">
                {person.email}
              </div>
            </td>
            <td className="text-right text-gray-500 px-3 py-2">
              {(user.username == person.username) && (
                <Link href="/chg-pwd">
                  <a
                    className="text-xs text-plum-600 hover:underline"
                    onClick={e => {
                      e.preventDefault();
                      setPasswordDialog(true);
                    }}
                  >
                    Change password
                  </a>
                </Link>
              )}
              {user.licenseOwner && user.username !== person.username && selected !== person._id && (
                <button
                  className="h-7 px-3 focus:outline-none text-xs rounded border border-gray-300 hover:border-gray-400 active:border-gray-400 active:bg-gray-600 active:text-white font-medium mr-3"
                  onClick={e => {
                    setSelected(person._id)
                  }}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
          {(user.licenseOwner && user.username !== person.username) && selected == person._id && (
            <tr className="border-b border-gray-200">
              <td className="py-2 pl-3 text-center">
                &nbsp;
              </td>
              <td colSpan="2" className="px-3 py-2">
                <div className="flex items-center">
                  <div className="flex-grow text-xs text-white">
                    {!person.disabled && (
                      <button
                        className="h-7 px-3 focus:outline-none rounded bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 font-medium mr-3"
                        onClick={ResetPassword}
                      >
                        Reset password
                      </button>
                    )}
                    {person.disabled && (
                      <button
                        className="h-7 px-3 focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
                        onClick={ActivateUser}
                      >
                        Activate
                      </button>
                    )}
                    {!person.disabled && (
                      <button
                        className="h-7 px-3 focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
                        onClick={DisableUser}
                      >
                        Disable
                      </button>
                    )}
                    <button
                      className="h-7 px-3 focus:outline-none rounded bg-red-500 hover:bg-red-600 active:bg-red-700 font-medium mr-3"
                      onClick={DeleteUser}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="w-28 text-right text-xs">
                    <button
                      className="h-7 px-3 focus:outline-none rounded border border-gray-300 hover:border-gray-400 active:border-gray-400 active:bg-gray-600 active:text-white font-medium mr-3"
                      onClick={e => {
                        setSelected(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      ))}
    </table>

    {modal && (
      <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
        <div className="w-72 rounded border border-gray-400 bg-white shadow">
          <h3 className="text-xl mx-4 my-2">{modal}</h3>
          <div className="progress rounded-b bg-gray-300 h-2"></div>
        </div>
      </div>
    )}

    {resetUserResponse && <ResetResponse
      response={resetUserResponse}
      callback={setUserResetResponse}
    />}

    {passwordDialog && <ChangePassword callback={setPasswordDialog} />}

    <style jsx>{`
    .progress {
      background-image: url(/mango-in-progress-01.gif);
    }
    `}</style>
  </>;
}


function ResetResponse ({ response, callback }) {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-auto rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 mt-4 mb-3">New user password</h3>
        <div className="flex border-t text-sm pl-4 pr-10 py-2">
          <div className="w-20 text-right">Username:</div>
          <div className="flex-grow pl-3">{response.username}</div>
        </div>
        <div className="flex border-t text-sm pl-4 pr-10 py-2">
          <div className="w-20 text-right">Fullname:</div>
          <div className="flex-grow pl-3">{response.fullname}</div>
        </div>
        <div className="flex border-t text-sm pl-4 pr-10 py-2">
          <div className="w-20 text-right">Password:</div>
          <div className="flex-grow pl-3">{response.password}</div>
        </div>
        <div className="border-t text-sm text-white text-center px-4 py-4">
          <button
            className="h-7 px-4 focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
            onClick={e => callback(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}


function ChangePassword({ callback }) {
  const [submitting, setSubmitting] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassowrd, setNewPassowrd] = useState('');
  const [cwResponse, setCwResponse] = useState(null);
  const [cwResult, setCwResult] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);


    const url = '/api/post?q=change-password';
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ oldPassword: oldPassword, newPassowrd: newPassowrd }),
    })

    if (response) {
      console.log('RESPONSE', response);
      setSubmitting(false);
      setCwResponse(response);
      setCwResult(response.ok);
    }
  }

  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-80 rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 mt-4 mb-3">Change password</h3>

        {cwResponse && cwResult && <div className="px-4 py-8 border-t border-b text-plum-600">
          Password Anda telah berhasil diganti.
        </div>}

        {(!cwResponse || !cwResult) && <>
          <div className="flex items-center border-t text-sm pl-4 pr-6 pt-4 pb-2">
            <div className="w-32 text-rights">Current password:</div>
            <div className="flex-grow pl-3">
              <input type="password"
                className="w-36 text-sms rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-1"
                value={oldPassword}
                disabled={submitting}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center border-b text-sm pl-4 pr-6 pb-4">
            <div className="w-32 text-rights">New password:</div>
            <div className="flex-grow pl-3">
              <input type="password"
                className="w-36 text-sms rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-1"
                value={newPassowrd}
                disabled={submitting}
                onChange={e => setNewPassowrd(e.target.value)}
              />
            </div>
          </div>
        </>}
        <div className="text-center pb-5">
          <div className={(submitting ? 'progress' : '')  + " h-1 mb-4"}></div>
          {(!cwResponse || !cwResult) && <>
            <button
              disabled={submitting}
              className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-plum-500 hover:bg-plum-600 active:bg-plum-700 font-medium mr-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              disabled={submitting}
              className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-plum-500 hover:bg-plum-600 active:bg-plum-700 font-medium mr-3"
              onClick={e => callback(null)}
            >
              Cancel
            </button>
          </>}
          {cwResponse && cwResult && <button
            className="h-7 px-4 text-sm text-white focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
            onClick={e => callback(null)}
          >
            Close
          </button>}
        </div>
        {cwResponse && !cwResult && <div className="text-sm text-center text-red-500 pb-2">
          {cwResponse.message}
        </div>}
      </div>
      <style jsx>{`
      .progress {
        background-image: url(/mango-in-progress-01.gif);
      }
    `}</style>
    </div>
  )
}

/*
donisu ntf9GvZ
nisang rgsdJpA

*/