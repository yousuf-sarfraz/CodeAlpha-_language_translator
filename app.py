@app.route("/")
def home():

    languages = translator.get_languages()

    # Add Auto Detect
    languages = {
        "Auto Detect": "auto",
        **languages
    }

    return render_template(
        "index.html",
        languages=languages
    )