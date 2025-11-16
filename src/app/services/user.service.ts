import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl='https://emvbackend-production.up.railway.app/evs/users';
  users: User[] = [];

  constructor(private http:HttpClient) { }

  login(username: string, password: string): Observable<User> {
    const loginData = { username, password };
    return this.http.post<User>(`${this.baseUrl}`, loginData);
  }

  
  registerUser(user: User): Observable<User> {
  return this.http.post<User>(`${this.baseUrl}/register`, user).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 409) {
        return throwError(() => new Error("Email or username already exists."));
      }
      return throwError(() => new Error("An unexpected error occurred."));
    })
  );
}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
