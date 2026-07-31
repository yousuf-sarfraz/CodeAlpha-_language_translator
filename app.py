from flask import Flask, render_template, request, jsonify
from translator import LanguageTranslator
import os

# ==========================================
# Flask Configuration
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

translator = LanguageTranslator()


# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():
    """
    Render Home Page
    """

    languages = translator.get_languages()

    return render_template(
        "index.html",
        languages=languages
    )


# ==========================================
# Translate API
# ==========================================

@app.route("/translate", methods=["POST"])
def translate():

    try:

        text = request.form.get("text", "").strip()
        source = request.form.get("source", "auto")
        target = request.form.get("target", "en")

        if not text:

            return jsonify({
                "success": False,
                "translated": "Please enter some text."
            })

        translated = translator.translate_text(
            text=text,
            source=source,
            target=target
        )

        return jsonify({
            "success": True,
            "translated": translated
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "translated": str(e)
        }), 500


# ==========================================
# Health Check
# ==========================================

@app.route("/health")
def health():

    return jsonify({
        "status": "running",
        "application": "Language Translator Pro",
        "version": "2.0"
    })


# ==========================================
# Error Pages
# ==========================================

@app.errorhandler(404)
def page_not_found(error):

    return jsonify({
        "error": "Page Not Found"
    }), 404


@app.errorhandler(500)
def internal_error(error):

    return jsonify({
        "error": "Internal Server Error"
    }), 500


# ==========================================
# Run Application
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )