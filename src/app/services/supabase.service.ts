import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import {Case, CaseDetails, CaseFiltered} from '../shared/types/supabase';
import {FilterOptions} from "../shared/interfaces/filter.options";
import {AddCase} from '../shared/interfaces/addcase.interface';
import {decode} from 'base64-arraybuffer'
import {Image} from '../shared/interfaces/image.interface';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private avatarCache = new Map<string, string>();

  constructor(private storageService: StorageService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({email, password});
  }

  setSession(accessToken: string, refreshToken: string) {
    this.supabase.auth.setSession({access_token: accessToken, refresh_token: refreshToken});
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const {
      data,
      error
    } = await this.supabase.from('user_profiles').select('username').eq('username', username).single();
    return data !== null;
  }

  async createUserProfile(user_id: string, username: string, role: string): Promise<boolean> {
    const {error, data} = await this.supabase.rpc('add_user_profile_angular', {
      "user_id": user_id,
      "username": username,
      "role": role
    }).returns<void>();

    if (error) {
      console.error(error);
      return false;
    }
    return true;

  }

  async updateUsername(newUsername: string): Promise<string> {

    const {error} = await this.supabase
      .from('user_profiles')
      .update({username: newUsername})
      .eq('id', this.storageService.getUserId());

    if (error) return 'Username konnte nicht geändert werden.';
    return '';
  }

  async updateEmail(newEmail: string): Promise<string> {
    const {data, error} = await this.supabase.auth.updateUser({
        email: newEmail
      },
      {
        emailRedirectTo: 'crimespotter://update-mail'
      });

    if (error) return 'Email konnte nicht geändert werden.';
    return '';
  }


  async sendPasswordResetEmail(email: string) {

    const {data, error} = await this.supabase.auth.resetPasswordForEmail(email,
      {
        redirectTo: 'crimespotter://reset-password'
      });

    return error === null;
  }

  async updatePassword(newPassword: string): Promise<string> {
    const {data, error} = await this.supabase.auth.updateUser({
      password: newPassword
    });

    console.log('UpdatePasswordError' + error);

    if (error) return 'Passwort konnte nicht aktualisiert werden.';
    return '';
  }

  async signInPasswordCheck(email: string, password: string) {
    const data = await this.supabase.auth.signInWithPassword({email, password});

    return data.error == null;
  }

  async signIn(email: string, password: string) {
    const data = await this.supabase.auth.signInWithPassword({email, password});

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

    const session = await this.getSession();

    if (session === null) {
      console.log('No session found');
      return;
    }

    const jwt: any = jwtDecode(session.access_token);

    const email = jwt.email;
    const user_id = jwt.sub;
    const user_role = jwt.user_role;
    const username = jwt.username;

    this.storageService.saveUserEmail(email);
    this.storageService.saveUserId(user_id);
    this.storageService.saveUserRole(user_role);
    this.storageService.saveUsername(username);
    this.getAvatarUrlForUser(user_id).then(url => this.storageService.saveUserAvatarUrl(url))
  }

  async getAvatarUrlForUser(userId: string) {

    if (this.avatarCache.has(userId)) {
      return this.avatarCache.get(userId)!;
    }

    let signedUrl: string | undefined = '';
    await this.supabase
      .storage
      .from('avatars')
      .createSignedUrl(`${userId}.png`, 3600).then(url => {
        if (url) {
          if (url.data) {
            this.avatarCache.set(userId, url.data.signedUrl);
            signedUrl = url.data.signedUrl;
          } else {
            signedUrl = 'assets/icon/avatar.svg';
            this.avatarCache.set(userId, 'assets/icon/avatar.svg');
          }
        }
      });

    return signedUrl;
  }

  clearAvatarCache() {
    this.avatarCache.clear();
  }

  async uploadUserAvatar(image: Image, userId: string) {
    const {} = await this.supabase
      .storage
      .from('avatars')
      .upload(`${userId}.png`, decode(image.base64), {
        contentType: `image/${image.type}`
      });
  }

  async deleteUserAvatar(userId: string) {
    const {} = await this.supabase
      .storage
      .from('avatars')
      .remove([`${userId}.png`]);
    this.avatarCache.delete(userId);
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

  async getCrimefluencer() {
    return this.supabase
      .from('user_profiles')
      .select('id, username, role')
      .or(`role.eq.crimefluencer,role.eq.admin`)
      .then(({data, error}) => {
        if (error) {
          console.error(error);
        }
        return data;
      });
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
        distance: filterOptions.radius,
        crimefluencer_ids: filterOptions.crimefluencerIds
      };
    }

    const {
      data: cases
    } = await this.supabase.rpc('get_filtered_cases_angular', params).returns<CaseFiltered[]>();

    let casesWithMediaCheckAndAvatarUrl = cases;
    if (cases != null) {
      casesWithMediaCheckAndAvatarUrl = await Promise.all(cases.map(async (c) => ({
        ...c,
        has_media: await this.caseHasMedia(c.id)
      })));

      casesWithMediaCheckAndAvatarUrl = await Promise.all(cases.map(async (c) => ({
        ...c,
        creator_avatar_url: await this.getAvatarUrlForUser(c.created_by)
      })));
    }

    return casesWithMediaCheckAndAvatarUrl ?? [];
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
    console.log("getting case details for case id: " + case_id_param)
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
      .list(`case-${caseId}`, {limit: 100, offset: 0});

    console.log("trying to get image urls for case id: " + caseId);

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
        const avatarUrl = await this.getAvatarUrlForUser(payload.new['user_id'])
        callback({
          case_id: payload.new['case_id'],
          created_at: payload.new['created_at'],
          id: payload.new['id'],
          text: payload.new['text'],
          user_id: payload.new['user_id'],
          user: {
            username: username
          },
          avatarUrl: avatarUrl.toString()
        });
      }).subscribe();
  }

  addComment(caseId: string, userId: string, text: string) {
    return this.supabase
      .from('comments')
      .insert([{case_id: caseId, user_id: userId, text}]);
  }

  async getCommentsByCaseId(caseId: string) {
    const comments = await this.supabase
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

    if (comments.error) {
      console.error('Error fetching comments:', comments.error);
      return [];
    }

    return await Promise.all(comments.data.map(async comment => {
      const avatarUrl = await this.getAvatarUrlForUser(comment.user_id);
      return {
        ...comment,
        avatarUrl: avatarUrl
      };
    }));
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

  async updateCrimeCase(caseData: AddCase, caseId: string): Promise<boolean> {

    const userId = this.storageService.getUserId();
    if (userId === null) {
      throw new Error('User not logged in');
    }

    const dataObject = {
      p_case_id: caseId,
      p_title: caseData.title,
      p_summary: caseData.summary,
      p_latitude: caseData.latitude,
      p_longitude: caseData.longitude,
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

    console.log(dataObject);

    const {data, error} = await this.supabase.rpc('update_case_angular', dataObject);

    if (error) {
      throw new Error("Crime case update failed with error message: \n" + error.message);
    } else {
      return true;
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

