import { Injectable } from '@angular/core';

const USER_ROLE_KEY = "user_role";
const USER_EMAIL_KEY = "user_email";
const USER_ID_KEY = "user_id";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  clear(): void {
    sessionStorage.clear();
  }

  public saveUserRole(role: string) {
    sessionStorage.setItem(USER_ROLE_KEY, role);
  }

  public getUserRole() {
    return sessionStorage.getItem(USER_ROLE_KEY);
  }

  public saveUserEmail(email: string) {
    sessionStorage.setItem(USER_ROLE_KEY, email);
  }

  public getUserEmail() {
    return sessionStorage.getItem(USER_EMAIL_KEY);
  }

  public saveUserId(id: string) {
    sessionStorage.setItem(USER_ID_KEY, id);
  }

  public getUserId() {
    return sessionStorage.getItem(USER_ID_KEY);
  }

}
