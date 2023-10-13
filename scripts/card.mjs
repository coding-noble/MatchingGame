export class Card {
    constructor(suit, value, image) {
        this.suit = suit;
        this.value = value;
        this.isFlipped = false;
        this.cardBack = "/images/Card_back.svg";
        this.cardFace = image;
    }

    flip() {
        this.isFlipped = !this.isFlipped;
    }
}