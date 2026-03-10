/// Récupération du bouton (s’il existe)
const toggleButton = document.getElementById("themeToggle");

// Applique le thème en fonction du localStorage
function applyTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (toggleButton) toggleButton.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark");
        if (toggleButton) toggleButton.textContent = "🌙 Dark Mode";
    }
}

// Toggle dark/light mode
function toggleTheme() {
    const isDark = document.body.classList.contains("dark");

    if (isDark) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
        if (toggleButton) toggleButton.textContent = "🌙 Dark Mode";
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        if (toggleButton) toggleButton.textContent = "☀️ Light Mode";
    }
}

// Appliquer le thème au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    applyTheme();

    // Si le bouton existe, on ajoute l'événement
    if (toggleButton) toggleButton.addEventListener("click", toggleTheme);
});
document.getElementById("amount").addEventListener("input", convert)

const submit = document.getElementById("submit")
const fromSelect = document.getElementById("from")
const toSelect = document.getElementById("to")
const error = document.getElementById("error")

function updateOptions() {

    const from = fromSelect.value
    const to = toSelect.value

    for (let option of toSelect.options) {
        option.disabled = option.value === from
    }

    for (let option of fromSelect.options) {
        option.disabled = option.value === to
    }
}

window.onload = () => {
    
    const savedFrom = localStorage.getItem("fromCurrency")
    const savedTo = localStorage.getItem("toCurrency")

    if (savedFrom) fromSelect.value = savedFrom
    if (savedTo) toSelect.value = savedTo

    updateOptions()
    convert()
}

fromSelect.addEventListener("change", () => {
    localStorage.setItem("fromCurrency", fromSelect.value)
    updateOptions()
    convert()
})

toSelect.addEventListener("change", () => {
    localStorage.setItem("toCurrency", toSelect.value)
    updateOptions()
    convert()
})

submit.addEventListener("click", () => {

    const amount = document.getElementById("amount").value

    if (!amount) {
        error.innerHTML = "Vous devez entrer un montant."
    }
})

async function convert() {

    let amount = document.getElementById("amount").value
    const rateElement = document.getElementById("rate")

    if (!amount) {
        amount = 1
    }

    const from = fromSelect.value
    const to = toSelect.value

    if (from === to) {
        alert("Choisis deux devises différentes")
        return
    }

    const response = await fetch("/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount,
            from: from,
            to: to
        })
    })

    const data = await response.json()

    const resultElement = document.getElementById("result")

    const formattedAmount = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: from
    }).format(amount)

    const formattedResult = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: to,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(data.result)

    const formattedRate = new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(data.rate)

    rateElement.innerText = `1 ${from} = ${formattedRate} ${to}`

    if (document.getElementById("amount").value) {
        resultElement.innerText = formattedAmount + " = " + formattedResult
    } else {
        resultElement.innerText = ""
    }

    resultElement.classList.add("result-animation")

}
function swap() {
    let temp = fromSelect.value
    fromSelect.value = toSelect.value
    toSelect.value = temp
}