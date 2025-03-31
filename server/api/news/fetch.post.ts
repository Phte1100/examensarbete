import { createClient } from '@supabase/supabase-js'

interface RuntimeConfig {
  public: {
    supabaseUrl: string
    supabaseKey: string
  }
}

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig() as unknown as RuntimeConfig

    console.log('Supabase URL:', config.public.supabaseUrl)
    console.log('API Key:', process.env.NEWS_API_KEY)

    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )

    const apiKey = process.env.NEWS_API_KEY
    const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`)

    const result = await response.json()

    console.log('NewsAPI response:', result)

    if (result.status !== 'ok') {
      console.error('NewsAPI error:', result)
      throw new Error('Failed to fetch news from NewsAPI')
    }

    const articlesToInsert = result.articles.slice(0, 2).map((article: any) => ({
      source_id: article.source?.id ?? null,
      source_name: article.source?.name ?? null,
      author: article.author ?? null,
      title: article.title?.slice(0, 255) ?? null,
      description: article.description?.slice(0, 1000) ?? null,
      url: article.url ?? null,
      url_to_image: article.urlToImage ?? null,
      published_at: article.publishedAt ?? null,
      content: article.content?.slice(0, 5000) ?? null
    }))
  

    const { data, error } = await supabase
      .from('newsapi')
      .insert(articlesToInsert) as { data: any[] | null, error: any }

      if (error) {
        console.error('Supabase error details:', JSON.stringify(error, null, 2))
        throw new Error('Failed to insert into Supabase')
      }
      

    console.log('Inlagda artiklar:', data?.length)

    return { success: true, inserted: data ? data.length : 0 }
  } catch (err) {
    console.error('Totalt fel:', err)
    throw createError({ statusCode: 500, message: 'Serverfel i fetch.post.ts' })
  }
})
