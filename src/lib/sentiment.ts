import { LanguageServiceClient } from '@google-cloud/language'

const client = new LanguageServiceClient()

export async function analyzeSentiment(text: string) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT' as const
  }

  const [result] = await client.analyzeSentiment({ document })
  const sentiment = result.documentSentiment

  const [syntaxResult] = await client.analyzeSyntax({ document })
  const keywords = syntaxResult.tokens
    ?.filter(token => ['NOUN', 'ADJ'].includes(token.partOfSpeech?.tag || ''))
    .map(token => token.text?.content || '')
    .filter(Boolean) || []

  const [entityResult] = await client.analyzeEntities({ document })
  const topics = entityResult.entities
    ?.filter(entity => entity.type === 'OTHER')
    .map(entity => entity.name || '')
    .filter(Boolean) || []

  return {
    score: sentiment?.score || 0,
    magnitude: sentiment?.magnitude || 0,
    topics,
    keywords
  }
}