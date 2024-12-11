import { jsPDF } from 'jspdf'; // Importando a biblioteca jsPDF

export const generatePDFTemplate = (reserva, signatureBase64) => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.text('Stay Details', 10, 10);
    doc.line(10, 15, 200, 15); // x1, y1, x2, y2

    // Adiciona os detalhes da reserva no PDF
    doc.text(`Reservation Number: ${reserva.ResNo}`, 10, 30); 
    doc.text(`Room: ${reserva.Room}`, 10, 40);     
    doc.text(`Arrival Date: ${reserva.DateCI}`, 10, 50);   
    doc.text(`Departure Date: ${reserva.DateCO}`, 10, 60);  
    doc.text(`Email: ${reserva.Email}`, 10, 70);  
    doc.text(`Pax./Ch.: ${reserva.Adults} / ${reserva.Childs}`, 10, 80); 

    doc.text('Guest Details', 10, 90);
    doc.line(10, 95, 200, 95); // x1, y1, x2, y2

    doc.text(`Name: ${reserva.LastName}, ${reserva.FirstName}`, 10, 110); 
    doc.text(`Name: ${reserva.Address}`, 10, 120); 
    // Adiciona a assinatura
    doc.text('Signature:', 10, 130);
    if (signatureBase64) {
        doc.addImage(signatureBase64, 'PNG', 10, 140, 180, 40); // Adiciona a assinatura no PDF
    }

    return doc; // Retorna o documento PDF gerado
};

