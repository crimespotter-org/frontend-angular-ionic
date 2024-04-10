import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import {Case, CaseFiltered} from '../shared/types/supabase';
import {FilterOptions} from "../shared/interfaces/filter.options";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private storageService: StorageService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({email, password});
  }

  signIn(email: string, password: string) {
    const data = this.supabase.auth.signInWithPassword({email, password})

    this.updateLocalUser();

    return data;
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async getSession() {
    const {data: session, error} = await this.supabase.auth.getSession();

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

    const {data: role} = await this.supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.user?.id)
      .single();

    if (role?.role) this.storageService.saveUserRole(role.role);

    return user.user
  }

  async getAllCases(): Promise<Case[] | []> {
    const {data: cases, error} = await this.supabase.rpc("get_all_cases").returns<Case[]>();
    if (error) {
      console.log(error);
      return []
    }
    return cases;
  }

  async getFilteredCases(filterOptions?: FilterOptions): Promise<CaseFiltered[]> {
    let
      params = {};

    if (filterOptions) {
      params = {
        start_date: filterOptions.startDate?.toISOString(),
        end_date: filterOptions.endDate?.toISOString(),
        crime_types: filterOptions.caseTypes,
        case_status: filterOptions.status,
        currentlat: filterOptions.currentLat,
        currentlong: filterOptions.currentLong,
        distance: filterOptions.radius
      };
    }

    const {
      data: cases
      ,
      error
    }

      = await this.supabase.rpc('get_filtered_cases_angular', params).returns<CaseFiltered[]>();

    if (error) {
      console.error(error);
      return [];
    }
    return cases || [];
  }

  async updateCaseTypes() {
    try {
      let {data, error, status} = await this.supabase
        .rpc('get_enum_values_angular', {enum_typename: 'casetype'});
      if (data) {
        const caseTypes = data.map((item: any) => item.toString());
        this.storageService.saveCaseTypes(caseTypes);
        return caseTypes;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async upvote(caseId: string): Promise<void> {
    const userId = this.storageService.getUserId();
    if (userId !== null) {
      await this.manageVote(caseId, userId, 1);
    }
  }

  async downvote(caseId: string): Promise<void> {
    const userId = this.storageService.getUserId();
    if (userId !== null) {
      await this.manageVote(caseId, userId, -1);
    }
  }

  private async manageVote(caseId: string, userId: string, vote: number): Promise<void> {
    const { data, error } = await this.supabase
      .from('votes')
      .select('*')
      .match({ case_id: caseId, user_id: userId })
      .single();

    if (data) {
      const { error: updateError } = await this.supabase
        .from('votes')
        .update({ vote })
        .match({ id: data.id });
    } else {
      const { error: insertError } = await this.supabase
        .from('votes')
        .insert([
          { case_id: caseId, user_id: userId, vote }
        ]);
      if (insertError) {
        console.error(insertError);
      }
    }
  }
}
