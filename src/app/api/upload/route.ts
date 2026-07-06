import { NextResponse } from 'next/server';
import supabaseAdmin, { STORAGE_BUCKET } from '@/lib/supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_FILE_SIZE_BYTES  = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in the request.' },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${file.type}. Allowed: jpg, png, webp, gif, mp4, webm, mov.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File exceeds the 20 MB size limit (${(file.size / 1024 / 1024).toFixed(1)} MB received).` },
        { status: 400 }
      );
    }

    // Build a safe, timestamped storage path
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 60);
    const folder = isImage ? 'images' : 'videos';
    const storagePath = `${folder}/${Date.now()}-${safeName}.${ext}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year — files are immutable (timestamped names)
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Storage upload failed. Please try again.' },
        { status: 500 }
      );
    }

    // Get the permanent public CDN URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      data: { url: urlData.publicUrl, type: isImage ? 'image' : 'video' },
      error: null,
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing file upload.' },
      { status: 500 }
    );
  }
}
