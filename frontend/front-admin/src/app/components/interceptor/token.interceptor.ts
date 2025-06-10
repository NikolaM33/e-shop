import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { UtilService } from "../util.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    ignoredRoutes = [
        '/authentication',];
  
    constructor(
      private authenticationService: AuthService,
      private router: Router,

    ) {}
  
    addToken(request: HttpRequest<any>): HttpRequest<any> {
      const accessToken = this.authenticationService.getToken();
      if (accessToken) {
        return request.clone({
          headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
        })
      } else {
        return request;
      }
    }
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const requestUrl = request.url;
  
      if (!this.isIgnoredRoute(requestUrl)) {
        return next.handle(this.addToken(request)).pipe(

          catchError((error: HttpErrorResponse) => {
            console.log("--------------- ERROR ----------------");
            console.log(error);
            if (error.status === 401) {
              this.authenticationService.logout();
            } else if (error.status === 500) {
              // this.router.navigateByUrl('500');
            //   this.utilService.showNotification(
            //     "snackbar-danger",
            //     this.translatePipe.transform('NOTIFICATIONS.SOMETHING_WENT_WRONG'),
            //     "bottom",
            //     "center"
             // );
            } else if(error.status === 403) {
              this.authenticationService.logout();
              this.router.navigateByUrl("/auth/login");
              // this.router.navigateByUrl("page404");
  
            }
             else if (error.status === 404) {
              this.router.navigateByUrl("page404");
            } else if (error.status === 0) {
              console.log(error);
              //this.loginService.logout();
            } else {
              if (error.error instanceof Blob) {
                const reader: FileReader = new FileReader();
                reader.onloadend = e => {
                //   this.utilService.showNotification(
                //     "snackbar-danger",
                //     JSON.parse(reader.result as string).message,
                //     "bottom",
                //     "center"
                //   );
                };
                reader.readAsText(error.error);
              } else {
                let errorText;
                if (!error.error.message) {
                  errorText =
                    JSON.parse(error.error).message || "SOMETHING_WENT_WRONG";
                }
                // this.utilService.showNotification(
                //   "snackbar-danger",
                //   errorText ? errorText : error.error.message,
                //   "bottom",
                //   "center"
                // );
              }
              return throwError(error);
            }
          })
        );
      } else {
        return next.handle(request);
      }
    }
  
    isIgnoredRoute(requestUrl) {
      return !!this.ignoredRoutes.find(route => requestUrl.includes(route));
    }
}