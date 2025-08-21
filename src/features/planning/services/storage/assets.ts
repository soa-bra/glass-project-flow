// src/features/planning/services/storage/assets.ts
export const uploadAsset = async (file: File)=> {
  // اربط لاحقًا بـ Supabase Storage
  const url = URL.createObjectURL(file);
  return { id: crypto.randomUUID(), url };
};
