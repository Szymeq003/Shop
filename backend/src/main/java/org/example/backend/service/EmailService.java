package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendPasswordResetEmail(String toEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset hasła — Sklep");

            String resetUrl = frontendUrl + "/auth/reset-password?token=" + token;
            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #6c63ff;">Reset hasła</h2>
                        <p>Cześć <strong>%s</strong>,</p>
                        <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
                        <p>Kliknij przycisk poniżej, aby ustawić nowe hasło:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #6c63ff; color: white; padding: 14px 28px;
                                      text-decoration: none; border-radius: 8px; font-size: 16px;">
                                Resetuj hasło
                            </a>
                        </div>
                        <p style="color: #666;">Link jest ważny przez <strong>1 godzinę</strong>.</p>
                        <p style="color: #666;">Jeśli to nie Ty wysłałeś(aś) tę prośbę, zignoruj tę wiadomość.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">Sklep &copy; 2025</p>
                    </div>
                    """.formatted(name, resetUrl);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Błąd wysyłania emaila: " + e.getMessage());
        }
    }

    @Async
    public void sendVerificationEmail(String toEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Aktywuj swoje konto — Sklep");

            String verifyUrl = frontendUrl + "/auth/verify-account?token=" + token;
            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #6c63ff;">Witaj w naszym sklepie!</h2>
                        <p>Cześć <strong>%s</strong>,</p>
                        <p>Dziękujemy za rejestrację. Aby móc się zalogować i korzystać z konta, prosimy o jego aktywację.</p>
                        <p>Kliknij przycisk poniżej, aby zweryfikować swój adres e-mail:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #6c63ff; color: white; padding: 14px 28px;
                                      text-decoration: none; border-radius: 8px; font-size: 16px;">
                                Aktywuj konto
                            </a>
                        </div>
                        <p style="color: #666;">Link jest ważny przez <strong>24 godziny</strong>.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">Sklep &copy; 2025</p>
                    </div>
                    """.formatted(name, verifyUrl);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Błąd wysyłania emaila weryfikacyjnego: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Witaj w naszym sklepie!");

            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #6c63ff;">Witaj, %s!</h2>
                        <p>Dziękujemy za zarejestrowanie się w naszym sklepie.</p>
                        <p>Od teraz możesz w pełni korzystać ze wszystkich funkcji naszego serwisu, zarządzać swoimi adresami i śledzić zamówienia.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #6c63ff; color: white; padding: 14px 28px;
                                      text-decoration: none; border-radius: 8px; font-size: 16px;">
                                Przejdź do sklepu
                            </a>
                        </div>
                        <p style="color: #666;">Jeśli masz jakiekolwiek pytania, odpowiedz na tę wiadomość.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">Sklep &copy; 2025</p>
                    </div>
                    """.formatted(name, frontendUrl);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Błąd wysyłania emaila powitalnego: " + e.getMessage());
        }
    }
}
