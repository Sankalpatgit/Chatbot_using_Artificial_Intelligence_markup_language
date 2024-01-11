import * as intents from './assets/intents.json';

export const TransformedItems = () => {
    let items = []
    intents.intents.map((intent) => {
        const formattedItems = intent.patterns.map(pattern => ({label: pattern, value: pattern}))
        items = items.concat(formattedItems)
    });

    return items;
}