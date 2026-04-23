
let wordHistory = []

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#input-form")
    const reset = document.querySelector("#reset-button")

    form.addEventListener("submit", (event) => {

        event.preventDefault()

        searchWord()

    })

    reset.addEventListener("click", (event) => {

        event.preventDefault()

        resetBoard()

    })

})

function displayWord(wordData) {

    const word = wordData[0]["word"]
    const phonetic = wordData[0]["phonetic"]
    const phonetics = wordData[0]["phonetics"]
    const definitions = wordData[0]["meanings"][0]["definitions"]
    const sound = phonetics.find((element) => {

        return element.audio && element.audio !== ""

    })
    const audio = (typeof sound === "object") ? new Audio(sound["audio"]) : ""
    const wordContainer = document.querySelector("#word-container")

    const h1 = document.createElement("h1")

    h1.textContent = word

    const h2 = document.createElement("h2")

    h2.textContent = phonetic

    const img = document.createElement("img")

    img.id = "audio-button"

    img.src = (audio) ? "images/play_button.png" : "images/off_play_button.png"

    img.addEventListener("click", (event) => {

        event.preventDefault()

        audio.play()

    })

    wordContainer.append(h1, h2, img)

    let counter = 1

    for (const key of definitions) {

        const p = document.createElement("p")

        p.textContent = `Definition ${counter}: ${key["definition"]}`

        counter += 1

        wordContainer.append(p)

    }

}

function handleHistory(wordData){

    const word = wordData[0]["word"]

    const ul = document.querySelector("#history-list")

    const li = document.createElement("li")
    li.textContent = word

    li.addEventListener("click", (event) => {

        event.preventDefault()

         searchWordButton(word)

    })

    if(!wordHistory.includes(word)){

        wordHistory.push(word)

        ul.append(li)

    }

}

function searchWord() {

    const wordContainer = document.querySelector("#word-container")
    const input = document.querySelector("#input-box")
    const word = input.value

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(json => {

            const wordData = json

            wordContainer.innerHTML = ""

            displayWord(wordData)
            handleHistory(wordData)

            input.value = ""

        })
        .catch((error) => {

            console.log(error)

        })

}

function searchWordButton(word) {

    const wordContainer = document.querySelector("#word-container")

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(json => {

            const wordData = json

            wordContainer.innerHTML = ""
            displayWord(wordData)
            handleHistory(wordData)

        })
        .catch((error) => {

            console.log(error)

        })

}

function resetBoard() {

    const historyList = document.querySelector("#history-list")

    historyList.innerHTML = ""

    const wordContainer = document.querySelector("#word-container")

    wordContainer.innerHTML = ""

    wordHistory = []

}

