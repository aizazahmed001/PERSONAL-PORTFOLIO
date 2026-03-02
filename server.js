import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'
import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const require = createRequire(import.meta.url)
const trainingData = require('./chatbot_training_data.json')

const app = express()
app.use(cors())
app.use(express.json())

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ── Smart search: find top N relevant Q&A pairs for a given query ──
function findRelevantPairs(query, topN = 6) {
  const queryWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1)

  const scored = trainingData.training_data.map(item => {
    const text = (item.question + ' ' + item.answer).toLowerCase()
    let score = 0
    for (const word of queryWords) {
      if (text.includes(word)) score++
      if (item.question.toLowerCase().includes(word)) score += 2
    }
    return { item, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => `Q: ${s.item.question}\nA: ${s.item.answer}`)
    .join('\n\n')
}

const BASE_SYSTEM = `You are a friendly AI assistant embedded in Aizaz Ahmed's personal portfolio website.

STRICT RULES:
1. Only answer using the RELEVANT KNOWLEDGE provided below.
2. Match the user's tone — casual reply casual, formal reply formal, Urdu/English mix reply same way.
3. Keep answers short and conversational.
4. If not covered in the knowledge, say: "I don't have that info, but you can reach Aizaz at aizazahmed098@gmail.com or WhatsApp +923008925097"
5. Never make up information not in the knowledge.
6. If someone greets you (hi, hello, salam, aoa), greet back warmly and ask how you can help.
7. Handle typos and informal language — always try to understand the intent.`

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  // Strip any frontend-only fields like "streaming" before sending to Groq
  const cleanHistory = history.map(({ role, content }) => ({ role, content }))

  // Build dynamic system prompt with only relevant pairs
  const relevantKnowledge = findRelevantPairs(message)
  const systemPrompt = relevantKnowledge
    ? `${BASE_SYSTEM}\n\nRELEVANT KNOWLEDGE:\n${relevantKnowledge}`
    : `${BASE_SYSTEM}\n\nNo specific knowledge found — use general portfolio info or direct to contact.`

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanHistory.slice(-6),
        { role: 'user', content: message.trim() },
      ],
    })

    return res.status(200).json({ reply: response.choices[0].message.content })
  } catch (error) {
    console.error('Groq API error:', error?.message || error)
    return res.status(500).json({
      reply: 'Something went wrong. Please contact Aizaz at aizazahmed098@gmail.com',
    })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ Chatbot server running at http://localhost:${PORT}`)
})