package com.school.sms.service;

import com.lowagie.text.DocumentException;
import com.school.sms.model.FeePayment;
import com.school.sms.model.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentGenerationService {

    private final TemplateEngine templateEngine;

    public byte[] generateFeeReceiptPdf(FeePayment payment) throws IOException, DocumentException {
        Context context = new Context();
        Student student = payment.getStudent();
        
        context.setVariable("receiptNumber", payment.getReceiptNumber() != null ? payment.getReceiptNumber() : "N/A");
        context.setVariable("paymentDate", payment.getPaymentDate() != null ? payment.getPaymentDate().toString() : "");
        context.setVariable("studentName", student.getFirstName() + " " + student.getLastName());
        context.setVariable("studentId", student.getStudentId());
        context.setVariable("className", student.getClassRoom() != null ? student.getClassRoom().getName() + " - " + student.getClassRoom().getSection() : "N/A");
        context.setVariable("month", payment.getMonth() != null ? payment.getMonth() : "Fee Payment");
        context.setVariable("paymentMode", payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "N/A");
        context.setVariable("amount", payment.getAmount());

        String htmlContent = templateEngine.process("fee-receipt", context);
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        }
    }
}
