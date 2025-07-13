import {createServerClient} from '@supabase/ssr'
import {cookies} from 'next/headers'
import {Database} from "@/lib/utils/supabase/supabase";
import { env } from '@/lib/config/env';

export async function createSupabaseClientForServer() {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
