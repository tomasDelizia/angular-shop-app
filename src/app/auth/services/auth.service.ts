import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/auth.interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking';
    }
    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  isAuthenticated = computed<boolean>(
    () => this.authStatus() == 'authenticated'
  );

  isNotAuthenticated = computed<boolean>(
    () => this.authStatus() == 'not-authenticated'
  );

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        // Define side effects
        map((resp) => this.handleAuthSuccess(resp)),
        // Handle errors
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);
    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
