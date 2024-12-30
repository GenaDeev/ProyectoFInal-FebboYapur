let montoImpuestos = 0;
// Cotización constante, en un futuro podria ser un fetch a una api
const cotizacion = 1042;

// Impuestos al dia de hoy en Argentina
const impuestos = [
  {
    name: "Ganancias",
    id: "ganancias",
    value: 0.3,
  },
  {
    name: "Impuesto Pais",
    id: "impuesto-pais",
    value: 0.3,
  },
];

// Elementos HTML
const form = {
  cotizacionHtml: document.getElementById("cotizacion"),
  userInput: document.getElementById("user-input"),
  noTax: document.getElementById("result-notax"),
  tax: document.getElementById("result-tax"),
  taxes: document.getElementById("taxes"),
};

// Desestructuracion
const { cotizacionHtml,userInput, noTax, tax, taxes } = form;

// Verifica si se guardó el ultimo valor del usuario
const localStorageLastValue = localStorage.getItem("lastValue");

const process = (value) => {
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

// Evento al cambiar el valor del input
userInput.addEventListener("input", (e) => process(e.target.value));

// Inicia el calculo con el valor anterior del usuario guardado en localStorage
addEventListener("DOMContentLoaded", () => {
  if (localStorageLastValue) {
    userInput.value = localStorageLastValue;
    process(localStorageLastValue);
  }
});

// Añade el valor de la cotización al HTML
addEventListener("DOMContentLoaded", () => {
  cotizacionHtml.innerHTML = cotizacion;
});

// Realiza los cálculos y devuelve los diferentes resultados
const calculate = (value, cotizacion) => {
  let data = {
    notax: 0,
    result: 0,
    taxes: [],
  };

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
