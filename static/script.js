/* ==========================================
   Language Translator Pro
   Part 1 - Basic Features
========================================== */

// ==========================================
// DOM ELEMENTS
// ==========================================

const text = document.getElementById("text");
const source = document.getElementById("source");
const target = document.getElementById("target");
const result = document.getElementById("result");

const count = document.getElementById("count");

const translateBtn = document.querySelector(".translate-btn");
const swapBtn = document.getElementById("swapBtn");

const copyBtn = document.getElementById("copyBtn");
const clearHistoryBtn = document.getElementById("clearHistory");

const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");

const themeBtn = document.getElementById("themeBtn");

const downloadBtn = document.getElementById("downloadBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const loading = document.getElementById("loading");
const toast = document.getElementById("toast");

const historyList = document.getElementById("historyList");

// ==========================================
// CHARACTER COUNTER
// ==========================================

text.addEventListener("input", () => {

    count.textContent = text.value.length;

});

// ==========================================
// TOAST
// ==========================================

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// ==========================================
// LOADING
// ==========================================

function showLoading(){

    loading.classList.remove("hidden");

}

function hideLoading(){

    loading.classList.add("hidden");

}

// ==========================================
// TRANSLATE
// ==========================================

async function translateText(){

    if(text.value.trim()===""){

        showToast("Please enter some text.");

        return;

    }

    showLoading();

    const formData = new FormData();

    formData.append("text",text.value);

    formData.append("source",source.value);

    formData.append("target",target.value);

    try{

        const response = await fetch("/translate",{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        result.innerText = data.translated;

        hideLoading();

        showToast("Translation Complete");

        saveHistory();

    }

    catch(error){

        hideLoading();

        result.innerText="Translation Failed";

        showToast("Server Error");

        console.error(error);

    }

}

// ==========================================
// SWAP LANGUAGES
// ==========================================

swapBtn.addEventListener("click",()=>{

    let temp=source.value;

    source.value=target.value;

    target.value=temp;

});

// ==========================================
// COPY
// ==========================================

copyBtn.addEventListener("click",()=>{

    navigator.clipboard.writeText(result.innerText);

    showToast("Copied Successfully");

});

// ==========================================
// KEYBOARD SHORTCUT
// Ctrl + Enter
// ==========================================

document.addEventListener("keydown",(event)=>{

    if(event.ctrlKey && event.key==="Enter"){

        translateText();

    }

});
/* ==========================================
   SPEECH TO TEXT
========================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.addEventListener("click", () => {

        recognition.start();

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone-lines"></i>';

        showToast("Listening...");

    });

    recognition.onresult = (event) => {

        const transcript =
            event.results[0][0].transcript;

        text.value = transcript;

        count.textContent = transcript.length;

        showToast("Speech Recognized");

    };

    recognition.onerror = (event) => {

        console.log(event.error);

        showToast("Speech Error");

    };

    recognition.onend = () => {

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';

    };

}

/* ==========================================
   TEXT TO SPEECH
========================================== */

speakBtn.addEventListener("click", () => {

    const message = result.innerText.trim();

    if (
        message === "" ||
        message === "Your translated text will appear here..."
    ) {

        showToast("Nothing to Speak");

        return;

    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = target.value;

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speechSynthesis.speak(speech);

    showToast("Speaking...");

});

/* ==========================================
   DOWNLOAD
========================================== */

downloadBtn.addEventListener("click", () => {

    const message = result.innerText.trim();

    if (
        message === "" ||
        message === "Your translated text will appear here..."
    ) {

        showToast("Nothing to Download");

        return;

    }

    const blob = new Blob(
        [message],
        {
            type: "text/plain"
        }
    );

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = "translation.txt";

    link.click();

    window.URL.revokeObjectURL(url);

    showToast("Downloaded");

});

/* ==========================================
   DARK MODE
========================================== */

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (
        document.body.classList.contains("dark-mode")
    ) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

    else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

/* ==========================================
   FAVORITES
========================================== */

favoriteBtn.addEventListener("click", () => {

    const translation =
        result.innerText.trim();

    if (
        translation === "" ||
        translation === "Your translated text will appear here..."
    ) {

        showToast("Nothing to Save");

        return;

    }

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    favorites.push({

        original: text.value,

        translated: translation,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    favoriteBtn.innerHTML =
        '<i class="fa-solid fa-star"></i>';

    showToast("Added to Favorites");

});
/* ==========================================
   TRANSLATION HISTORY
========================================== */

loadHistory();

function saveHistory() {

    const translation = result.innerText.trim();

    if (
        translation === "" ||
        translation === "Your translated text will appear here..."
    ) {
        return;
    }

    let history =
        JSON.parse(localStorage.getItem("history")) || [];

    history.unshift({
        original: text.value,
        translated: translation,
        source: source.options[source.selectedIndex].text,
        target: target.options[target.selectedIndex].text,
        date: new Date().toLocaleString()
    });

    // Keep only latest 10 translations
    history = history.slice(0, 10);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();
}

/* ==========================================
   LOAD HISTORY
========================================== */

function loadHistory() {

    const history =
        JSON.parse(localStorage.getItem("history")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            "<li>No translations yet.</li>";

        return;
    }

    history.forEach((item) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${item.original}</strong><br>
            ${item.translated}
            <br>
            <small>${item.date}</small>
        `;

        li.addEventListener("click", () => {

            text.value = item.original;

            result.innerText = item.translated;

            count.textContent = item.original.length;

        });

        historyList.appendChild(li);

    });

}

/* ==========================================
   CLEAR HISTORY
========================================== */

clearHistoryBtn.addEventListener("click", () => {

    localStorage.removeItem("history");

    loadHistory();

    showToast("History Cleared");

});

/* ==========================================
   AUTO TRANSLATE
========================================== */

text.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        event.ctrlKey
    ) {

        event.preventDefault();

        translateText();

    }

});

/* ==========================================
   ENTER ANIMATION
========================================== */

window.addEventListener("load", () => {

    document.querySelector(".container")
        .style.opacity = "1";

});

/* ==========================================
   PREVENT EMPTY COPY
========================================== */

copyBtn.addEventListener("click", () => {

    if (
        result.innerText.trim() === "" ||
        result.innerText ===
        "Your translated text will appear here..."
    ) {

        showToast("Nothing to Copy");

        return;
    }

});

/* ==========================================
   PREVENT EMPTY DOWNLOAD
========================================== */

downloadBtn.addEventListener("click", () => {

    if (
        result.innerText.trim() === "" ||
        result.innerText ===
        "Your translated text will appear here..."
    ) {

        showToast("Nothing to Download");

        return;
    }

});

/* ==========================================
   PAGE READY
========================================== */

window.onload = () => {

    count.textContent = text.value.length;

    loadHistory();

    showToast("Language Translator Ready");

};