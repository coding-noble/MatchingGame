import { Card } from "./card.mjs";

export class Deck {
    constructor(difficulty) {
        this.cards = [];
        if (difficulty == "hard") {
            this.cardCount = 12;            
        } else if (difficulty == "normal") {
            this.cardCount = 8;
        } else {
            this.cardCount = 4;
        }
    }

    async initializeDeck() {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${this.cardCount}`);
            const cardsData = await response.json();

            cardsData.cards.forEach(card => {
                let newCard = new Card(card.suit, card.code, card.images.svg);
                this.cards.push(newCard);
                this.cards.push(newCard);
            });

            // Fisher-Yates shuffle or Knuth shuffle
            for (let i = this.cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }

        } catch (error) {
            console.error('Error fetching cards from API:', error);
        }
    }
}
