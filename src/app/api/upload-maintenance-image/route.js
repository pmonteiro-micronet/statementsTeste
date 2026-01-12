// import { v2 as cloudinary } from "cloudinary";
// import { NextResponse } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//     try {
//         const data = await req.formData();
//         const file = data.get("file");

//         const propertyID = data.get("propertyID");
//         const room = data.get("room");
//         const reasonID = data.get("reasonID");

//         const existingImage = data.get("existingImage");

//         if (!file || !propertyID || !room || !reasonID) {
//             return NextResponse.json(
//                 { error: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         // Gera public_id baseado nos 3 valores
//         const publicId = `${propertyID}-${room}-${reasonID}`;

//         // Converte imagem
//         const fileBuffer = await file.arrayBuffer();
//         const base64Image = Buffer.from(fileBuffer).toString("base64");
//         const dataUri = `data:${file.type};base64,${base64Image}`;

//         // Se existir imagem, apaga
//         if (existingImage && existingImage.includes("res.cloudinary.com")) {
//             const oldPublicId = existingImage.split('/').pop().split('.')[0];
//             await cloudinary.uploader.destroy(`maintenance_photos/${oldPublicId}`);
//         }

//         // Upload
//         const uploadResponse = await cloudinary.uploader.upload(dataUri, {
//             folder: "maintenance_photos",
//             public_id: publicId,
//             overwrite: true,
//         });

//         return NextResponse.json({
//             message: "Upload successful",
//             imageUrl: uploadResponse.secure_url,
//         });

//     } catch (error) {
//         console.error("Error uploading image:", error);
//         return NextResponse.json(
//             { error: "Failed to upload image" },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref"); // pega o ref da query ?ref=123

    if (!ref) {
      return NextResponse.json({ error: "Ref é obrigatório" }, { status: 400 });
    }

    // buscar no Prisma
    const photo = await prisma.maintenancePhoto.findUnique({
      where: { ref: parseInt(ref, 10) },
    });

    if (!photo) {
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
    }

    // retorna o Base64
    return NextResponse.json({
      ref: photo.ref,
      image: photo.image,
    });

  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData(); // ✅ pegar formData
    const file = data.get("file");
    const propertyID = data.get("propertyID");


    if (!file) {
      return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
    }

    // converter arquivo para Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;
    const propertyIDInt = parseInt(propertyID, 10);
    // salvar no Prisma
    const newPhoto = await prisma.maintenancePhoto.create({
      data: { 
        image: dataUri,
      propertyID: propertyIDInt
    },
    });

    // retornar o ref gerado
    return NextResponse.json({
      message: "Imagem inserida com sucesso",
      ref: newPhoto.ref,
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao inserir imagem:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}