package org.example.backend.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.backend.entity.User;

@Data
public class AdminUserCreateRequest {

    @NotBlank(message = "Imię i nazwisko jest wymagane")
    private String name;

    @Email(message = "Nieprawidłowy adres email")
    @NotBlank(message = "Email jest wymagany")
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    @Size(min = 8, message = "Hasło musi mieć co najmniej 8 znaków")
    private String password;

    @NotNull(message = "Rola jest wymagana")
    private User.Role role;
}
