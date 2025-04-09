// server/api/search/fetch.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = body.query

    const [soRes, hnRes, devRes] = await Promise.all([
      fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&q=${encodeURIComponent(query)}&site=stackoverflow`),
      fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`),
      fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(query)}`)
    ])

    const [soData, hnData, devData] = await Promise.all([
      soRes.json(),
      hnRes.json(),
      devRes.json()
    ])

    return {
      success: true,
      stackoverflow: (soData.items || []).map((item: any) => ({
        title: item.title,
        link: item.link,
        score: item.score,
        tags: item.tags,
        is_answered: item.is_answered,
        creation_date: new Date(item.creation_date * 1000).toISOString()
      })),
      hackernews: (hnData.hits || []).map((item: any) => ({
        title: item.title,
        link: item.url,
        points: item.points,
        author: item.author,
        created_at: item.created_at
      })),
      devto: (devData || []).map((item: any) => ({
        title: item.title,
        description: item.description,
        url: item.url,
        published_at: item.published_at,
        reactions: item.positive_reactions_count,
        author: item.user?.name ?? 'Okänd'
      }))
    }
  } catch (error) {
    console.error('[Unified Fetch Error]', error)
    return {
      success: false,
      message: 'Kunde inte hämta sökresultat.'
    }
  }
})
