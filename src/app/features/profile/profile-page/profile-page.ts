import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { ProfileForm } from '../profile-form/profile-form';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileForm],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;
  successMessage = '';
  errorMessage = '';

  onSave(data: Partial<User>): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.auth.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
      },
    });
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    this.auth.deleteAccount().subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: Error) => {
        this.errorMessage = err.message;
      },
    });
  }
}
