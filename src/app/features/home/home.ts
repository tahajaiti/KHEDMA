import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideHeart, lucideClipboardList, lucideArrowRight } from '@ng-icons/lucide';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIcon],
  viewProviders: [provideIcons({ lucideSearch, lucideHeart, lucideClipboardList, lucideArrowRight })],
  templateUrl: './home.html',
})
export class Home {
  private auth = inject(AuthService);
  isAuthenticated = this.auth.isAuthenticated;
}
