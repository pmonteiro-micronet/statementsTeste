import { jsPDF } from 'jspdf'; // Importando a biblioteca jsPDF

export const generatePDFTemplate = (reserva, signatureBase64) => {
    console.log(reserva.propertyID);
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Título da seção Stay Details
    doc.setFont('helvetica', 'bold'); // Define fonte em negrito
    doc.text('Guest Details', 10, 10);
    doc.setFont('helvetica', 'normal'); // Define fonte normal
    doc.line(10, 15, 200, 15); // Linha separadora

    // Retângulo com detalhes da reserva (apenas borda)
    const guestRectX = 10; // Posição X do retângulo
    const guestRectY = 17; // Posição Y do retângulo
    const guestRectWidth = 190; // Largura do retângulo
    const guestRectHeight = 60; // Altura do retângulo

    // Desenhar retângulo sem preenchimento
    doc.setDrawColor(0); // Cor da borda (preto)
    doc.rect(guestRectX, guestRectY, guestRectWidth, guestRectHeight, 'S'); // Apenas borda

    // Divisão em duas colunas
    const guestColumn1X = guestRectX + 5; // Margem esquerda da coluna 1
    const guestColumn2X = guestRectX + guestRectWidth / 2 + 5; // Metade do retângulo + margem esquerda da coluna 2
    const guestTextY = guestRectY + 8; // Posição Y do texto dentro do retângulo

    // Adicionando texto em duas colunas
    doc.setTextColor(0); // Cor do texto (preto)
    doc.text(`Name ${reserva.LastName}, ${reserva.FirstName}`, guestColumn1X, guestTextY, { maxWidth: guestRectWidth - 10 });
    doc.text(`Address ${reserva.Street}`, guestColumn1X, guestTextY + 8, { maxWidth: guestRectWidth - 10 });


    doc.text(`Country ${reserva.Country}`, guestColumn1X, guestTextY + 16);
    doc.text(`ID Type Doc ${reserva.IdDoc}`, guestColumn2X, guestTextY + 16);

    doc.text(`Email ${reserva.PersonalEmail}`, guestColumn1X, guestTextY + 24);
    doc.text(`Doc No. ${reserva.NrDoc}`, guestColumn2X, guestTextY + 24);

    doc.text(`Phone ${reserva.Phone}`, guestColumn1X, guestTextY + 32);
    doc.text(`Exp. Date ${reserva.ExpDate}`, guestColumn2X, guestTextY + 32);

    doc.text(`Birth Date ${reserva.DateOfBirth}`, guestColumn1X, guestTextY + 40);
    doc.text(`Country Issue ${reserva.Issue}`, guestColumn2X, guestTextY + 40);

    doc.text(`Birthplace ${reserva.CountryOfBirth}`, guestColumn1X, guestTextY + 48);
    doc.text(`VAT No. ${reserva.VatNo}`, guestColumn2X, guestTextY + 48);

    // Título da seção Stay Details
    doc.setFont('helvetica', 'bold'); // Define fonte em negrito
    doc.text('Stay Details', 10, 85);
    doc.setFont('helvetica', 'normal'); // Define fonte normal
    doc.line(10, 90, 200, 90); // Linha separadora

    // Retângulo com detalhes da reserva (apenas borda)
    const stayguestRectX = 10; // Posição X do retângulo
    const stayguestRectY = 92; // Posição Y do retângulo
    const stayguestRectWidth = 190; // Largura do retângulo
    const stayguestRectHeight = 40; // Altura do retângulo

    // Desenhar retângulo sem preenchimento
    doc.setDrawColor(0); // Cor da borda (preto)
    doc.rect(stayguestRectX, stayguestRectY, stayguestRectWidth, stayguestRectHeight, 'S'); // Apenas borda

    // Divisão em duas colunas
    const stayColumn1X = stayguestRectX + 5; // Margem esquerda da coluna 1
    const stayColumn2X = stayguestRectX + stayguestRectWidth / 2 + 5; // Metade do retângulo + margem esquerda da coluna 2
    const stayTextY = stayguestRectY + 8; // Posição Y do texto dentro do retângulo

    // Adicionando texto em duas colunas
    doc.setTextColor(0); // Cor do texto (preto)
    doc.text(`Reservation Number ${reserva.ResNo}`, stayColumn1X, stayTextY);
    doc.text(`Room ${reserva.Room}`, stayColumn2X, stayTextY);

    doc.text(`Arrival Date ${reserva.DateCI}`, stayColumn1X, stayTextY + 8);
    doc.text(`Departure Date ${reserva.DateCO}`, stayColumn2X, stayTextY + 8);

    doc.text(`Nr.Pax/Ch. ${reserva.Adults} / ${reserva.Childs}`, stayColumn1X, stayTextY + 16);
    doc.text(`Price Table ${reserva.Price}`, stayColumn2X, stayTextY + 16);

    // Adicionando o campo Notes (abrange as duas colunas)
    doc.text(`Notes ${reserva.Notes}`, stayColumn1X, stayTextY + 24, { maxWidth: stayguestRectWidth - 10 }); // maxWidth limita o texto ao tamanho do retângulo

    // Adiciona a assinatura
    doc.text('Signature:', 10, 140);
    if (signatureBase64) {
        doc.addImage(signatureBase64, 'PNG', 10, 160, 180, 40); // Adiciona a assinatura no PDF
    }

    return doc; // Retorna o documento PDF gerado
};
