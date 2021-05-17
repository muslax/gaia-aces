import { XIcon } from "@heroicons/react/solid"
import { FormRowContainer } from "components/form/FormRow"
import { FormRow } from "components/form/FormRow"
import { API_ROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import { generatePOSTData } from "lib/utils"
import { useState } from "react"

export default function FormGuest({ guest, setGuest, setNewGuest, usernames, onCancel, onSuccess, mutate }) {
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    setSubmitting(true)
    const response = await fetchJson(
      API_ROUTES.SaveGuest,
      generatePOSTData(guest)
    )

    if (response) {
      console.log("RESPONSE", response)
      mutate()
      onSuccess()
      setNewGuest(response)
    }
  }

  function checkUsername() {
    if (usernames.includes(guest.username)) {
      return 'Username sudah dipakai'
    } else if (guest.username.length < 6) {
      return 'Min. 6 karakter'
    }

    return false
  }

  return <>
    <div className="rounded border border-gray-300 pt-3 pb-2 mb-4">
      <div className="flex border-b border-gray-300 pb-2 mx-4 mb-3s">
        <div className="flex-grow text-sm">Header</div>
        <button
          className="w-4 h-4 text-gray-500"
          onClick={onCancel}
        >
          <XIcon />
        </button>
      </div>
      <div className="h-1 mx-4 mb-2">
        {submitting && <div className="progress h-full"></div>}
      </div>
      <FormRow
        label="Nama lengkap"
        value={guest.fullname}
        autofocus={true}
        errorMsg={guest.fullname ? '' : 'Tidak boleh kosong'}
        onChange={e => {
          setGuest(c => ({...c, fullname: e.target.value}))
        }}
      />
      <FormRow
        label="Email"
        value={guest.email}
        errorMsg={guest.email ? '' : 'Email tidak valid'}
        onChange={e => {
          setGuest(c => ({...c, email: e.target.value}))
        }}
      />
      <FormRow
        label="Telepon"
        value={guest.phone}
        onChange={e => {
          setGuest(c => ({...c, phone: e.target.value}))
        }}
      />
      <FormRow
        label="Username"
        value={guest.username}
        placeholder="Min. 6 karakter"
        errorMsg={checkUsername}
        onChange={e => {
          setGuest(c => ({...c, username: e.target.value}))
        }}
      />
      <FormRow label="Password" disabled value="Akan dibuat oleh sistem" />
      <FormRowContainer py="py-2">
        <button
          className="h-9 px-5 text-white focus:outline-none rounded bg-green-500 hover:bg-green-600 active:bg-green-700 font-medium mr-3"
          onClick={submit}
        >
          Save Guest
        </button>
      </FormRowContainer>
    </div>
  </>
}