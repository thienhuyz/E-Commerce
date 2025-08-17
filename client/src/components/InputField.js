const InputField = ({ value, setValue, label, nameKey, type, invalidFields, setInvalidFields }) => {

    return (

        <div className='w-full flex flex-col relative'>
            {value.trim() !== '' && (
                <label
                    className='text-base animate-slide-top-sm absolute top-[-12px] left-[12px] block bg-white px-1'
                    htmlFor={label}
                >
                    {label}
                </label>
            )}
            <input
                autoComplete="off"
                type={type || 'text'}
                className='px-4 py-4 rounded-sm border w-full mb-8 placeholder:text-base placeholder:italic outline-none'
                placeholder={label}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields([])}
            />
            {invalidFields?.some(el => el.name === nameKey) &&
                <small className='text-main text-[10px] italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</small>
            }
        </div>
    )
}


export default InputField
