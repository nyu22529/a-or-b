import { createClient } from '@supabase/supabase-js'

// 1단계에서 만든 비밀 메모장(.env.local)에서 URL과 KEY를 안전하게 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// supabase 클라이언트를 생성합니다.
// 이 supabase 객체가 바로 우리 백엔드와 통신하는 역할을 합니다.
export const supabase = createClient(supabaseUrl, supabaseKey)
