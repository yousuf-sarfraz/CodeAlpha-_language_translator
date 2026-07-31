from deep_translator import GoogleTranslator


class LanguageTranslator:
    """
    Language Translator Class
    -------------------------
    Handles:
    - Supported Languages
    - Auto Language Detection
    - Text Translation
    """

    def __init__(self):

        try:

            self.languages = {
                "Auto Detect": "auto",
                **GoogleTranslator().get_supported_languages(as_dict=True)
            }

        except Exception:

            self.languages = {
                "Auto Detect": "auto",
                "English": "en",
                "Urdu": "ur"
            }

    # ==========================================
    # Get Supported Languages
    # ==========================================

    def get_languages(self):
        """
        Return all supported languages.
        """

        return self.languages

    # ==========================================
    # Translate Text
    # ==========================================

    def translate_text(self, text, source="auto", target="en"):
        """
        Translate text from source language to target language.
        """

        if not text.strip():
            return "Please enter some text."

        try:

            translated = GoogleTranslator(
                source=source,
                target=target
            ).translate(text)

            return translated

        except Exception as e:

            return f"Translation Error: {str(e)}"

    # ==========================================
    # Validate Language
    # ==========================================

    def is_valid_language(self, language_code):
        """
        Check if language exists.
        """

        return language_code in self.languages.values()

    # ==========================================
    # Detect Language
    # (Future Feature)
    # ==========================================

    def detect_language(self, text):
        """
        Placeholder for future language detection.
        """

        return "auto"