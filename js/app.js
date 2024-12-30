let montoImpuestos = 0;

const impuestos = [
  { name: "Ganancias", id: "ganancias", value: 0.3 },
  { name: "Impuesto Pais", id: "impuesto-pais", value: 0.3 },
];

const form = {
  cotizacionHtml: document.getElementById("cotizacion"),
  userInput: document.getElementById("user-input"),
  noTax: document.getElementById("result-notax"),
  tax: document.getElementById("result-tax"),
  taxes: document.getElementById("taxes"),
};

const { cotizacionHtml, userInput, noTax, tax, taxes } = form;

const localStorageLastValue = localStorage.getItem("lastValue");

const fetchDolarOficial = async () => {
  try {
    const response = await fetch("../data/dolar.json");
    if (!response.ok) throw new Error("Error al obtener la cotización.");
    const data = await response.json();
    cotizacionHtml.textContent = data[0]?.sell ?? "N/A";
    return parseFloat(data[0]?.sell);
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    return null;
  }
};

const process = (value, cotizacion) => {
  if (!cotizacion) return;
  localStorage.setItem("lastValue", value);
  document.getElementById("result-container").classList.remove("hidden");
  montoImpuestos = 0;
  const data = calculate(parseFloat(value), cotizacion);
  noTax.innerHTML = "$" + data.notax.toFixed(2);
  tax.innerHTML = "$" + data.result.toFixed(2);
  data.taxes.forEach((impuesto) => {
    if (!document.getElementById(`${impuesto.id}-value`)) {
      const p = document.createElement("p");
      p.innerHTML = `${impuesto.name}: <span id="${
        impuesto.id
      }-value">$${impuesto.result.toFixed(2)}</span>`;
      taxes.appendChild(p);
    } else {
      document.getElementById(
        `${impuesto.id}-value`
      ).innerHTML = `$${impuesto.result.toFixed(2)}`;
    }
  });
};

const calculate = (value, cotizacion) => {
  let data = { notax: 0, result: 0, taxes: [] };
  if (!value) {
    impuestos.forEach((impuesto) => {
      impuesto.result = 0;
      data.taxes.push(impuesto);
    });
    return data;
  }
  montoImpuestos = 0;
  impuestos.forEach((impuesto) => {
    impuesto.result = cotizacion * value * impuesto.value;
    data.taxes.push(impuesto);
    montoImpuestos += impuesto.result;
  });
  const final = value * cotizacion + montoImpuestos;
  data.notax = value * cotizacion;
  data.result = final;
  return data;
};

const clearLocalStorage = async () => {
  const { isConfirmed } = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el valor guardado.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  });
  if (isConfirmed) {
    localStorage.removeItem("lastValue");
    Swal.fire("¡Borrado!", "El valor guardado ha sido eliminado.", "success");
  }
};

document.getElementById("clear-storage").addEventListener("click", clearLocalStorage);

addEventListener("DOMContentLoaded", async () => {
  const cotizacionFetch = await fetchDolarOficial();
  if (localStorageLastValue) {
    userInput.value = localStorageLastValue;
    process(localStorageLastValue, cotizacionFetch);
  }
});
userInput.addEventListener("input", (e) => fetchDolarOficial().then((cotizacion) => process(e.target.value, cotizacion)));
