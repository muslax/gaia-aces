import { useEffect, useState } from "react";
import SelectUser from "../SelectUser";
import ButtonCancel from "./ButtonCancel";

export default function FormAdmin({ project, users, onCancel, onSave }) {
  const [prevAdmin, setPrevAdmin] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (users) {
      const admin = users.filter(user => user.username == project.admin.username)[0];
      setSelected(admin);
      setPrevAdmin(admin);
    }
  }, [users])

  if (!selected) return null;

  return <div>
    <div className="border-t flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
      <h3 className="text-lgs font-semibold mb-3 md:mb-0">Change admin</h3>
      <div className="flex justify-centers ml-6">
        <div className="w-48 mr-4">
          <SelectUser
            users={users}
            value={selected}
            onChange={setSelected}
          />
        </div>
        <button
          disabled={selected.username == prevAdmin.username}
          className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
          onClick={e => onSave(selected)}
        >
          Save
        </button>
        <ButtonCancel onClick={onCancel} />
      </div>
    </div>
  </div>
}