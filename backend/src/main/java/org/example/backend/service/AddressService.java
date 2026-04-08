package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.address.AddressRequest;
import org.example.backend.dto.address.AddressResponse;
import org.example.backend.entity.Address;
import org.example.backend.entity.User;
import org.example.backend.repository.AddressRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getAddresses(String email) {
        User user = findUser(email);
        return addressRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = findUser(email);
        Address address = Address.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .street(request.getStreet())
                .apartmentNumber(request.getApartmentNumber())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .phone(request.getPhone())
                .build();
        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(String email, Long id, AddressRequest request) {
        User user = findUser(email);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Adres nie znaleziony"));

        address.setFirstName(request.getFirstName());
        address.setLastName(request.getLastName());
        address.setStreet(request.getStreet());
        address.setApartmentNumber(request.getApartmentNumber());
        address.setCity(request.getCity());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setPhone(request.getPhone());

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        User user = findUser(email);
        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Adres nie znaleziony"));
        addressRepository.delete(address);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
    }

    private AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getFirstName(),
                address.getLastName(),
                address.getStreet(),
                address.getApartmentNumber(),
                address.getCity(),
                address.getPostalCode(),
                address.getCountry(),
                address.getPhone()
        );
    }
}
