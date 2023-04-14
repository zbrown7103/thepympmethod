const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ythsyfvsbxedhfzeczsr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHN5ZnZzYnhlZGhmemVjenNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1MDEwNjYsImV4cCI6MTk5NzA3NzA2Nn0.l49PRyS8Xuvp-ZJEkU33c86-sQ6QNpSSGaMmjAhWKkE';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };


//poop