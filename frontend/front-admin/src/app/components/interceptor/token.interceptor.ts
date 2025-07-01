import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "src/environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
   private apiBaseUrl = environment.apiUrl;
    ignoredRoutes = [
        '/authentication',];
  
   constructor(
      private authService: AuthService,
      private router: Router,
      private toastr: ToastrService
    ) {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const shouldIgnore = this.isIgnoredRoute(request.url);
      const authRequest = shouldIgnore ? request : this.addToken(request);
      
      return next.handle(authRequest).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            this.logResponse(request, event);
          }
        }),
        catchError(error => this.handleError(error))
      );
    }
  
    private addToken(request: HttpRequest<any>): HttpRequest<any> {
      const token = this.authService.getToken();
      if (!token) return request;

      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'  // Security header
        }
      });
    }
  
    private handleError(error: HttpErrorResponse): Observable<never> {
      console.error('HTTP Error:', error);
      
      // Network or CORS errors
      if (error.status === 0) {
        this.toastr.error('Network error - please check your connection');
        return throwError(() => new Error('Network error'));
      }

      // Authentication errors
      if (error.status === 401 || error.status === 403) {
        this.handleAuthError();
        return throwError(() => new Error('Authentication required'));
      }

      // Server errors
      if (error.status === 500) {
        this.toastr.error('Server error - please try again later');
        return throwError(() => new Error('Server error'));
      }

      // Not found errors
      if (error.status === 404) {
        this.router.navigate(['/page404']);
        return throwError(() => new Error('Resource not found'));
      }

      // Handle other errors
      this.showErrorMessage(error);
      return throwError(() => error);
    }

    private handleAuthError(): void {
      this.toastr.warning('Session expired - please login again');
      this.authService.logout();
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    }

    private showErrorMessage(error: HttpErrorResponse): void {
      if (error.error instanceof Blob) {
        this.parseBlobError(error.error);
      } else {
        const message = this.extractErrorMessage(error);
        this.toastr.error(message);
      }
    }

    private parseBlobError(blob: Blob): void {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const error = JSON.parse(reader.result as string);
          this.toastr.error(error.message || 'An error occurred');
        } catch {
          this.toastr.error('Error parsing server response');
        }
      };
      reader.onerror = () => this.toastr.error('Error reading server response');
      reader.readAsText(blob);
    }

    private extractErrorMessage(error: HttpErrorResponse): string {
      if (typeof error.error === 'string') return error.error;
      if (error.error?.message) return error.error.message;
      if (error.message) return error.message;
      return 'An unexpected error occurred';
    }

    private logResponse(request: HttpRequest<any>, response: HttpResponse<any>): void {
      if (!environment.production) {
        console.log(`Request to ${request.url}`, {
          status: response.status,
          body: response.body
        });
      }
    }

    private isIgnoredRoute(requestUrl: string): boolean {
      const fullUrl = requestUrl.startsWith('http') ? requestUrl : `${this.apiBaseUrl}${requestUrl}`;
      return this.ignoredRoutes.some(route => fullUrl.includes(route));
    }
}