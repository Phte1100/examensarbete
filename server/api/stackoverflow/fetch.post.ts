import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { query } = body

    const baseUrl = 'https://api.stackexchange.com/2.3/search/advanced'
    const site = 'stackoverflow'
   

    const url = `${baseUrl}?order=desc&sort=activity&q=${encodeURIComponent(query || '')}&site=${site}`


    const response = await fetch(url)
    const result = await response.json()

    if (!result.items) {
      throw new Error('No results from Stack Overflow')
    }

    return {
      success: true,
      data: result.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        score: item.score,
        tags: item.tags,
        is_answered: item.is_answered,
        creation_date: new Date(item.creation_date * 1000).toISOString()
      }))
    }
  } catch (error) {
    console.error('[StackOverflow Fetch Error]', error)
    return {
      success: false,
      message: 'Something went wrong while fetching StackOverflow data.'
    }
  }
})
