let id_carta = 0; //autoincremental para enlazar las cartas random con su tipo
let Carta1;
let Carta2;
let puntos = 0;
let vidas = 5;
let diccionario_random = {};
let enable_game = true;
let cooldown = false;

//Funcion para pedir el array con el json de las cartas
async function CargarCartas() {
  const respuesta = await fetch("cards.json");

  const cartas = await respuesta.json();

  return cartas;
}

//Funcion para recibir la carta e insertarla en el div
function RenderizarCartas(objetoCarta) {
  const card = document.createElement("div");
  const card_inner = document.createElement("div");

  card.classList.add("card");
  card_inner.classList.add("card_inner");

  const mesa = document.getElementById("mesa-imagenes");

  let img = document.createElement("img");

  //img.className = "carta";
  img.classList.add("front");

  //console.log(objetoCarta.location);
  img.src = objetoCarta.location;

  //img.dataset.id = objetoCarta.name;

  let imgBack = document.createElement("img");
  imgBack.classList.add("carta", "back");
  imgBack.id = ++id_carta;
  card.dataset.id = id_carta;
  imgBack.src = "img/REVERSE.png";

  diccionario_random[id_carta] = objetoCarta.name;

  mesa.appendChild(card);
  card.appendChild(card_inner);
  card_inner.appendChild(img);
  card_inner.appendChild(imgBack);
}

function numero_aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function mezclar(array) {
  let largo = array.length;
  let conteo_cartas = [];

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < largo; i++) {
      conteo_cartas.push(i);
    }
  }

  console.log(diccionario_random);

  //console.log(conteo_cartas);

  while (conteo_cartas.length > 0) {
    //console.log(conteo_cartas.length);
    let temp = numero_aleatorio(0, conteo_cartas.length);

    RenderizarCartas(array[conteo_cartas[temp]]);
    conteo_cartas.splice(temp, 1); //Esto elimina la posicion random
  }
}

class Carta {
  constructor(idHtml, tipo) {
    this.idHtml = idHtml;
    this.tipo = tipo;
  }
}

function actualizarStats() {
  //console.log("vida: ", vidas, " puntos: ", puntos);
  document.getElementById("Vida").textContent = vidas;
  document.getElementById("Puntos").textContent = puntos;
}

function ganadora(idCarta1, idCarta2) {
  puntos++;
  const card1 = document.getElementById(idCarta1);
  const card2 = document.getElementById(idCarta2);
  card1.remove();
  card2.remove();

  actualizarStats();
}

function perdedora() {
  vidas--;
  if (vidas <= 0) {
    alert("ENDGAME()");
    enable_game = false;
  }
  actualizarStats();
}

function compararCartas(id, nombreCarta) {
  // let mensaje = "ID: " + id + " Nombre: " + nombreCarta;
  // alert(mensaje);

  if (!Carta1) {
    Carta1 = new Carta(id, nombreCarta);
    //console.log(Carta1);
  } else if (Carta1 && !Carta2) {
    Carta2 = new Carta(id, nombreCarta);
    //console.log("Carta2: ", Carta2);
  }

  if (Carta1 && Carta2) {
    cooldown = true;
    setTimeout(() => {
      console.log(Carta1);
      console.log(Carta2);
      console.log(cooldown);

      if (Carta1.tipo == Carta2.tipo && Carta1.idHtml !== Carta2.idHtml) {
        alert("GANAMOSSS");
        ganadora(Carta1.idHtml, Carta2.idHtml);
      } else {
        // alert("perdimos");
        // alert("HOLAAAAAAAAAAAAAA");
        let flipCarta1 = document.querySelector(`[data-id="${Carta1.idHtml}"]`);
        // alert(Carta1.id);
        let flipCarta2 = document.querySelector(`[data-id="${Carta2.idHtml}"]`);

        flipCarta1.classList.toggle("flipped");
        flipCarta2.classList.toggle("flipped");

        perdedora();
      }
      Carta1 = null;
      Carta2 = null;
    }, 1000);

    setTimeout(() => {
      cooldown = false;
    }, 1000);
  }
}

async function main() {
  cartas = await CargarCartas();
  //console.log(cartas);
  mezclar(cartas);

  let reset = document.getElementById("Reset");

  reset.addEventListener("click", function () {
    alert("RESETEAO PAPA");
    mezclar(cartas);
  });

  //Aqui monitoreamos las cartas seleccionadas
  // const ClaseCarta = document.querySelectorAll(".carta");

  // ClaseCarta.forEach(function (carta) {
  //   carta.addEventListener("click", function () {
  //     let contexto = "Tipo: " + carta.dataset.id + " id: " + carta.id;
  //     //alert(carta.dataset.id);
  //     alert(contexto);
  //     compararCartas(carta.id, carta.dataset.id);
  //   });
  // });

  // document.querySelectorAll(".card").forEach((card) => {
  //   if (!card.classList.contains("card, flipped")) {
  //     card.addEventListener("click", () => {
  //       card.classList.toggle("flipped");
  //     });
  //   }
  // });

  document.querySelectorAll(".carta").forEach((back) => {
    back.addEventListener("click", () => {
      // document.querySelectorAll(".card").forEach((card) => {
      //   card.classList.toggle("flipped");
      // });

      if (!cooldown && enable_game) {
        console.log("TITANICOOOOOOOOO");
        console.log("luna");
        let toque = document.querySelector(`[data-id="${back.id}"]`);
        toque.classList.toggle("flipped");

        compararCartas(back.id, diccionario_random[back.id]);
      }
    });
  });
}

main();
