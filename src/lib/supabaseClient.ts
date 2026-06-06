import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  (typeof import.meta !== "undefined"
    ? (import.meta.env as any).VITE_SUPABASE_URL
    : "");
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  (typeof import.meta !== "undefined"
    ? (import.meta.env as any).VITE_SUPABASE_ANON_KEY
    : "");
const supabaseStorageBucket =
  process.env.REACT_APP_SUPABASE_STORAGE_BUCKET ||
  process.env.VITE_SUPABASE_STORAGE_BUCKET ||
  "public";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadProductImage = async (file: File) => {
  const fileExtension = file.name.split(".").pop() || "png";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${fileExtension}`;
  const filePath = `product-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error || !data) {
    throw error || new Error("Не удалось загрузить изображение товара");
  }

  const publicUrlResponse = await supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(filePath);

  if (!publicUrlResponse?.data?.publicUrl) {
    throw new Error(
      "Не удалось получить публичный URL загруженного изображения",
    );
  }

  return publicUrlResponse.data.publicUrl;
};
