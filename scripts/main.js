import { Deck } from './deck.mjs';

let flippedCards = [];

async function startGame() {
    let newDeck = new Deck("normal");
    await newDeck.initializeDeck();
    renderCards(newDeck);
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardCode = card.value;

    cardElement.style.backgroundImage = `url(${card.isFlipped ? card.cardFace : card.cardBack})`;

    cardElement.style.backgroundSize = 'contain';
    cardElement.style.backgroundRepeat = 'no-repeat';

    cardElement.style.width = '135px';
    cardElement.style.height = '200px';

    cardElement.addEventListener('click', () => {
        if (flippedCards.length < 2) {
            card.flip();
            cardElement.style.backgroundImage = `url(${card.isFlipped ? card.cardFace : card.cardBack})`;
            flippedCards.push({ element: cardElement, card: card });

            if (flippedCards.length === 2) {
                setTimeout(checkMatchingCards, 1000);
            }
        } else if (flippedCards.length === 2) {
            if (!card.isFlipped) {
                card.flip();
                cardElement.style.backgroundImage = `url(${card.isFlipped ? card.cardFace : card.cardBack})`;
                flippedCards.push({ element: cardElement, card: card });

                setTimeout(checkMatchingCards, 1000);
            }
        }
    });

    return cardElement;
}

function checkMatchingCards() {
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        if (card1.card.value === card2.card.value) {
            flippedCards = [];
        } else {
            setTimeout(() => {
                card1.card.flip();
                card2.card.flip();
                card1.element.style.backgroundImage = `url(${card1.card.cardBack})`;
                card2.element.style.backgroundImage = `url(${card2.card.cardBack})`;
                flippedCards = [];
            }, 500);
        }
    }
}

function renderCards(deck) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    deck.cards.forEach(card => gameBoard.appendChild(createCardElement(card)));
}

startGame();
