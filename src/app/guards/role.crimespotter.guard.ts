import {inject} from '@angular/core';
import {SupabaseService} from "../services/supabase.service";
import {StorageService} from "../services/storage.service";
import {Router} from "@angular/router";

export const RoleCrimespotterGuard = async () => {
    const supabaseService = inject(SupabaseService), storageService = inject(StorageService), router = inject(Router);
    let role = storageService.getUserRole();
    if (role == 'crimespotter' || role == 'crimefluencer' || role == 'admin') {
      return true;
    }
    return router.parseUrl('/unauthorized');
  }
;
