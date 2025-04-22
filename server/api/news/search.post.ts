import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)
  const query = body.query

  const { data, error } = await client
    .from('newsapi')
    .select('*')
    .ilike('title', `%${query}%`) 

  if (error) {
    console.error('DB search error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data }
})
