package org.example.backend.dto.address;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
    @NotBlank(message = "Imię jest wymagane")
    private String firstName;

    @NotBlank(message = "Nazwisko jest wymagane")
    private String lastName;

    @NotBlank(message = "Ulica jest wymagana")
    private String street;

    private String apartmentNumber;

    @NotBlank(message = "Miasto jest wymagane")
    private String city;

    @NotBlank(message = "Kod pocztowy jest wymagany")
    private String postalCode;

    @NotBlank(message = "Kraj jest wymagany")
    private String country;

    @NotBlank(message = "Numer telefonu jest wymagany")
    private String phone;
}
