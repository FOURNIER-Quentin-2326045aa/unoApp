import { CardColor } from "./CardColor"

export const AllCards = () => {
    const cards = []
    for (let i = 0; i < 13; i++) {
        if (i > 9) {
            switch (i) {
                case 10:
                    cards.push({ color: CardColor.RED, value: 'skip', visible: false })
                    cards.push({ color: CardColor.GREEN, value: 'skip', visible: false })
                    cards.push({ color: CardColor.BLUE, value: 'skip', visible: false })
                    cards.push({ color: CardColor.YELLOW, value: 'skip', visible: false })
                    break;
                case 11:
                    cards.push({ color: CardColor.RED, value: 'reverse', visible: false })
                    cards.push({ color: CardColor.GREEN, value: 'reverse', visible: false })
                    cards.push({ color: CardColor.BLUE, value: 'reverse', visible: false })
                    cards.push({ color: CardColor.YELLOW, value: 'reverse', visible: false })
                    break;
                case 12:
                    cards.push({ color: CardColor.RED, value: 'draw', visible: false })
                    cards.push({ color: CardColor.GREEN, value: 'draw', visible: false })
                    cards.push({ color: CardColor.BLUE, value: 'draw', visible: false })
                    cards.push({ color: CardColor.YELLOW, value: 'draw', visible: false })
                    break;
                default:
                    break;
            }
            continue;
        }
        cards.push({ color: CardColor.RED, value: i.toString(), visible: false })
        cards.push({ color: CardColor.GREEN, value: i.toString(), visible: false })
        cards.push({ color: CardColor.BLUE, value: i.toString(), visible: false })
        cards.push({ color: CardColor.YELLOW, value: i.toString(), visible: false })
    }
    for (let i = 0; i < 4; i++) {
        cards.push({ color: CardColor.WILD, value: '', visible: false })
        cards.push({ color: CardColor.WILD, value: 'draw', visible: false })
    }
    return cards;
}