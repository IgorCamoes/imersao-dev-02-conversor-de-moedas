//Chamada dos elementos da DOM para o JS usando querySelectors.

const inputNumerico = document.querySelector(".valor-inicial");
const selectMoeda = document.querySelector("#moeda-estrangeira");
const divWrapper = document.querySelector(".conversor-wrapper");
const inverterValores = document.querySelector(".conversor-wrapper img");
const labels = document.querySelectorAll(".convert-block label");
const msg = document.querySelector(".msg");

//Funções para mudar o texto dos labels quando o usuário clicar no botãozinho de inverter a conversão.

let invertido = false;

const mudarTexto = () => {
  if (invertido) {
    labels[0].innerHTML = `Insira o valor`;
    labels[1].innerHTML = `Selecione qual moeda você quer converter para Reais (BRL)`;
  } else {
    labels[0].innerHTML = `Insira o valor em Reais (BRL)`;
    labels[1].innerHTML = `Selecione para qual moeda você quer converter`;
  }
};

inverterValores.onclick = () => {
  inverterValores.classList.toggle("motion-girar");
  divWrapper.classList.toggle("invert");
  invertido = !invertido;
  msg.innerText = "";
  inputNumerico.value = "";
  mudarTexto();
};

// Inicia as variáveis com os valores dos rates de conversão das moedas para BRL e o dia que foram requisitados puxando elas do cache do navegador.

let rateUSD = localStorage.getItem("valorUSD");
let rateJPY = localStorage.getItem("valorJPY");
let rateEUR = localStorage.getItem("valorEUR");
let dataFetch = localStorage.getItem("dataFetch");

//Guarda essas variáveis num array para poder ser consultado depois com mais facilidade utilizando um laço de repetição.

let rate = [rateUSD, rateJPY, rateEUR];

//Função usada para formatar o new Date() padrão para uma string 'yyyy-mm-dd' que é usada para verificar se as variáveis de conversão para real estão atualizadas

const hojeFormat = () => {
  let hoje = new Date();
  (d = hoje.getDate().toString().padStart(2, "0")),
    (m = (hoje.getMonth() + 1).toString().padStart(2, "0")),
    (y = hoje.getFullYear());
  return `${y}-${m}-${d}`;
};

const moedas = ["USD", "JPY", "EUR"];

// Checa se as variáveis guardadas no cache existem e se são atualizadas, se não existirem ou forem de um dia diferente a função faz uma requisição à API que escolhi e guarda cada dado da resposta em uma variável que agora está no array rate

const checarData = () => {
  if (dataFetch !== hojeFormat()) {
    moedas.forEach((moeda, i) => {
      let request = new XMLHttpRequest();
      request.open(
        "GET",
        `https://api.exchangerate.host/convert?from=BRL&to=${moeda}`
      );
      request.responseType = "json";
      request.send();
      request.onload = function () {
        let response = request.response;

        localStorage.setItem("dataFetch", response.date);
        localStorage.setItem(`valor${moeda}`, response.info.rate);

        rate[i] = response.info.rate;
      };
    });
  }
};

checarData();

//Função para checar se tem algo para ser convertido no input de valor, se tiver faz o cálculo da conversão direto no texto da mensagem usando o innerText, se não tiver ela só exibe uma mensagem para o usuário inserir um valor. Usei switches para deixar o mais personalizável e dinâmico possível

const converterValor = () => {
  if (inputNumerico.value !== "") {
    if (invertido) {
      switch (selectMoeda.value) {
        case "USD":
          msg.innerText = `$${inputNumerico.value} Dólares equivalem a R$${(
            parseFloat(inputNumerico.value) / parseFloat(rateUSD)
          ).toFixed(2)}.`;
          break;

        case "JPY":
          msg.innerText = `¥${
            inputNumerico.value
          } Ienes japoneses equivalem a R$${(
            parseFloat(inputNumerico.value) / parseFloat(rateJPY)
          ).toFixed(2)}.`;
          break;

        case "EUR":
          msg.innerText = `€${inputNumerico.value} Euros equivalem a R$${(
            parseFloat(inputNumerico.value) / parseFloat(rateEUR)
          ).toFixed(2)}.`;
          break;
      }
    } else {
      switch (selectMoeda.value) {
        case "USD":
          msg.innerText = `R$${inputNumerico.value} Reais equivalem a $${(
            parseFloat(inputNumerico.value) * parseFloat(rateUSD)
          ).toFixed(2)} Dólares.`;
          break;

        case "JPY":
          msg.innerText = `R$${inputNumerico.value} Reais equivalem a ¥${(
            parseFloat(inputNumerico.value) * parseFloat(rateJPY)
          ).toFixed(2)} Ienes japoneses.`;
          break;

        case "EUR":
          msg.innerText = `R$${inputNumerico.value} Reais equivalem a €${(
            parseFloat(inputNumerico.value) * parseFloat(rateEUR)
          ).toFixed(2)} Euros.`;
          break;
      }
    }
  } else {
    msg.innerText = "Insira um valor para converter.";
  }
};
