import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bhebwpoxdkljyuicstie.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_secret_I674NXlST0pAOYh_Ni7vKw_Ypc6DmE-";

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload an evidence photo to Supabase Storage (if online)
 */
export async function uploadEvidencePhoto(file: File, bucket = "evidence"): Promise<string | null> {
  try {
    const filePath = `evidence_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      console.warn("Supabase photo upload warning:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn("Supabase upload exception:", err);
    return null;
  }
}
