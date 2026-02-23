import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBriefcase, lucideHeart, lucideClipboardList,
  lucideUser, lucideLogOut, lucideMenu, lucideX, lucideLogIn, lucideUserPlus
} from '@ng-icons/lucide';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  viewProviders: [provideIcons({
    lucideBriefcase, lucideHeart, lucideClipboardList,
    lucideUser, lucideLogOut, lucideMenu, lucideX, lucideLogIn, lucideUserPlus
  })],
  templateUrl: './navbar.html',
})
export class Navbar {
  private auth = inject(AuthService);

  currentUser = this.auth.currentUser;
  isAuthenticated = this.auth.isAuthenticated;
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
  }
}
