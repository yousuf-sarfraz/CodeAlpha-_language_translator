from deep_translator import GoogleTranslator


class LanguageTranslator:

    def __init__(self):
        self.languages = GoogleTranslator().get_supported_languages(as_dict=True)

    def translate_text(self, text, source, target):

        if not text.strip():
            return "Please enter some text."

        try:
            translated = GoogleTranslator(
                source=source,
                target=target
            ).translate(text)

            return translated

        except Exception:
            return "Translation failed."

    def get_languages(self):
        return self.languages