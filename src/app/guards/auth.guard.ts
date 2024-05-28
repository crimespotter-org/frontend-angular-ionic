import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {SupabaseService} from "../services/supabase.service";

export const authGuard = async () => {
    const supabaseService = inject(SupabaseService), router = inject(Router);
    if (await supabaseService.getSession() != null) {
      console.log("auth true")
      return true
    }
    return router.parseUrl('/login');
  }
;
