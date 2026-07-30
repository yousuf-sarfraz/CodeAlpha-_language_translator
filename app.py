from flask import Flask, render_template, request, jsonify
from translator import LanguageTranslator

app = Flask(__name__)

# Initialize Translator
translator = LanguageTranslator()


@app.route("/")
def home():
    """
    Render the home page with supported languages.
    """

    languages = translator.get_languages()

    # Add Auto Detect option at the top
    languages = {
        "Auto Detect": "auto",
        **languages
    }

    return render_template(
        "index.html",
        languages=languages
    )


@app.route("/translate", methods=["POST"])
def translate():
    """
    Translate the given text.
    """

    try:
        text = request.form.get("text", "").strip()
        source = request.form.get("source", "auto")
        target = request.form.get("target", "en")

        if not text:
            return jsonify({
                "success": False,
                "translated": "Please enter some text."
            })

        translated_text = translator.translate_text(
            text=text,
            source=source,
            target=target
        )

        return jsonify({
            "success": True,
            "translated": translated_text
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "translated": f"Error: {str(e)}"
        })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )