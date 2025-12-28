import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xvaydsqmfedzedjkywnr.supabase.co';
const supabaseAnonKey = 'sb_publishable_5GBA0S0VhsJcSMuuTaRmUQ_smwstsQt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);