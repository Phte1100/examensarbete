// server/api/news/list2.ts
import { createClient } from '@supabase/supabase-js'

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

  const { data, error } = await supabase
    .from('nytimes')
    .select('*')
    .order('published_date', { ascending: false })

  //ändra published_date till _at?

  if (error) {
    console.error('Fel vid hämtning från Supabase:', error)
    throw createError({ statusCode: 500, message: 'Kunde inte hämta artiklar' })
  }

  return { data }
})
