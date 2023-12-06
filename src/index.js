const URL = "https://api.frankfurter.app/";
const prueba = document.querySelector("#prueba");
const titulo = document.querySelector("#titulo");
const tipoDeCambio = document.querySelector("#tipoDeCambio");
const total = document.querySelectorAll(".card-text");
const cantidadInput = document.querySelector("#cantidadInput");
const fechaInput = document.querySelector("#fechaInput");
const lista = document.querySelector("#lista");
let primerCambioElegido = "USD";
let cantidad = 1;
let fechaSeleccionada = "latest";
let fechaFormateada;

tipoDeCambio.addEventListener("change", () => {
  primerCambioElegido = tipoDeCambio.value;
  titulo.innerText = `Elegiste ${primerCambioElegido}`;
  renderizadoDeCartas();
});

function comparacion(cambiosPredefinidos) {
  if (primerCambioElegido === cambiosPredefinidos) {
    total.forEach((cardText) => {
      const cardTitle =
        cardText.parentElement.querySelector(".card-title").innerText;
      if (cardTitle === primerCambioElegido) {
        cardText.innerText = "";
      }
    });
    return;
  }
  if (fechaSeleccionada !== "latest") {
    fetch(
      `${URL}${fechaFormateada}?amount=${cantidad}&from=${primerCambioElegido}&to=${cambiosPredefinidos}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        total.forEach((cardText) => {
          const cardTitle =
            cardText.parentElement.querySelector(".card-title").innerText;
          if (cardTitle === cambiosPredefinidos) {
            cardText.innerText = `${cantidad} ${primerCambioElegido} = ${data.rates[cambiosPredefinidos]} ${cambiosPredefinidos}`;
          } else if (cardTitle === primerCambioElegido) {
            cardText.innerText = "";
          }
        });
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }

  if (fechaSeleccionada === "latest") {
    fetch(
      `${URL}latest?amount=${cantidad}&from=${primerCambioElegido}&to=${cambiosPredefinidos}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        total.forEach((cardText) => {
          const cardTitle =
            cardText.parentElement.querySelector(".card-title").innerText;
          if (cardTitle === cambiosPredefinidos) {
            cardText.innerText = `${cantidad} ${primerCambioElegido} = ${data.rates[cambiosPredefinidos]} ${cambiosPredefinidos}`;
          } else if (cardTitle === primerCambioElegido) {
            cardText.innerText = "";
          }
        });
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }
}

function renderizadoDeCartas() {
  let divisas = document.querySelectorAll(".card-title");
  divisas.forEach((divisa) => {
    let cambiosPredefinidos = divisa.innerText;
    comparacion(cambiosPredefinidos);
  });
}

function enviarCantidad() {
  cantidadSeleccionada = cantidadInput.value;
  if (!isNaN(cantidadSeleccionada) && cantidadSeleccionada.length <= 10) {
    cantidad = cantidadInput.value;
    renderizadoDeCartas();
  } else {
    alert("Por favor, ingrese un número válido de hasta 10 caracteres.");
  }
}

function obtenerFecha() {
  fechaSeleccionada = fechaInput.value;
  if (fechaSeleccionada) {
    fechaFormateada = new Date(fechaSeleccionada).toISOString().split("T")[0];
    renderizadoDeCartas();
  } else {
    alert("Por favor, seleccione una fecha válida");
  }
}

function obtenerLista(){
  fetch(`${URL}latest`)
  .then((res)=> res.json())
  .then((data)=>{
    for (const divisa in data.rates) {
      const itemDeLista = document.createElement('li');
      itemDeLista.innerText = `${divisa} = ${data.rates[divisa]}`;
      itemDeLista.classList.add("list-group-item",'col-md-6')
      lista.appendChild(itemDeLista);
    }
  })
}
obtenerLista()
renderizadoDeCartas();

//
