import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// GraphQL queries and mutations
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        fullName
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      fullName
      username
      createdAt
      updatedAt
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      fullName
      username
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private apollo: Apollo) {
    // Check if token exists in localStorage and set current user
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    // Check if we're in a browser environment where localStorage is available
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.fetchCurrentUser().subscribe();
      }
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        input: { username, password }
      }
    }).pipe(
      map((result: any) => result.data.login),
      tap(response => {
        // Store token in localStorage if available (browser environment)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.access_token);
        }
        // Update current user
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.message || 'Login failed'));
      })
    );
  }

  register(fullName: string, username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: { fullName, username, password }
      }
    }).pipe(
      map((result: any) => result.data.createUser),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.message || 'Registration failed'));
      })
    );
  }

  fetchCurrentUser(): Observable<any> {
    return this.apollo.query({
      query: ME_QUERY,
      fetchPolicy: 'network-only' // Don't use cache for this query
    }).pipe(
      map((result: any) => result.data.me),
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        // If there's an error, clear token and user
        this.logout();
        return throwError(() => new Error('Session expired or invalid'));
      })
    );
  }

  logout(): void {
    // Remove token from localStorage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    // Clear current user
    this.currentUserSubject.next(null);
    // Clear Apollo cache
    this.apollo.client.resetStore();
  }

  isLoggedIn(): boolean {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  getToken(): string | null {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}