import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './User';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) { 
    const parsedUser = this.getUserFromLocalStorage() ? this.getUserFromLocalStorage(): null;
    this.currentUserSubject = new BehaviorSubject<User | null>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

 createUser(user:any){
   return this.http.post(environment.apiUrl+ "/user",user);
  }

  getUser(userId: string){
    return this.http.get(`${environment.apiUrl}/user/${userId}`)
  }

  public login(data: any): any {
    return this.http.post(`${environment.apiUrl}/authenticate`, data);
  }

  public logout(): void {
    this.removeToken();
    this.removeUser();
    this.router.navigateByUrl("/shop/electronics")
  }

  setUser(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
    const user: User = { ...data };
    this.currentUserSubject.next(user);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  removeUser() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getUserFromLocalStorage() {
    if (localStorage.getItem('user') != null) {
      return JSON.parse(localStorage.getItem('user'));
    }
    return null;
  }

  checkPermission(viewName, right, role?) {
    let user = this.getUserFromLocalStorage();
    if (user != null && user != '') {
      for (let i = 0; i < user.userGroups.length; i++) {
        for (let j = 0; j < user.userGroups[i].userPermissions.length; j++) {
          const permission = user.userGroups[i].userPermissions[j];
          if (viewName === permission.viewName  && right === permission.viewRight && (role ? permission.userViewRole === role : true) ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  clear() {
    localStorage.clear();
  }

  validateTokenForResetPassword(token) {
    return this.http.post(environment.apiUrl + "/user/validate-token", token);
  }

}


