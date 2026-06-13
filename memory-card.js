let cardId = 0; // Autoincremental para enlazar las cartas con su tipo

let card1;
let card2;

let score = 0;
let lives = 5;

let cardDictionary = {};

let gameEnabled = true;
let cooldown = false;

// Carga las cartas desde el archivo JSON
async function cargarCartas() {
  const response = await fetch("cards.json");

  const cards = await response.json();

  return cards;
}

// Inserta una carta en el tablero
function renderizarCartas(cardObject) {
  const card = document.createElement("div");
  const cardInner = document.createElement("div");

  card.classList.add("card");
  cardInner.classList.add("card_inner");

  const gameBoard = document.getElementById("mesa-imagenes");

  let frontImage = document.createElement("img");
  frontImage.classList.add("front");
  frontImage.src = cardObject.location;

  let backImage = document.createElement("img");
  backImage.classList.add("carta", "back");

  backImage.id = ++cardId;
  card.dataset.id = cardId;

  backImage.src = "img/REVERSE.png";

  cardDictionary[cardId] = cardObject.name;

  gameBoard.appendChild(card);
  card.appendChild(cardInner);

  cardInner.appendChild(frontImage);
  cardInner.appendChild(backImage);
}

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function mezclar(cardsArray) {
  let totalCards = cardsArray.length;
  let cardCounter = [];

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < totalCards; i++) {
      cardCounter.push(i);
    }
  }

  console.log(cardDictionary);

  while (cardCounter.length > 0) {
    let randomPosition = numeroAleatorio(0, cardCounter.length);

    renderizarCartas(cardsArray[cardCounter[randomPosition]]);
    cardCounter.splice(randomPosition, 1);
  }
}

class Carta {
  constructor(htmlId, type) {
    this.htmlId = htmlId;
    this.type = type;
  }
}

function actualizarStats() {
  document.getElementById("Vida").textContent = lives;
  document.getElementById("Puntos").textContent = score;
}

function ganadora(cardId1, cardId2) {
  score++;
  lives++;

  const card1Element = document.getElementById(cardId1);
  const card2Element = document.getElementById(cardId2);

  card1Element.remove();
  card2Element.remove();

  actualizarStats();
}

function perdedora() {
  lives--;

  if (lives <= 0) {
    //alert("ENDGAME()");
    gameEnabled = false;
  }

  actualizarStats();
}

function compararCartas(id, cardName) {
  if (!card1) {
    card1 = new Carta(id, cardName);
  } else if (card1 && !card2) {
    card2 = new Carta(id, cardName);
  }

  if (card1 && card2) {
    cooldown = true;

    setTimeout(() => {
      console.log(card1);
      console.log(card2);
      console.log(cooldown);

      if (card1.type == card2.type && card1.htmlId !== card2.htmlId) {
        //alert("GANAMOSSS");

        ganadora(card1.htmlId, card2.htmlId);
      } else {
        let firstFlippedCard = document.querySelector(
          `[data-id="${card1.htmlId}"]`,
        );

        let secondFlippedCard = document.querySelector(
          `[data-id="${card2.htmlId}"]`,
        );

        firstFlippedCard.classList.toggle("flipped");
        secondFlippedCard.classList.toggle("flipped");

        perdedora();
      }

      card1 = null;
      card2 = null;
    }, 1000);

    setTimeout(() => {
      cooldown = false;
    }, 1000);
  }
}

function resetGame() {
  cardId = 0;

  score = 0;
  lives = 5;

  cardDictionary = {};

  gameEnabled = true;
  cooldown = false;

  actualizarStats();

  document.getElementById("mesa-imagenes").innerHTML = "";

  iniciarPartida();
}

async function iniciarPartida() {
  mezclar(cards);

  document.querySelectorAll(".carta").forEach((backCard) => {
    backCard.addEventListener("click", () => {
      if (!cooldown && gameEnabled) {
        let selectedCard = document.querySelector(`[data-id="${backCard.id}"]`);

        selectedCard.classList.toggle("flipped");

        compararCartas(backCard.id, cardDictionary[backCard.id]);
      }
    });
  });
}

async function main() {
  cards = await cargarCartas();

  let resetButton = document.getElementById("Reset");

  resetButton.addEventListener("click", function () {
    resetGame();
  });

  iniciarPartida();
}

main();
