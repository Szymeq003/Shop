import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type AddressRequest = Omit<Address, 'id'>;

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly API = 'http://localhost:8080/api/user/addresses';

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.API);
  }

  addAddress(data: AddressRequest): Observable<Address> {
    return this.http.post<Address>(this.API, data);
  }

  updateAddress(id: number, data: AddressRequest): Observable<Address> {
    return this.http.put<Address>(`${this.API}/${id}`, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
