import React, { useState } from "react";

const Input = ({ type = "text", name, title, required = false, evaluator = undefined, autoComplete = "off" }) => {
  const [validation, setValidation] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [value, setValue] = useState("");

  const boderStyle = {
    default: "border-gray-600",
    valid: "border-green-600",
    invalid: "border-red-600",
  };
  const iconStyle = {
    valid: (
      <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-8 py-1 pe-1 text-lime-600' viewBox='0 0 16 16'>
        <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z' />
      </svg>
    ),
    invalid: (
      <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='h-8 py-1 pe-1 text-red-600' viewBox='0 0 16 16'>
        <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
        <path d='M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z' />
      </svg>
    ),
  };

  const handlerValue = async ({ target }) => {
    const { value } = target;

    try {
      if (evaluator == undefined || value.length < 1) throw "NoEvaluation";
      const { valid, error, data } = await evaluator(value);

      setErrorMsg(error);
      setValidation(valid);
      setValue(data);
    } catch (error) {
      setValue(value);
      setValidation();
    }
  };

  return (
    <div className='flex flex-wrap w-full my-1'>
      <label htmlFor={name} className='mx-3 my-1'>
        {title}
      </label>
      <div className={`flex items-center w-full p-1 m-1 bg-white border-2 rounded-lg ${boderStyle[validation ?? "default"]}`}>
        <input className='w-full py-1 ps-2 bg-transparent outline-none ' type={type} name={name} id={name} value={value} onChange={handlerValue} required={required} autoComplete={autoComplete} />
        <span>{iconStyle[validation]}</span>
      </div>
      <span className='w-full mx-1 mb-1 text-sm text-center'>{errorMsg}</span>
    </div>
  );
};

export default Input;
