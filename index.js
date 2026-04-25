
let wordHistory = []
const errorMessage = {

    title: 'No Definitions Found',
    message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
    resolution: 'You can try the search again at later time or head to the web instead.',
    network: "I'm having trouble reaching the dictionary right now; please check your internet connection or try again in a few moments.",
    emptyInput: "It looks like the search box is empty, please type a word so I can find a definition for you!"

}

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

        wordSearch(input.value)

        input.value = ""

    })

    reset.addEventListener("click", (event) => {

        event.preventDefault()

        resetButton()

    })

})

function wordSearch(word) {

    const definitionContainer = document.querySelector("#definition-container")

    if (!word.trim()) {

        definitionContainer.innerHTML = ""

        return handleEmptyError(errorMessage)
    }

    definitionContainer.innerHTML = ""

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(json => {

            const data = json

            if (data["title"] !== "No Definitions Found") {

                displayWord(data)
                handleHistory(data)

            } else {

                handleError(data)

            }

        })
        .catch((error) => {

            handleConnectionError(errorMessage)

        })

}

function displayWord(data) {

    const definitionContainer = document.querySelector("#definition-container")

    const word = data[0]["word"]

    buildWord(definitionContainer, word)

    const phoneticAudioDiv = document.createElement("div")
    phoneticAudioDiv.id = "phonetic-audio-container"

    const phonetics = data[0]["phonetics"]

    buildPhonetics(phoneticAudioDiv, phonetics)

    buildAudio(definitionContainer, phoneticAudioDiv, phonetics)

    const meanings = data[0]["meanings"]

    buildDefinitions(definitionContainer, meanings)

    buildSynonyms(definitionContainer, meanings)

}

function buildWord(container, word) {

    const h1 = document.createElement("h1")

    h1.textContent = word
    h1.id = "word"

    container.append(h1)

}

function buildPhonetics(container, phonetics) {

    const phoneticText = phonetics.find((element) => {

        return element["text"] && element["text"] !== ""

    })

    const phonetic = phoneticText ? phoneticText["text"] : "n/a"

    const h2 = document.createElement("h2")

    h2.textContent = phonetic
    h2.id = "phonetic-text"

    container.append(h2)

}

function buildAudio(mainContainer, container, phonetics) {

    const audioFile = phonetics.find((element) => {

        return element.audio && element.audio !== ""

    })
    const audio = (typeof audioFile === "object") ? new Audio(audioFile["audio"]) : ""

    const p = document.createElement("p")

    p.textContent = "Sorry, no audio available!"
    p.id = "error-message"
    p.hidden = true

    const img = document.createElement("img")

    img.id = "audio-button"

    img.src = (audio) ? "images/on_play_button.png" : "images/off_play_button.png"

    img.addEventListener("click", (event) => {

        event.preventDefault()

        if (audio) {

            audio.play()

        } else {

            alertNoAudio(p)

        }

    })

    container.append(img)
    mainContainer.append(container, p)

}

function alertNoAudio(p) {

    p.hidden = false

    setTimeout(() => {

        p.hidden = true

    }, 3000)

}

function buildPartOfSpeech(container, partOfSpeech) {

    const h3 = document.createElement("h3")

    h3.textContent = partOfSpeech
    h3.id = "part-of-speech"

    container.append(h3)

}

function buildDefinitions(container, meanings) {

    let counter = 1

    for (const key of meanings) {

        const h2 = document.createElement("h2")

        h2.textContent = key["partOfSpeech"]
        h2.id = "phonetic-text"

        container.append(h2)

        for (const subKey of key["definitions"]) {

            const definitionText = document.createElement("p")
            const example = document.createElement("p")

            definitionText.textContent = `Definition ${counter}: ${subKey["definition"]}`
            definitionText.id = "definition-text"

            counter += 1

            container.append(definitionText)

            example.textContent = `Example: ${subKey["example"]}`
            example.id = "example"

            if (subKey["example"]) {

                container.append(example)

            }

        }

    }

}

function buildSynonyms(container, meanings) {

    const synonyms = []

    for (const key of meanings) {

        for (const subKey of key["synonyms"]) {

            synonyms.push(subKey)

        }

    }

    const p = document.createElement("p")

    p.textContent = synonyms.length > 0 ? `Synonyms: ${synonyms.join(", ")}` : "Synonyms: N/A"

    container.append(p)

}

function handleHistory(data) {

    const word = data[0]["word"]

    const ul = document.querySelector("#history-list")

    buildHistoryList(ul, word)

}

function buildHistoryList(container, word) {

    const li = document.createElement("li")

    li.id = "searched-word"
    li.textContent = `- ${word}`

    li.addEventListener("click", (event) => {

        event.preventDefault()

        wordSearch(word)

    })

    if (!wordHistory.includes(word)) {

        wordHistory.push(word)

        container.append(li)

    }

}

function resetButton() {

    const input = document.querySelector("#input-box")

    input.value = ""

    const historyList = document.querySelector("#history-list")

    historyList.innerHTML = ""

    const wordContainer = document.querySelector("#definition-container")

    wordContainer.innerHTML = ""

    wordHistory = []

}

function handleEmptyError(error) {

    const definitionContainer = document.querySelector("#definition-container")

    const emptyInput = document.createElement("p")

    emptyInput.id = "error-message"

    emptyInput.textContent = `Error: ${error["emptyInput"]}`

    definitionContainer.append(emptyInput)

}

function handleError(error) {

    const definitionContainer = document.querySelector("#definition-container")

    const title = document.createElement("p")
    const message = document.createElement("p")
    const resolution = document.createElement("p")

    title.id = "error-message"
    message.id = "error-message"
    resolution.id = "error-message"

    title.textContent = `${error["title"]}`
    message.textContent = `${error["message"]}`
    resolution.textContent = `${error["resolution"]}`

    definitionContainer.append(title, message, resolution)

}

function handleConnectionError(error) {

    const definitionContainer = document.querySelector("#definition-container")

    const networkConnectionIssue = document.createElement("p")

    networkConnectionIssue.id = "error-message"

    networkConnectionIssue.textContent = `Error: ${error["network"]}`

    definitionContainer.append(networkConnectionIssue)

}
