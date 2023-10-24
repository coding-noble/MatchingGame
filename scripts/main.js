class Card {
    constructor(suit, value, image) {
        this.suit = suit;
        this.value = value;
        this.image = image;
        this.cardBack = "images/Card_back.svg";
        this.isFlipped = false;
    }

    toggleFlip() {
        this.isFlipped = !this.isFlipped;
    }
}

class Deck {
    constructor(difficulty) {
        const difficultyMap = {
            "hard": 12,
            "normal": 8,
            "easy": 4,
        };
        this.cardCount = difficultyMap[difficulty] || 4;
        this.cards = [];
    }

    async initializeDeck() {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${this.cardCount}`);
            const cardsData = await response.json();
            const cardList = cardsData.cards;

            for (const cardData of cardList) {
                const card1 = new Card(cardData.suit, cardData.code, cardData.images.svg);
                const card2 = new Card(cardData.suit, cardData.code, cardData.images.svg);

                this.cards.push(card1, card2);
            }

            this.shuffleCards();
        } catch (error) {
            console.error('Error fetching cards from API:', error);
        }
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

let startTime, totalMatches, selectedDifficulty;
let matchesFound = 0;
let flippedCards = [];

const difficultyRadios = document.getElementsByName('difficulty');

async function startGame() {
    
    for (const radio of difficultyRadios) {
        if (radio.checked) {
            selectedDifficulty = radio.value;
            break;
        }
    }

    let newDeck = new Deck(selectedDifficulty);
    await newDeck.initializeDeck();
    renderCards(newDeck);
    
    totalMatches = newDeck.cards.length / 2;
    matchesFound = 0;

    document.getElementById('matchesMade').textContent = matchesFound;
    startTime = new Date().getTime();
}

for (const radio of difficultyRadios) {
    radio.addEventListener('change', () => startGame());
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardCode = card.value;

    cardElement.style.backgroundImage = `url(${card.isFlipped ? card.image : card.cardBack})`;

    cardElement.addEventListener('click', () => {
        if (flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            cardElement.style.backgroundImage = `url(${card.isFlipped ? card.image : card.cardBack})`;
            flippedCards.push({ element: cardElement, card: card });

            if (flippedCards.length === 2) {
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
            matchesFound++;
            document.getElementById('matchesMade').textContent = matchesFound;

            if (matchesFound === totalMatches) displayGameResult(Math.round((new Date().getTime() - startTime) / 1000));
        } else {
            setTimeout(() => {
                card1.card.toggleFlip();
                card2.card.toggleFlip();
                card1.element.style.backgroundImage = `url(${card1.card.cardBack})`;
                card2.element.style.backgroundImage = `url(${card2.card.cardBack})`;
                flippedCards = [];
            }, 500);
        }
    }
}

function renderCards(deck) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = "";
    deck.cards.forEach(card => gameBoard.appendChild(createCardElement(card)));
}

function displayGameResult(elapsedTimeInSeconds) {
    alert(`Congratulations! You completed the game in ${Math.floor(elapsedTimeInSeconds / 60)} minutes and ${elapsedTimeInSeconds % 60} seconds.`);
}

startGame();

document.getElementById("reset").addEventListener("click" , () => startGame());
