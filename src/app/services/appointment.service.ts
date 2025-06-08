import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Appointment {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private API_URL = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.API_URL}/appointments`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get a single appointment
  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.API_URL}/appointments/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new appointment
  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${this.API_URL}/appointments`,
      appointment,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Update an appointment
  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.API_URL}/appointments/${id}`,
      appointment,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an appointment
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/appointments/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check if the backend server is running.';
    } else if (error.status === 404) {
      errorMessage = 'API endpoint not found. Please check the API URL configuration.';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 