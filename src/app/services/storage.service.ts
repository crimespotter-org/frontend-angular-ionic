import { Injectable } from '@angular/core';

const USER_ROLE_KEY = "user_role";
const USER_EMAIL_KEY = "user_email";
const USER_ID_KEY = "user_id";
const CASE_TYPE_KEY = "case_type";
const LINK_TYPE_KEY = "link_type";
const USER_NAME_KEY = "user_name";

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
    sessionStorage.setItem(USER_EMAIL_KEY, email);
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

  public saveCaseTypes(types: string[]) {
    sessionStorage.setItem(CASE_TYPE_KEY, JSON.stringify(types));  }

  public saveLinkTypes(types: string[]) {
    sessionStorage.setItem(LINK_TYPE_KEY, JSON.stringify(types));
  }

  public getCaseTypes() {
    const data = sessionStorage.getItem(CASE_TYPE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  }

  public getLinkTypes() {
    const data = sessionStorage.getItem(LINK_TYPE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  }

  public saveUsername(username: string){
    sessionStorage.setItem(USER_NAME_KEY, username);
  }

  public getUsername(){
    return sessionStorage.getItem(USER_NAME_KEY);
  }
}
