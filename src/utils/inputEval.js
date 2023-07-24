export const evalInput = (target) => {
  target.className += " valid:border-green-500 invalid:border-red-500"
  if (target.value.length < 4) {
    target.setCustomValidity("Debe contener 4 o mas caracteres");
    return false;
  }
  target.setCustomValidity("");
  return true;
};
export const evalForm = (form) => {
  const { elements } = form;
  let evalResult = [];
  for (let i = 0; i < elements.length - 1; i++) {
    if (evalInput(elements[i])) evalResult.push(true);
  }
  if (evalResult.length != 4) throw "Campos incompletos";
  return {
    uname: elements["uname"].value,
    password: elements["password"].value,
    fname: elements["fname"].value,
    lname: elements["lname"].value,
  };
};