import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageService } from '../page.service';
import { UtilService } from '../util.service';
import { environment } from 'src/environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private pageService: PageService,
    private utilService: UtilService) {
  }


  public getUsers(params) {
    return this.http.get(environment.apiUrl + '/user', {
      params: this.utilService.generatePageParams(params),
      observe: 'response'
    })
  }

  public createUser(formData: any) {
    return this.http.post(environment.apiUrl + '/user', formData);
  }

  public getUserById(userId: string) {
    return this.http.get(environment.apiUrl + '/user/' + userId)
  }

  public updateUser(userId: string, user: any) {
    return this.http.put(environment.apiUrl + '/user/' + userId, user)
  }

  public changePassword (userId: string, password:any){
   return this.http.patch(`${environment.apiUrl}/user/${userId}`, password).pipe(
      catchError((error) => {
        return throwError(()=> 'Error changing password');  
      }))
  }
}
