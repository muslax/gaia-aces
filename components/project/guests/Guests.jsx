import useGuests from "hooks/useGuests"
import { getLastVisitedBatchId } from "lib/storage"
import { useEffect, useState } from "react"
import FormGuest from "./FormGuest"

export const Guests = ({ user, project, setHero }) => {
  const batchId = getLastVisitedBatchId(project);
  const { guests, isError, isLoading, mutate } = useGuests(batchId)

  const [usernames, setUsernames] = useState([])
  const [client, setClient] = useState(null)
  const [expert, setExpert] = useState(null)
  const [newGuest, setNewGuest] = useState(null)

  useEffect(() => {
    if (guests) {
      const array = []
      guests.forEach(g => {
        array.push(g.username)
      })

      setUsernames(array)
    }
  }, [guests])

  function newClient(e) {
    setClient({
      projectId: project._id,
      batchId: batchId,
      type: "client",
      fullname: "",
      username: "",
      email: "",
      phone: "",
    })
  }

  function newExpert(e) {
    setExpert({
      projectId: project._id,
      batchId: batchId,
      type: "expert",
      fullname: "",
      username: "",
      email: "",
      phone: "",
    })
  }

  function isProjectAdmin() {
    return project.admin.username == user.username
  }

  if (isLoading || isError) return <>..</>

  return <>
    <div className="flex items-center border-ts border-bs border-gray-300 pb-3">
      <h3 className="flex-grow text-lg font-bold mt-1">Client</h3>
      <div className="h-8">
        {isProjectAdmin() && !client && <button
          className={`
          px-5 h-8 text-sm font-medium rounded border border-gray-300 hover:border-gray-400 shadow-sm
          focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
          `}
          onClick={newClient}
        >Add access</button>}
      </div>
    </div>
    {client && <FormGuest
      guest={client}
      setGuest={setClient}
      setNewGuest={setNewGuest}
      usernames={usernames}
      onCancel={e => setClient(null)}
      onSuccess={e => setClient(null)}
      mutate={mutate}
    />}
    <table className="w-full border-t border-gray-300">
      <tbody>
        {guests.filter(g => g.type == "client").map((guest, index) => (
          <tr key={guest._id} className="border-b">
            <td className="w-10 py-2">{index + 1}</td>
            <td className="p-2">{guest.fullname}</td>
            <td className="p-2">{guest.username}</td>
            <td className="p-2">{guest.email}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="flex items-center border-ts border-bs border-gray-300 py-3 mt-12">
      <h3 className="flex-grow text-lg font-bold mt-1">Expert</h3>
      <div className="h-8">
        {isProjectAdmin() && !expert && <button
          className={`
          px-5 h-8 text-sm font-medium rounded border border-gray-300 hover:border-gray-400 shadow-sm
          focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
          `}
          onClick={newExpert}
        >Add access</button>}
      </div>
    </div>
    {expert && <FormGuest
      guest={expert}
      setGuest={setExpert}
      setNewGuest={setNewGuest}
      usernames={usernames}
      onCancel={e => setExpert(null)}
      onSuccess={e => setExpert(null)}
      mutate={mutate}
    />}
    <table className="w-full border-t border-gray-300">
      <tbody>
        {guests.filter(g => g.type == "expert").map((guest, index) => (
          <tr key={guest._id} className="border-b">
            <td className="w-10 py-2">{index + 1}</td>
            <td className="p-2">{guest.fullname}</td>
            <td className="p-2">{guest.username}</td>
            <td className="p-2">{guest.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* <pre>{JSON.stringify(usernames, null, 2)}</pre> */}
    {newGuest && (
      <div className="fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
        <div className="max-w-xl rounded border border-gray-400 bg-white shadow">
          <h3 className="text-xl mx-4 my-2">New guest access</h3>
          <div className="flex border-t text-sm pl-4 pr-10 py-2">
            <div className="w-20 text-right">Nama:</div>
            <div className="flex-grow pl-3">{newGuest.fullname}</div>
          </div>
          <div className="flex border-t text-sm pl-4 pr-10 py-2">
            <div className="w-20 text-right">Email:</div>
            <div className="flex-grow pl-3">{newGuest.email}</div>
          </div>
          <div className="flex border-t text-sm pl-4 pr-10 py-2">
            <div className="w-20 text-right">Username:</div>
            <div className="flex-grow pl-3">{newGuest.username}</div>
          </div>
          <div className="flex border-t text-sm pl-4 pr-10 py-2">
            <div className="w-20 text-right">Password:</div>
            <div className="flex-grow pl-3">{newGuest.password}</div>
          </div>
          <div className="border-t text-sm text-white text-center px-4 py-4">
            <button
              className="h-7 px-4 focus:outline-none rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-700 font-medium mr-3"
              onClick={e => setNewGuest(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </>
}
