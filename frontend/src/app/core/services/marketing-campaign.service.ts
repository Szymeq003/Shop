import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarketingCampaign {
    id?: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class MarketingCampaignService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/admin/marketing-campaigns';

  getAll(): Observable<MarketingCampaign[]> {
    return this.http.get<MarketingCampaign[]>(this.API);
  }

  create(campaign: MarketingCampaign): Observable<MarketingCampaign> {
    return this.http.post<MarketingCampaign>(this.API, campaign);
  }

  update(id: number, campaign: MarketingCampaign): Observable<MarketingCampaign> {
    return this.http.put<MarketingCampaign>(`${this.API}/${id}`, campaign);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
