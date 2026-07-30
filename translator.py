from deep_translator import GoogleTranslator


class LanguageTranslator:

    def __init__(self):
        self.languages = GoogleTranslator().get_supported_languages(as_dict=True)

    def get_languages(self):
        return self.languages

    def translate_text(self, text, source, target):
        translator = GoogleTranslator(
            source=source,
            target=target
        )

        return translator.translate(text)