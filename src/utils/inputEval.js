export const evalInput = ({ name, value }) => {
  let customErrorMsg = "", isInputValid = true
  if (name == "password" && value.length < 8) customErrorMsg = "Contrasaña debe contener 8 o mas caracteres"
  if (value.length < 1) customErrorMsg = "Debe contener 1 o mas caracteres"
  if (customErrorMsg.length > 0) isInputValid = false
  return [JSON.parse(`{"${name}":"${value}"}`), { customErrorMsg, isInputValid }]
};
export const evalForm = ({ elements }) => {
  const entries = Object.values(elements).filter((element) => { return element.type == "text" || element.type == "password" })
  let formData = {}, isFormValid = true;
  for (let i = 0; i < entries.length; i++) {
    const [inputData, results] = evalInput(entries[i])
    if (!results.isInputValid) isFormValid = false
    Object.assign(formData, inputData);
  }
  if (!isFormValid) throw "Form/Incomplete";
  return formData
};

export const setInputValidity = (target, validation) => {
  // TODO Terminar actualizacion UI
  console.log("Setting UI Validations", target, `to ${validation}`);
}