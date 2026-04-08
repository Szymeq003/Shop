package org.example.backend.dto.address;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String street;
    private String apartmentNumber;
    private String city;
    private String postalCode;
    private String country;
    private String phone;
}
