// server/api/likes/toggle.ts
import { defineEventHandler, readBody, getCookie } from 'h3'
import { createServerClient } from '@supabase/ssr'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createServerClient(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      cookies: {
        get(name) {
          return getCookie(event, name)
        },
        set() {
          // Du kan lämna tom om du inte sätter cookies från servern
        },
        remove() {}
      }
    }
  )

  const body = await readBody(event)
  const newsId = body.newsId

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: 'Ingen användare hittades från token.' }
  }

  const userId = user.id

  console.log('➡️ Toggle like:', { userId, newsId })

  const { data: existingLike, error: likeCheckError } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('news_id', newsId)
    .maybeSingle()

  if (likeCheckError) {
    return { success: false, message: likeCheckError.message }
  }

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('news_id', newsId)

    if (deleteError) {
      return { success: false, message: deleteError.message }
    }

    return { success: true, liked: false }
  } else {
    const { error: insertError } = await supabase.from('likes').insert({
      user_id: userId,
      news_id: newsId
    })

    if (insertError) {
      return { success: false, message: insertError.message }
    }

    return { success: true, liked: true }
  }
})
