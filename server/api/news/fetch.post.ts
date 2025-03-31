import { createClient } from '@supabase/supabase-js'

// Typ för runtime config
interface RuntimeConfig {
  public: {
    supabaseUrl: string
    supabaseKey: string
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig() as unknown as RuntimeConfig

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  const apiKey = process.env.NEWS_API_KEY
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`)

  const result = await response.json()

  if (result.status !== 'ok') {
    throw createError({ statusCode: 500, message: 'Failed to fetch news' })
  }

  // Extrahera bara de fält vi vill lagra
  const articlesToInsert = result.articles.map((article: any) => ({
    source_id: article.source?.id ?? null,
    source_name: article.source?.name ?? null,
    author: article.author ?? null,
    title: article.title ?? null,
    description: article.description ?? null,
    url: article.url ?? null,
    url_to_image: article.urlToImage ?? null,
    published_at: article.publishedAt ?? null,
    content: article.content ?? null
  }))

  // Spara i Supabase
  const { data, error } = await supabase
    .from('news_articles')
    .insert(articlesToInsert) as { data: any[] | null, error: any }

  if (error) {
    console.error(error)
    throw createError({ statusCode: 500, message: 'Failed to insert into database' })
  }

  return { success: true, inserted: data ? data.length : 0 }

})
