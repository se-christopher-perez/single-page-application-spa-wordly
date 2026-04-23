
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#input-form")

    form.addEventListener("submit", (event) => {

        event.preventDefault()

        searchWord()

    })

})

function displayWord(wordData){

    const word = wordData[0]["word"]

    const wordContainer = document.querySelector("#word-container")

    const h1 = document.createElement("h1")

    h1.textContent = word

    wordContainer.append(h1)


}

function searchWord(){

    const input = document.querySelector("#input-box")
    const word = input.value

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(json => {

        const wordData = json

        console.log(wordData)

        displayWord(wordData)

        input.value = ""

    })
    .catch((error) => {

        console.log(error)

    })

}

