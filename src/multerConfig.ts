// multerConfig.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Cria uma pasta 'uploads' se ainda não existir
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configura o multer para salvar os arquivos nessa pasta
export const upload = multer({
  dest: uploadDir, // pasta onde os arquivos serão temporariamente salvos
});
