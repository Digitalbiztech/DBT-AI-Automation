import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const BUCKET_NAME = 'dbtdigi';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Uploads a file to the storage bucket and returns its public URL
 * @param file The file to upload
 * @param path Optional subdirectory path (default: 'uploads')
 * @returns Promise with the public URL of the uploaded file
 */
export const uploadFileToStorage = async (file: File, path = 'uploads'): Promise<string> => {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    if (!uploadData) {
      throw new Error('No data returned from upload');
    }

    // Construct the public URL directly
    // Supabase Storage uses this format for public URLs
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
    
    console.log('Upload successful. File path:', fileName);
    console.log('Public URL:', publicUrl);
    
    // Return the direct public URL
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
