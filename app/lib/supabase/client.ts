// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nuusbxqeqbigxogbdmzw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dXNieHFlcWJpZ3hvZ2JkbXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDUwMTAsImV4cCI6MjA2NTg4MTAxMH0.TdxOIcc0CI6JSnUwqrHYp0xZ7mZjZqDACkoyD5QNyZk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);