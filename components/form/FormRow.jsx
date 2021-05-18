import { useState } from "react"

export function FormBlock({ children, labelWidth, label, bg, py }) {
  return <>
    <div className={`${bg ? bg : ''} ${py ? py : ''} flex items-center text-sm`}>
      <div className={`${labelWidth ? labelWidth : 'w-1/4'} flex-shrink-0 text-gray-500`}>
        <span className="py-1 block truncate">{label}</span>
      </div>
      <div className="flex-grow">
        <div className="flex items-center pl-2 py-1">
          {children}
        </div>
      </div>
    </div>
  </>
}


export function InfoBlock({ label, labelWidth, value, valueWidth }) {
  return <>
    <FormBlock label={label} labelWidth={labelWidth}>
      <div className={`${valueWidth ? valueWidth : 'w-full'} flex items-center h-9 px-3 bg-gray-100 rounded border border-gray-100`}>{value}</div>
    </FormBlock>
  </>
}


export function InfoRow({ label, value }) {
  return <>
    <div className={`flex items-start text-sm`}>
      <div className="w-1/4 flex-shrink-0 text-gray-500">
        <span className="pl-4 py-2 block truncate">{label}</span>
      </div>
      <div className="flex-grow font-mediums">
        <div className="px-4 py-1">
          <div className="flex items-center w-full h-9 px-3 bg-gray-100 rounded border border-gray-100">{value}</div>
        </div>
      </div>
    </div>
  </>
}


export function FormRow({
  type = "text",
  label,
  value,
  placeholder,
  autofocus,
  errorMsg,
  disabled,
  onChange,
  bg,
  py
}) {
  const baseClass = `px-3 text-sm rounded border-gray-300 hover:border-gray-400
  shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`
  const disabledClass = `bg-gray-50 px-3 text-sm rounded border-gray-300 shadow-sms`

  const [error, setError] = useState(null)

  return <>
    <div className={`${bg ? bg : ''} ${py ? py : ''} flex items-start text-sm`}>
      <div className="w-1/4 flex-shrink-0 text-gray-500">
        <span className="pl-4 py-2 block truncate">{label}</span>
      </div>
      <div className="flex-grow">
        <div className="px-4 py-1">
          {disabled && <>
            {type == "text" && <>
              <input
                type="text"
                value={value}
                disabled
                className={`w-full h-9 ${disabledClass}`}
              />
            </>}
            {type == "date" && <>
              <input
                type="text"
                value={value}
                maxLength="10"
                disabled
                className={`w-36 h-9 ${disabledClass}`}
              />
            </>}
            {type == "textarea" && <>
              <textarea
                value={value}
                disabled
                className={`w-full ${disabledClass}`}
              ></textarea>
            </>}
          </>}
          {!disabled && <>
            {type == "text" && <>
              <input
                type="text"
                value={value}
                autoFocus={autofocus}
                placeholder={placeholder}
                onChange={onChange}
                // onFocus={e => setError(null)}
                onBlur={e => setError(errorMsg)}
                className={`w-full h-9 ${baseClass}`}
              />
            </>}
            {type == "date" && <>
              <input
                type="date"
                value={value}
                autoFocus={autofocus}
                placeholder={placeholder}
                maxLength="10"
                className={`w-36 h-9 ${baseClass}`}
                onChange={onChange}
              />
            </>}
            {type == "textarea" && <>
              <textarea
                value={value}
                autoFocus={autofocus}
                placeholder={placeholder}
                onChange={onChange}
                rows="2"
                className={`w-full ${baseClass}`}
              ></textarea>
            </>}
          </>}
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </div>
    </div>

    <style jsx>
    {`
      input:disabled {
        color: rgb(47, 54, 68);
      }
      input::placeholder {
        color: rgb(107, 124, 148);
      }
    `}
    </style>
  </>
}