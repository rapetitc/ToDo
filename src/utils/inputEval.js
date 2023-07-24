export const evalInput = (target) => {
  let customError = ""
  target.className += " valid:border-green-500 invalid:border-red-500"
  if (target.value.length < 4) customError = "Debe contener 4 caracteres o mas"
  target.setCustomValidity(customError);
  return JSON.parse(`{"${target.name}":"${target.value}"}`)
};
export const evalForm = ({ elements }) => {
  let values = {};
  for (let i = 0; i < elements.length - 1; i++) {
    if (evalInput(elements[i])) Object.assign(values, JSON.parse(`{"${elements[i].name}":"${elements[i].value}"}`));
  }
  if (Object.keys(values).length != elements.length - 1) throw "Campos incompletos";
  return values
};