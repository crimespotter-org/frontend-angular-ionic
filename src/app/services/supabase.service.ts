import { Injectable } from '@angular/core';
import {createClient, Session, SupabaseClient, User} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import { Case } from '../shared/interfaces/case.interface';

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
    const data = this.supabase.auth.signInWithPassword({ email, password })

    this.updateLocalUser();

    return data;
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

  async getAllCases(): Promise<Case[]> {
    try {
      // Asynchronously query the 'cases' table from Supabase
      const { data, error } = await this.supabase
        .from('cases')
        .select('*');
  
      // If there's an error, log it and return an empty array of Case objects
      if (error) {
        console.log(error);
        return [];
      }
  
      // If no error, map the data to an array of Case objects
      const cases: Case[] = data.map((item: any) => {
        return {
          id: item.id,
          title: item.title,
          summary: item.summary,
          location: item.location,
          status: item.status,
          created_by: item.created_by,
          created_at: item.created_at,
          place_name: item.place_name,
          zip_code: item.zip_code
        };
      });
  
      return cases;
    } catch (error) {
      console.error('Error fetching cases:', error);
      return [];
    }
  }
  

}
