from flask import Flask, render_template, request, jsonify  # type: ignore
import requests  # type: ignore

app = Flask(__name__)

currencies = {
    "EUR": "🇪🇺 Euro",
    "USD": "🇺🇸 Dollar américain",
    "GBP": "🇬🇧 Livre sterling",
    "JPY": "🇯🇵 Yen japonais",
    "CAD": "🇨🇦 Dollar canadien",
    "AUD": "🇦🇺 Dollar australien",
    "CHF": "🇨🇭 Franc suisse",
    "CNY": "🇨🇳 Yuan chinois",
    "INR": "🇮🇳 Roupie indienne",
    "BRL": "🇧🇷 Réal brésilien",
    "MXN": "🇲🇽 Peso mexicain",
    "KRW": "🇰🇷 Won sud-coréen",
    "SEK": "🇸🇪 Couronne suédoise",
    "NOK": "🇳🇴 Couronne norvégienne",
    "DKK": "🇩🇰 Couronne danoise",
    "MAD": "🇲🇦 Dirham marocain",
}


def convert_currency(amount, from_currency, to_currency):
    url = f"https://open.er-api.com/v6/latest/{from_currency}"
    response = requests.get(url)
    data = response.json()

    rate = data["rates"][to_currency]
    result = round(amount * rate, 2)

    return result, rate


@app.route("/")
def index():
    return render_template("index.html", currencies=currencies)

@app.route("/settings")
def settings():
    return render_template("settings.html", currencies=currencies)

@app.route("/convert", methods=["POST"])
def convert():
    data = request.json

    amount = float(data["amount"])
    from_curr = data["from"]
    to_curr = data["to"]

    result, rate = convert_currency(amount, from_curr, to_curr)

    return jsonify({"result": result, "rate": rate})


if __name__ == "__main__":
    app.run(debug=False)
