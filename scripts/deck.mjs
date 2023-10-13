import { Card } from "./card.mjs";

export class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=52`).then(response => response.json()).then(cardsData => {
            cardsData.cards.forEach(card => {
                let newCard = new Card(card.suit, card.code, card.images.svg);
                this.cards.push(newCard);
            });
        }).catch(error => console.error('Error fetching cards from API:', error));
    }
}