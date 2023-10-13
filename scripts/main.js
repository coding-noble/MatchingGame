import { Deck } from './deck.mjs';

let newDeck = new Deck();

console.log(newDeck.cards[0])

for (let i = 0; i < newDeck.length; i++) {
    console.log("Test")
}
newDeck.cards.forEach(card => {
    console.log(card.suit);
});
