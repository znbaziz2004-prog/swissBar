const { translate } = require("@vitalets/google-translate-api");

const SUPPORTED_LANGUAGES = ["de", "fr", "it", "rm"];

const translateTestimonial = async (text) => {
  if (!text || typeof text !== "string") {
    return {};
  }

  const translations = {};

  for (const language of SUPPORTED_LANGUAGES) {
    try {
      const result = await translate(text, {
        to: language,
      });

      translations[language] = result.text;
    } catch (error) {
      console.error(
        `Testimonial translation failed for ${language}:`,
        error.message
      );

      translations[language] = null;
    }
  }

  return translations;
};

module.exports = translateTestimonial;