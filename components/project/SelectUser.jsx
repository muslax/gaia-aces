import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function SelectUser({ users, value, onChange }) {
  const [selected, setSelected] = useState(value ? value : users[0]);

  return (
    <div className="flex items-center">
      <div className="flex-grow text-sm">
        <Listbox value={selected} onChange={e => {
          setSelected(e)
          onChange(e)
        }}>
          {({ open }) => (
            <>
              <div className="relative mt-1s">
                <Listbox.Button className="relative w-full py-1s pl-3 pr-8 text-left bg-white rounded border border-gray-300 shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-sm">
                  <span className="py-1 pl-1 block truncate text-red-500s font-semibold">{selected.fullname}</span>
                  {/* <div className="flex">
                    <span className="py-1 pr-2 border-r">user</span>
                    <span className="py-1 pl-2 block truncate text-red-500 font-semibold">{selected.userName}</span>
                  </div> */}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <SelectorIcon
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    static
                    className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
                  >
                    {users.map((user, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `${
                            active
                              ? "text-indigo-900 bg-yellow-100"
                              : "text-gray-700"
                          }
                            active:outline-none cursor-default select-none text-sm relative py-1 pl-10 pr-4`
                        }
                        value={user}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {user.fullname}
                            </span>
                            {selected ? (
                              <span
                                className={`${
                                  active ? "text-green-600" : "text-green-500"
                                }
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null
                            }
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
}
