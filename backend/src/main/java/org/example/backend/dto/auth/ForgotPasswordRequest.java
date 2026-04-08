package org.example.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @Email(message = "Nieprawidłowy adres email")
    @NotBlank(message = "Email jest wymagany")
    private String email;
}
