import { Injectable } from '@angular/core';
import {createClient, Session, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private storageService: StorageService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async getSession() {
    const { data: session, error } = await this.supabase.auth.getSession();

    if (error) {
      console.error('Fehler beim Holen der Session:', error);
      return null;
    }
    return session.session;
  }

  async updateLocalUser() {
    const {data: user, error} = await this.supabase.auth.getUser();

    if (error) {
      console.error('Fehler beim Holen des Users:', error);
      return null;
    }

    if (user.user?.email) this.storageService.saveUserEmail(user.user?.email);
    if (user.user?.id) this.storageService.saveUserId(user.user?.id);

    const { data: role } = await this.supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.user?.id)
      .single();

    if (role?.role) this.storageService.saveUserRole(role.role);

    return user.user
  }
}
