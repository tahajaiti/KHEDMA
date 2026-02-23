import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap, switchMap, throwError } from 'rxjs';
import { User, UserLogin, UserRegister } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/users';
  private readonly storageKey = 'khedma_user';

  private currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  private storeUser(user: User): void {
    const { password, ...safeUser } = user as User & { password?: string };
    localStorage.setItem(this.storageKey, JSON.stringify(safeUser));
    this.currentUserSignal.set(safeUser);
  }

  login(credentials: UserLogin): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${credentials.email}`)
      .pipe(
        map(users => {
          const user = users.find(u => u.password === credentials.password);
          if (!user) throw new Error('Invalid email or password');
          return user;
        }),
        tap(user => this.storeUser(user))
      );
  }

  register(data: UserRegister): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${data.email}`)
      .pipe(
        switchMap(existing => {
          if (existing.length > 0) {
            return throwError(() => new Error('Email already exists'));
          }
          return this.http.post<User>(this.apiUrl, data);
        }),
        tap(user => this.storeUser(user))
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    const current = this.currentUserSignal();
    if (!current?.id) throw new Error('Not authenticated');

    return this.http.patch<User>(`${this.apiUrl}/${current.id}`, user).pipe(
      tap(updated => this.storeUser(updated))
    );
  }

  deleteAccount(): Observable<void> {
    const current = this.currentUserSignal();
    if (!current?.id) throw new Error('Not authenticated');

    return this.http.delete<void>(`${this.apiUrl}/${current.id}`).pipe(
      tap(() => {
        localStorage.removeItem(this.storageKey);
        this.currentUserSignal.set(null);
        this.router.navigate(['/']);
      })
    );
  }
}
