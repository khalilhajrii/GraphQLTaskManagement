import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Token key constant to avoid direct dependency on AuthService
const TOKEN_KEY = 'auth_token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if we're in a browser environment where localStorage is available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Get the auth token directly from localStorage to avoid circular dependency
      const token = localStorage.getItem(TOKEN_KEY);

      // Clone the request and add the authorization header if token exists
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // If we get a 401 Unauthorized response, clear token and redirect to login
        if (error.status === 401 && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          // Clear token directly instead of using AuthService to avoid circular dependency
          localStorage.removeItem(TOKEN_KEY);
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}