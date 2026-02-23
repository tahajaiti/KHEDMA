import { Component, inject, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
})
export class ProfileForm implements OnInit {
  private fb = inject(FormBuilder);

  user = input.required<User>();
  save = output<Partial<User>>();

  form!: FormGroup;
  editing = false;

  ngOnInit(): void {
    const u = this.user();
    this.form = this.fb.group({
      firstName: [u.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [u.lastName, [Validators.required, Validators.minLength(2)]],
      email: [u.email, [Validators.required, Validators.email]],
    });
  }

  startEditing(): void {
    this.editing = true;
  }

  cancelEditing(): void {
    const u = this.user();
    this.form.patchValue({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
    });
    this.editing = false;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
    this.editing = false;
  }
}
