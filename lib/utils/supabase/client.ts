import {createBrowserClient} from '@supabase/ssr'
import {Database} from "@/lib/utils/supabase/supabase";
import { env } from '@/lib/config/env';

export function createSupabaseClientForBrowser() {
    return createBrowserClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
}
