import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly apiUrl = '/api/applications';

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  add(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateStatus(id: number, status: ApplicationStatus): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
  }

  updateNotes(id: number, notes: string): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
