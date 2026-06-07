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

  console.log("[Supabase Upload] Начинаю загрузку файла:", {
    fileName,
    fileSize: file.size,
    fileType: file.type,
    filePath,
    bucket: supabaseStorageBucket,
  });

  const { data, error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("[Supabase Upload] Ошибка при загрузке:", error);
    const errorMessage = `Upload ошибка: ${error.message || error.statusCode || JSON.stringify(error)}`;
    throw new Error(errorMessage);
  }

  if (!data) {
    console.error("[Supabase Upload] Нет данных в ответе от сервера");
    throw new Error("Не удалось загрузить изображение товара (нет данных)");
  }

  console.log("[Supabase Upload] Файл успешно загружен:", data);

  const publicUrlResponse = await supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(filePath);

  if (!publicUrlResponse?.data?.publicUrl) {
    console.error(
      "[Supabase Upload] Не удалось получить публичный URL:",
      publicUrlResponse,
    );
    throw new Error(
      "Не удалось получить публичный URL загруженного изображения",
    );
  }

  console.log(
    "[Supabase Upload] Публичный URL получен:",
    publicUrlResponse.data.publicUrl,
  );
  return publicUrlResponse.data.publicUrl;
};
