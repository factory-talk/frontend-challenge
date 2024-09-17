function toPascalCase(text: string) {
    return `${text}`
        .toLowerCase()
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w*)/, 'g'),
            ($1, $2, $3) => $2.toUpperCase().concat(' ', $3)
        )
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export function wordsToPascalCase(words: string) {

    const wordsSplit = words.split(' ');

    let pascalCaseWord = "";
    for (const word of wordsSplit) {
        const transformedWord = toPascalCase(word);

        if (pascalCaseWord == "") {
            pascalCaseWord = pascalCaseWord.concat(transformedWord);
        } else {
            pascalCaseWord = pascalCaseWord.concat(' ', transformedWord);
        }
    }

    return pascalCaseWord;
}