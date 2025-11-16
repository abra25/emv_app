  import { Injectable } from '@angular/core';
  import { Vacation } from '../model/Vacation';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class VacationService {
    private baseUrl='https://emvbackend-production.up.railway.app/evs/vacations';

    vacation: Vacation[] = [];

    constructor(private http:HttpClient) { }

    getAllVacations(): Observable<Vacation[]>{
      return this.http.get<Vacation[]>(this.baseUrl);
    }

    getVacationById(vcnId: number): Observable<Vacation> {
      return this.http.get<Vacation>(`${this.baseUrl}/${vcnId}`);
    }

    getVacationsByUserId(userId: number): Observable<Vacation[]> {
    return this.http.get<Vacation[]>(`${this.baseUrl}/user/${userId}`);
  }

    
    newVacation(vacation:Vacation):Observable<Vacation>{
      return this.http.post<Vacation>(`${this.baseUrl}`,vacation)
    }

    updateVacation(vcnId: number, Vacation: Vacation): Observable<Vacation> {
      return this.http.put<Vacation>(`${this.baseUrl}/${vcnId}`, Vacation);
    }

    getPendingVacations(): Observable<Vacation[]> {
      return this.http.get<Vacation[]>(`${this.baseUrl}/pending`);
    }

    updateVacationStatus(vcnId: number, status: 'approved' | 'rejected') {
  return this.http.put(`${this.baseUrl}/${vcnId}/status`, null, {
    params: { status }
  });
}

    
    deleteVacation(vcnId: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/${vcnId}`);
    }
  }
