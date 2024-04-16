import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import {Case, CaseDetails, CaseFiltered} from '../shared/types/supabase';
import {FilterOptions} from "../shared/interfaces/filter.options";
import {AddCase} from '../shared/interfaces/addcase.interface';
import {decode} from 'base64-arraybuffer'
import {Image} from '../shared/interfaces/image.interface';

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

    const {data: role} = await this.getUserRole(user.user?.id);

    if (role?.role && role?.role !== '') this.storageService.saveUserRole(role.role);

    return user.user
  }

  async getUserName(userId: string) {
    const {data: user} = await this.supabase
      .from('user_profiles')
      .select('username')
      .eq('id', userId)
      .single();

    return user ? user.username : '';
  }

  async getUserRole(userId: string) {
    const {data: user} = await this.supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return user ? user.role : '';
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
    } = await this.supabase.rpc('get_filtered_cases_angular', params).returns<CaseFiltered[]>();

    let casesWithMediaCheck = cases;
    if (cases != null) {
      casesWithMediaCheck = await Promise.all(cases.map(async (c) => ({
        ...c,
        has_media: await this.caseHasMedia(c.id)
      })));
    }

    return casesWithMediaCheck ?? [];
  }

  async caseHasMedia(caseId: string): Promise<boolean> {
    const {data, error} = await this.supabase
      .storage
      .from('media')
      .list('case-' + caseId, {limit: 1});

    if (error) {
      console.error(error);
      return false;
    }

    return data?.length > 0;
  }


  async getCaseDetails(case_id_param: string): Promise<CaseDetails | null> {
    const {
      data: details,
      error
    } = await this.supabase.rpc('get_case_details_angular', {case_id_param}).returns<CaseDetails[]>();

    if (error) {
      console.error(error);
      return null;
    }

    return details && details.length > 0 ? details[0] : null;
  }

  async getImageUrlsForCase(caseId: string): Promise<string[]> {
    const {data, error} = await this.supabase
      .storage
      .from('media')
      .list(`case-${caseId}`, {limit: 100, offset: 0}); // Passen Sie den Pfad und die Optionen an Ihre Bedürfnisse an.

    if (error) {
      console.error(error);
      return [];
    }

    const urlPromises = await Promise.all(data.map(async file => {
      const expiresIn = 300;
      const {data: signedData, error: signedError} = await this.supabase
        .storage
        .from('media')
        .createSignedUrl(`case-${caseId}/${file.name}`, expiresIn);

      if (signedError) {
        console.error(signedError);
        return null;
      }
      return signedData.signedUrl;
    }));

    const urls = await Promise.all(urlPromises);
    return urls.filter((url): url is string => url !== null);
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

  async updateLinkTypes() {
    try {
      let {data, error, status} = await this.supabase
        .rpc('get_enum_values_angular', {enum_typename: 'link_type'});
      if (data) {
        const linkTypes = data.map((item: any) => item.toString());
        this.storageService.saveLinkTypes(linkTypes);
        return linkTypes;
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
    const {data, error} = await this.supabase
      .from('votes')
      .select('*')
      .match({case_id: caseId, user_id: userId})
      .single();

    if (data) {
      const {error: updateError} = await this.supabase
        .from('votes')
        .update({vote})
        .match({id: data.id});
    } else {
      const {error: insertError} = await this.supabase
        .from('votes')
        .insert([
          {case_id: caseId, user_id: userId, vote}
        ]);
      if (insertError) {
        console.error(insertError);
      }
    }
  }

  subscribeToComments(caseId: string, callback: Function) {
    return this.supabase
      .channel(`comments:case_id=eq.${caseId}`).on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments'
      }, async (payload) => {
        const username = await this.getUserName(payload.new['user_id']);
        callback({
          case_id: payload.new['case_id'],
          created_at: payload.new['created_at'],
          id: payload.new['id'],
          text: payload.new['text'],
          user_id: payload.new['user_id'],
          user: {
            username: username
          }
        });
      }).subscribe();
  }

  addComment(caseId: string, userId: string, text: string) {
    return this.supabase
      .from('comments')
      .insert([{case_id: caseId, user_id: userId, text}]);
  }

  async getCommentsByCaseId(caseId: string) {
    const data: any = await this.supabase
      .from('comments')
      .select(`
      id,
      text,
      created_at,
      user_id,
      user: user_id (
        username
      )
    `)
      .eq('case_id', caseId)
      .order('created_at', {ascending: true});

    if (data.error) {
      console.log(data.error)
    }

    return data.data ? data.data : [];
  }

  async getLinksByCaseId(caseId: string) {
    const data: any = await this.supabase
      .from('furtherlinks')
      .select(`
      id,
      url,
      link_type
    `)
      .eq('case_id', caseId)
      .order('link_type', {ascending: true});

    if (data.error) {
      console.log(data.error)
    }
    return data.data ? data.data : [];
  }

  async createCrimeCase(caseData: AddCase): Promise<number> {

    console.log("creating new case...");

    const userId = this.storageService.getUserId();
    if (userId === null) {
      throw new Error('User not logged in');
    }


    const dataObject = {
      p_title: caseData.title,
      p_summary: caseData.summary,
      p_longitude: caseData.longitude,
      p_latitude: caseData.latitude,
      p_created_by: userId,
      p_place_name: caseData.placeName,
      p_zip_code: caseData.zipCode,
      p_case_type: caseData.caseType,
      p_crime_date_time: caseData.crimeDateTime,
      p_status: caseData.status,
      p_links: caseData.links.map(link => {
          return {
            url: link.value,
            link_type: link.type
          }
        }
      )
    };


    const {data, error} = await this.supabase
      .rpc('create_crime_case_angular', dataObject)

    if (error) {
      throw new Error("Crime case creation failed with error message: \n" + error.message);
    } else {
      return data;
    }

  }


  async uploadImagesForCase(caseId: number, images: Image[]) {

    for (let i = 0; i < images.length; i++) {
      const {data, error} = await this.supabase
        .storage
        .from('media')
        .upload(`case-${caseId}/${i}.png`, decode(images[i].base64), {
          contentType: `image/${images[i].type}`
        });
    }
  }
}


