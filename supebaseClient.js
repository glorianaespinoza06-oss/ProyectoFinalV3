import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==========================
// CONFIGURA TU SUPABASE
// ==========================
let SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYW1yb2t6am5zY2xiaXphYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODU3MDYsImV4cCI6MjA3NjY2MTcwNn0.ebCdxQeV4qP3MK5O-ZXXUBOMz3kKidpudcJyERngV2Q";
let SUPABASE_URL = "https://cfamrokzjnsclbizablh.supabase.co";

// Crear cliente una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
