// Récupération du bouton (s'il existe)
const toggleButton = document.getElementById("themeToggle");
 
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
 
window.addEventListener("load", () => {
 
    // ── Thème ──
    applyTheme();
    if (toggleButton) toggleButton.addEventListener("click", toggleTheme);
 
    // ── Convertisseur (seulement si on est sur la bonne page) ──
    const amountInput = document.getElementById("amount");
    const submit      = document.getElementById("submit");
    const fromSelect  = document.getElementById("from");
    const toSelect    = document.getElementById("to");
    const error       = document.getElementById("error");
 
    if (fromSelect && toSelect) {
 
        function updateOptions() {
            const from = fromSelect.value;
            const to   = toSelect.value;
            for (let option of toSelect.options)  option.disabled = option.value === from;
            for (let option of fromSelect.options) option.disabled = option.value === to;
        }
 
        async function convert() {
            let amount = amountInput ? amountInput.value : 1;
            const rateElement = document.getElementById("rate");
            if (!amount) amount = 1;
 
            const from = fromSelect.value;
            const to   = toSelect.value;
            if (from === to) { alert("Choisis deux devises différentes"); return; }
 
            const response = await fetch("/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, from, to })
            });
 
            const data = await response.json();
            const resultElement = document.getElementById("result");
 
            const formattedAmount = new Intl.NumberFormat("fr-FR", { style: "currency", currency: from }).format(amount);
            const formattedResult = new Intl.NumberFormat("fr-FR", { style: "currency", currency: to, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.result);
            const formattedRate   = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(data.rate);
 
            rateElement.innerText = `1 ${from} = ${formattedRate} ${to}`;
 
            if (amountInput && amountInput.value) {
                resultElement.innerText = formattedAmount + " = " + formattedResult;
            } else {
                resultElement.innerText = "";
            }
            resultElement.classList.add("result-animation");
        }
 
        if (amountInput) amountInput.addEventListener("input", convert);
 
        const savedFrom = localStorage.getItem("fromCurrency");
        const savedTo   = localStorage.getItem("toCurrency");
        if (savedFrom) fromSelect.value = savedFrom;
        if (savedTo)   toSelect.value   = savedTo;
        updateOptions();
        convert();
 
        fromSelect.addEventListener("change", () => {
            localStorage.setItem("fromCurrency", fromSelect.value);
            updateOptions();
            convert();
        });
 
        toSelect.addEventListener("change", () => {
            localStorage.setItem("toCurrency", toSelect.value);
            updateOptions();
            convert();
        });
 
        if (submit) submit.addEventListener("click", () => {
            if (!amountInput.value) error.innerHTML = "Vous devez entrer un montant.";
        });
 
        window.swap = function () {
            let temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            localStorage.setItem("fromCurrency", fromSelect.value);
            localStorage.setItem("toCurrency", toSelect.value);
            updateOptions();
            convert();
        };
    }
 
    // ── Curseur pièce ──
    const coinCursor = document.getElementById("coin-cursor");
    if (!coinCursor) return;
 
    let mx = 0, my = 0, cx = 0, cy = 0;
    const symbols = ["€", "£", "$", "¥", "₿", "◎"];
    let symIdx = 0;
 
    document.addEventListener("mousemove", e => {
        mx = e.clientX;
        my = e.clientY;
    });
 
    function cursorLoop() {
        cx += (mx - cx) * 0.2;
        cy += (my - cy) * 0.2;
        coinCursor.style.left = cx + "px";
        coinCursor.style.top  = cy + "px";
        requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
 
    document.querySelectorAll("a, button, select, input").forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
    });
 
    document.addEventListener("mousedown", () => {
        document.body.classList.add("clicking");
        symIdx = (symIdx + 1) % symbols.length;
        coinCursor.textContent = symbols[symIdx];
        spawnSparkles(mx, my);
    });
    document.addEventListener("mouseup", () => document.body.classList.remove("clicking"));
 
    document.addEventListener("dblclick", () => {
        document.body.classList.add("spinning");
        setTimeout(() => document.body.classList.remove("spinning"), 500);
    });
 
    function spawnSparkles(x, y) {
        for (let i = 0; i < 6; i++) {
            const s = document.createElement("div");
            s.classList.add("sparkle");
            const size  = 3 + Math.random() * 5;
            const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
            const dist  = 20 + Math.random() * 20;
            s.style.cssText = `
                width:${size}px; height:${size}px;
                left:${x + Math.cos(angle) * dist}px;
                top:${y + Math.sin(angle) * dist}px;
                animation-delay:${i * 0.05}s;
            `;
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 700);
        }
    }
 
});