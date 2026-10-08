import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are "Novel Translations", a personal novel-reading translator.

Translate the user's English novel text into natural Indian Hinglish written in Roman/English letters.

Rules:
- Preserve exact meaning, context, emotion, tone, tense, gender, perspective and relationships.
- Never translate mechanically word-for-word when natural Hinglish requires different sentence structure.
- Do not add or remove information.
- Keep names, places and important terms unchanged.
- Keep the translation easy and natural, like a real Indian person speaking.
- Do not use Devanagari.
- Sexual, violent, dark or disturbing text should be translated faithfully without adding details.
- Give only a short dictionary of genuinely difficult words or phrases, maximum 5 entries.
- If there are no difficult terms, return an empty dictionary.

Return ONLY valid JSON:
{
  "translation": "natural Hinglish translation",
  "dictionary": [
    {
      "term": "English word or phrase",
      "meaning": "simple Hinglish meaning"
    }
  ]
}
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing in Vercel Environment Variables."
      });
    }

    const client = new OpenAI({
      apiKey: apiKey
    });

    const { text } = req.body || {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Text is required."
      });
    }

    if (text.length > 12000) {
      return res.status(400).json({
        error: "Text is too long. Please translate a shorter passage."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      instructions: SYSTEM_PROMPT,
      input: text.trim(),
      text: {
        format: {
          type: "json_object"
        }
      }
    });

    const raw = response.output_text;

    if (!raw) {
      throw new Error("Empty response from OpenAI.");
    }

    const data = JSON.parse(raw);

    return res.status(200).json({
      translation: data.translation || "",
      dictionary: Array.isArray(data.dictionary)
        ? data.dictionary.slice(0, 5)
        : []
    });

  } catch (error) {
    console.error("Translation API Error:", error);

    return res.status(500).json({
      error: error?.message || "Translation failed."
    });
  }
}
