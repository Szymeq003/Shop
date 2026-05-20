package org.example.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.backend.entity.User;

@Data
public class RoleUpdateRequest {
    @NotNull(message = "Rola jest wymagana")
    private User.Role role;
}
