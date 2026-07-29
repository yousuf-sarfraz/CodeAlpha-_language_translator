import os
from flask import Flask, render_template, request, jsonify
from translator import LanguageTranslator

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create Flask app
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

# Initialize translator
translator = LanguageTranslator()


@app.route("/")
def home():
    """Render the homepage."""
    try:
        languages = translator.get_languages()
        return render_template("index.html", languages=languages)
    except Exception as e:
        return f"Error loading page: {e}", 500


@app.route("/translate", methods=["POST"])
def translate():
    """Translate the given text."""
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
            text,
            source,
            target
        )

        return jsonify({
            "success": True,
            "translated": translated_text
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "translated": f"Error: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )