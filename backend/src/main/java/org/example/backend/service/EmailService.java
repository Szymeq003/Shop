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

    @Async
    public void sendNewsletterWelcomeEmail(String toEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Dziękujemy za zapis do newslettera! Twój kod rabatowy wewnątrz 🎉");

            String html = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #6c63ff; font-size: 28px;">Witaj w naszym Newsletterze!</h2>
                        </div>
                        <p style="font-size: 16px; color: #333;">Cześć,</p>
                        <p style="font-size: 16px; color: #333; line-height: 1.5;">Dziękujemy za dołączenie do naszej społeczności! Obiecujemy wysyłać tylko najciekawsze nowości, porady i wyjątkowe oferty promocyjne.</p>
                        
                        <div style="background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                            <p style="font-size: 16px; color: #6c63ff; margin-top: 0; font-weight: bold;">Twój prezent na start to 50 zł zniżki!</p>
                            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Wpisz poniższy kod w koszyku (widoczny po lewej stronie) podczas składania swojego pierwszego zamówienia:</p>
                            <div style="background: white; border: 2px dashed #6c63ff; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; color: #4c1d95; letter-spacing: 4px; display: inline-block;">
                                NEWS50
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #6c63ff; color: white; padding: 16px 32px;
                                      text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                                Odbierz swój rabat
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; line-height: 1.5;">Kod jest ważny do końca roku. Regulamin promocji znajdziesz na naszej stronie.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Sklep &copy; 2025</p>
                    </div>
                    """.formatted(frontendUrl);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Błąd wysyłania emaila newslettera: " + e.getMessage());
        }
    }
}
