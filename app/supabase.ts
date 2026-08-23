import { createClient } from '@supabase/supabase-js';

// URL & Key dari Supabase Project aplikasi-tk-aisyiyah Anda
const supabaseUrl = 'https://tncvbyhgsjtoswlyxcrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuY3ZieWhnc2p0b3N3bHl4Y3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDYzNTksImV4cCI6MjEwMjk4MjM1OX0.dGB1aLEf5PxQ_seFdKz-UNAd5wZo-I3Xhx7eVTraG6E'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);