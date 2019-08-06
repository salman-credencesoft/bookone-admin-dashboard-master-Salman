import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    // console.log(sessionStorage.getItem("AuthToken"));
    if (sessionStorage.getItem("AuthToken") != null) {
      return true;
    } 
    else {
      this.router.navigate(["/"], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}
