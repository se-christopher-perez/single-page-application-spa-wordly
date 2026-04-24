
let wordHistory = []

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#input-form")
    const input = document.querySelector("#input-box")
    const reset = document.querySelector("#reset-button")

    input.addEventListener("focus", () => {

        input.placeholder = " "

    })

    input.addEventListener("blur", () => {

        input.placeholder = "Type word..."

    })

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

    console.log(wordData)

    const word = wordData[0]["word"]
    const phonetics = wordData[0]["phonetics"]
    const partofSpeech = wordData[0]["meanings"][0]["partOfSpeech"]
    const definitions = wordData[0]["meanings"][0]["definitions"]
    const synonymsArray = wordData[0]["meanings"][0]["synonyms"] || []
    const sound = phonetics.find((element) => {

        return element.audio && element.audio !== ""

    })
    const audio = (typeof sound === "object") ? new Audio(sound["audio"]) : ""
    const phoneticText = phonetics.find((element) => {

        return element.text && element.text !== ""

    })

    const text = phoneticText ? phoneticText["text"] : "N/A"

    const wordContainer = document.querySelector("#word-container")

    const phoneticAudioDiv = document.createElement("div")
    phoneticAudioDiv.id = "phonetic-audio-container"

    const wordTitle = document.createElement("h2")

    wordTitle.id = "word-card"
    wordTitle.textContent = "Word:"

    const h1 = document.createElement("h1")

    h1.textContent = word
    h1.id = "word"

    const h2 = document.createElement("h2")

    h2.textContent = text
    h2.id = "phonetic"

    const h3 = document.createElement("h3")

    h3.textContent = partofSpeech
    h3.id = "part-of-speech"

    const img = document.createElement("img")

    img.id = "audio-button"

    img.src = (audio) ? "images/on_play_button.png" : "images/off_play_button.png"

    img.addEventListener("click", (event) => {

        event.preventDefault()

        if (audio) {

            audio.play()

        }

    })


    phoneticAudioDiv.append(h2, img)
    wordContainer.append(wordTitle, h1, phoneticAudioDiv, h3)

    let counter = 1

    for (const key of definitions) {

        const definition = document.createElement("p")
        const example = document.createElement("p")

        definition.textContent = `Definition ${counter}: ${key["definition"]}`
        definition.id = "definition"

        counter += 1

        wordContainer.append(definition)

        example.textContent = `Example: ${key["example"]}`
        example.id = "example"

        if (key["example"]) {

            wordContainer.append(example)

        }

    }

    const synonymList = document.createElement("p")
    synonymList.textContent = synonymsArray.length > 0 ? `Synonyms: ${synonymsArray.join(", ")}`
        : "Synonyms: N/A"

    wordContainer.append(synonymList)

}

function handleHistory(wordData) {

    const word = wordData[0]["word"]

    const ul = document.querySelector("#history-list")

    const li = document.createElement("li")
    li.id = "searched-word"
    li.textContent = `- ${word}`

    li.addEventListener("click", (event) => {

        event.preventDefault()

        searchWordButton(word)

    })

    if (!wordHistory.includes(word)) {

        wordHistory.push(word)

        ul.append(li)

    }

}

function searchWord() {

    const errorMessage = {

        title: 'No Definitions Found',
        message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
        resolution: 'You can try the search again at later time or head to the web instead.'

    }

    const wordContainer = document.querySelector("#word-container")
    const input = document.querySelector("#input-box")
    const word = input.value

    if (!word.trim()) {
        handleError(errorMessage)
    }

    wordContainer.innerHTML = ""

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(json => {

            const wordData = json

            if (wordData["title"] !== "No Definitions Found") {

                displayWord(wordData)
                handleHistory(wordData)

            } else {

                console.log(json)

                handleError(json)

            }

            input.value = ""

        })
        .catch((error) => {

            handleError(errorMessage)

            input.value = ""

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

function handleError(error) {

    const wordContainer = document.querySelector("#word-container")

    const title = document.createElement("h1")
    const message = document.createElement("h1")
    const resolution = document.createElement("h1")

    title.id = "error-message"
    message.id = "error-message"
    resolution.id = "error-message"

    title.textContent = `Error: ${error["title"]}`
    message.textContent = `Message: ${error["message"]}`
    resolution.textContent = `Suggestion: ${error["resolution"]}`

    wordContainer.append(title, message, resolution)

}

function resetBoard() {

    const historyList = document.querySelector("#history-list")

    historyList.innerHTML = ""

    const wordContainer = document.querySelector("#word-container")

    wordContainer.innerHTML = ""

    wordHistory = []

}

