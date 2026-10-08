# Novel Translations

A small Vercel-ready web app for translating novel passages into natural Indian Hinglish with a short dictionary.

## Deploy
1. Put this project in a GitHub repository.
2. Import the repository into Vercel.
3. In Vercel → Project Settings → Environment Variables, add:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key
4. Redeploy.

The key is never placed in browser JavaScript.

## Local
Install Vercel CLI, then run `vercel dev`.
