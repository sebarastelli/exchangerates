const URL = "http://127.0.0.1:8080";
const numeroDeDivisas = 4;

describe("Exchangerates", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "https://api.frankfurter.app/latest",
      { fixture: "divisas" }
    ).as("obtenerDivisas");

    cy.visit(URL);
  });

  it("Asegurarse de que las options esten cargadas", () => {
    cy.get("#tipoDeCambio")
      .find("option")
      .should("have.length", numeroDeDivisas);
  });
  it("Asegurarse de que la divisa seleccionada no tenga comparación", () => {
    cy.get("#tipoDeCambio").select("EUR");

    cy.get(".card")
      .contains("EUR")
      .parent(".card-body")
      .find("p")
      .should("be.empty");
  });
  it("Comprobar que cargo correctamente la lista de divisas con precios", () => {
    cy.get("#lista").find("li").should("have.length", 30);
  });

  describe("Comprobar inputs", () => {
    it("Actualizar el monto y verificar que se refleje en card-text", () => {
      const nuevoMonto = 3;
      cy.get("#tipoDeCambio").select("EUR");
      cy.get("#lista li")
        .first()
        .invoke("text")
        .then((primerValor) => {
          const numerosExtraidos = primerValor.replace(/[^\d.]/g, "");
          cy.log(`El primer valor de la lista es: ${numerosExtraidos}`);
          cy.get("#cantidadInput").type(nuevoMonto);
          cy.get("button:contains('Cambiar Monto')").click();
          cy.get(".card:contains('AUD') .card-text").should(
            "contain.text",
            `${nuevoMonto} EUR =`
          );
        });
    });
    it("Verificar que al cambiar fecha cambie el valor", ()=>{
      const nuevaFecha = "2000-01-03";
    cy.get("#fechaInput").type(nuevaFecha);
    cy.get("button:contains('Cambiar fecha')").click();
    cy.get(".card:contains('EUR') .card-text").should("have.text", "1 USD = 0.99108 EUR");
    })
  });
});
