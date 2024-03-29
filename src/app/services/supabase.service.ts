import { Injectable } from '@angular/core';
import {createClient, Session, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    const error = this.supabase.auth.signOut();
  }

  async getSession() {
    const { data: session, error } = await this.supabase.auth.getSession();

    if (error) {
      console.error('Fehler beim Holen der Session:', error);
      return null;
    }
    console.log(session.session)
    return session.session;
  }
  async checkAuthenticated() {



    return await this.getSession() != null;

  }
}
