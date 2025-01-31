import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");
        const hotelId = data.get("hotelId");
        const existingImage = data.get("existingImage"); // URL da imagem antiga no Cloudinary

        if (!file || !hotelId) {
            return NextResponse.json(
                { error: "File or hotelId is missing" },
                { status: 400 }
            );
        }

        // Converte a imagem para base64
        const fileBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(fileBuffer).toString("base64");
        const dataUri = `data:${file.type};base64,${base64Image}`;

        // Se já existe uma imagem, tenta excluí-la antes de fazer o upload da nova
        if (existingImage && existingImage.includes("res.cloudinary.com")) {
            // Extrai o public_id do Cloudinary a partir da URL
            const publicId = existingImage.split('/').pop().split('.')[0]; // Obtém o ID sem a extensão
            await cloudinary.uploader.destroy(`hotels/${publicId}`);
        }

        // Faz o upload para Cloudinary, usando o hotelId como nome do arquivo
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: "hotels",
            public_id: hotelId, // Define o nome do arquivo como hotelId
            overwrite: true, // Garante que a imagem seja substituída
        });

        return NextResponse.json({
            message: "Upload successful",
            imageUrl: uploadResponse.secure_url, // Nova URL da imagem no Cloudinary
        }, { status: 200 });

    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
