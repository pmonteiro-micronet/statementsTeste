import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Configuração do diretório para armazenar uploads
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req) {
    try {
        // Verifica se o diretório existe, senão cria
        await fs.mkdir(uploadDir, { recursive: true });

        // Obtém os dados enviados
        const data = await req.formData();
        const file = data.get("file");
        const hotelId = data.get("hotelId");
        const existingImage = data.get("existingImage");

        if (!file || !hotelId) {
            return NextResponse.json(
                { error: "File or hotelId is missing" },
                { status: 400 }
            );
        }

        // Extrai a extensão do arquivo original
        const originalFileName = file.name;
        const fileExtension = path.extname(originalFileName).toLowerCase(); // Converte para minúsculas para comparação

        // Verifica se a extensão é .png
        if (fileExtension !== '.png') {
            return NextResponse.json(
                { error: "Only PNG files are allowed." },
                { status: 400 }
            );
        }

        // Define o novo nome do arquivo baseado no hotelId
        const newFileName = `${hotelId}${fileExtension}`;

        // Define o caminho completo do arquivo
        const filePath = path.join(uploadDir, newFileName);

        // Verifica se já existe uma imagem associada ao hotel e a exclui, se necessário
        if (existingImage && existingImage !== "undefined") {
            const existingImagePath = path.join(
                process.cwd(),
                "public",
                existingImage.startsWith("/") ? existingImage.slice(1) : existingImage
            );
            try {
                await fs.unlink(existingImagePath);
            } catch (error) {
                console.error("Error deleting existing image:", error);
            }
        }

        // Salva o arquivo no diretório especificado
        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        // Retorna o caminho relativo para o frontend
        const relativeFilePath = `/uploads/${newFileName}`;
        return NextResponse.json(
            { message: "Image uploaded successfully", imageUrl: relativeFilePath },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
