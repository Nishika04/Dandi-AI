import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://swozrgcvphshvlobbohc.supabase.co'; // TODO: Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3b3pyZ2N2cGhzaHZsb2Jib2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjYxNzksImV4cCI6MjA2NzgwMjE3OX0.BYPos51hJboZNmRtwknLNYWQzvj_nmfuo5a2yUIjk9M'; // TODO: Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey);
