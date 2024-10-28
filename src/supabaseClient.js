import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kznikrvxhlfpoemwxwiu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6bmlrcnZ4aGxmcG9lbXd4d2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NzEzNjUsImV4cCI6MjA0NDM0NzM2NX0.0mEKQ3AEaIdYwGnslvWMe4qKTyp8651ZN_H7lfEvGWQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
