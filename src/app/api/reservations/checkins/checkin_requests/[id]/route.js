import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(req, { params }) {
  try {
    const requestID = parseInt(params.id, 10);

    if (isNaN(requestID)) {
      return NextResponse.json(
        { message: "Parâmetro 'requestID' inválido. Deve ser um número." },
        { status: 400 }
      );
    }

    const existing = await prisma.registrationRecords.findUnique({
      where: { requestID },
    });

    if (!existing) {
      return NextResponse.json(
        { message: `Registro com requestID '${requestID}' não encontrado.` },
        { status: 404 }
      );
    }

    await prisma.registrationRecords.delete({
      where: { requestID },
    });

    return NextResponse.json(
      { message: `Registro com requestID '${requestID}' removido com sucesso.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar registro', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
