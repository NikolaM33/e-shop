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
import { AccountService } from "../pages/account/account.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Injectable()
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private apiBaseUrl = environment.apiUrl;
  ignoredRoutes = ['/authentication', '/shop'];

  constructor(
    private accountingService: AccountService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    const requestUrl = request.url;

    if (this.isIgnoredRoute(requestUrl)) {
      return next.handle(request);
    }

    const authRequest = this.addToken(request);
    
    return next.handle(authRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - startTime;
          console.debug(`Request to ${request.url} took ${elapsed}ms`);
        }
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.accountingService.getToken();
    if (!accessToken) return request;

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
  }

  private isIgnoredRoute(requestUrl: string): boolean {
    const fullIgnoredRoutes = this.ignoredRoutes.map(route => 
      requestUrl.startsWith('http') ? route : `${this.apiBaseUrl}${route}`
    );
    return fullIgnoredRoutes.some(route => requestUrl.includes(route));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);

    if (error.status === 0) {
      this.toastrService.error('Network error - please check your connection');
      this.accountingService.logout();
      return throwError(() => new Error('Network error'));
    }

    if (error.status === 401 || error.status === 403) {
      this.toastrService.warning('Session expired - please login again');
      this.accountingService.logout();
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return throwError(() => new Error('Authentication required'));
    }

    if (error.status === 500) {
      this.toastrService.error('Server error - please try again later');
      return throwError(() => new Error('Server error'));
    }

    if (error.status === 404) {
      this.router.navigate(['/page404']);
      return throwError(() => new Error('Resource not found'));
    }

    if (error.error instanceof Blob) {
      return this.handleBlobError(error);
    }

    const userMessage = this.getUserFriendlyError(error);
    this.toastrService.error(userMessage);
    return throwError(() => error);
  }

  private handleBlobError(error: HttpErrorResponse): Observable<never> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const errorObj = JSON.parse(reader.result as string);
          this.toastrService.error(errorObj.message || 'An error occurred');
        } catch (e) {
          this.toastrService.error('An error occurred processing the response');
        }
        observer.error(error);
      };
      reader.onerror = () => {
        this.toastrService.error('Error reading server response');
        observer.error(error);
      };
      reader.readAsText(error.error);
    });
  }

  private getUserFriendlyError(error: HttpErrorResponse): string {
    if (!error) return 'An unknown error occurred';
    
    if (typeof error.error === 'string') {
      return error.error.length < 100 ? error.error : 'Operation failed';
    }
    
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.message) {
      return error.statusText || error.message;
    }
    
    return 'An unexpected error occurred';
  }
}