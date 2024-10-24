import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log("Request method:", req.method);

  if (req.method === "POST") {
    let newRequest; // Definido para capturar o novo registro
    try {
      console.log("POST Request received:", req.body);

      // Desestruture os dados da requisição
      const {
        PropertyID,
        Reservation,
        GuestInfo,
        Items,
        Taxes,
        DocumentTotals,
      } = req.body;

      // Para simplificação, vamos armazenar o primeiro item de cada array.
      const reservation =
        Reservation && Reservation.length > 0 ? Reservation[0] : null;
      const guestInfo = GuestInfo && GuestInfo.length > 0 ? GuestInfo[0] : null;

      // Criar o objeto que vamos salvar
      newRequest = await prisma.requestRecords.create({
        data: {
          requestBody: JSON.stringify(req.body), // Armazena o corpo completo como JSON
          requestType: req.method, // Ajuste conforme necessário
          requestDateTime: new Date(), // Armazena a data e hora atual
          responseStatus: "201", // Supondo sucesso inicialmente
          responseBody: "", // O corpo da resposta será atualizado depois
          propertyID: req.body.propertyID, // Assumindo que PropertyID é um número
          seen: false,
        },
      });

      console.log("Data saved to DB:", newRequest);
      console.log("Dados para conseguir compilar: ", PropertyID, Items, Taxes, DocumentTotals, reservation, guestInfo);

      // Prepare a resposta a ser enviada
      const responseBody = {
        message: "Dados armazenados com sucesso",
        data: newRequest,
      };

      // Envie a resposta ao cliente
      res.status(201).json(responseBody);

      // Atualize o campo responseBody com a resposta enviada
      await prisma.requestRecords.update({
        where: {
          id: newRequest.id, // Usando o ID gerado do novo registro
        },
        data: {
          responseBody: JSON.stringify(responseBody), // Atualiza o campo com a resposta
        },
      });

      console.log("Response body updated in DB");
    } catch (error) {
      console.error("Erro ao gravar os dados:", error.message);
      console.error("Detalhes do erro:", error);

      // Se `newRequest` foi criado, atualize com erro
      if (newRequest) {
        await prisma.requestRecords.update({
          where: {
            id: newRequest.id,
          },
          data: {
            responseStatus: "500", // Atualize o status de resposta para erro
            responseBody: JSON.stringify({
              message: "Erro ao gravar os dados",
              error: error.message,
            }),
          },
        });
        console.log("Erro salvo no DB para o request", newRequest.id);
      } else {
        // Caso não tenha conseguido criar `newRequest`, criar um novo registro de erro
        await prisma.requestRecords.create({
          data: {
            requestBody: JSON.stringify(req.body), // Armazena o corpo completo como JSON
            requestType: req.method, // Tipo de requisição
            requestDateTime: new Date(), // Data e hora atual
            responseStatus: "500", // Status de erro
            responseBody: JSON.stringify({
              message: "Erro ao gravar os dados",
              error: error.message,
            }),
            propertyID: -1, // Se houver PropertyID, armazenar, senão null
            seen: false,
          },
        });
        console.log("Erro ao criar request. Novo erro salvo no DB.");
      }

      // Retorne o erro ao cliente
      res
        .status(500)
        .json({ message: "Erro ao gravar os dados", error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const allRequests = await prisma.requestRecords.findMany();
      console.log("GET request: Retrieved all requests:", allRequests);
      res.status(200).json({ data: allRequests });
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      res.status(500).json({ message: "Erro ao buscar os dados" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}