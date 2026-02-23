import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JobSearchFilters } from '../../../core/models/job.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

@Component({
  selector: 'app-job-filters',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  viewProviders: [provideIcons({ lucideSearch })],
  templateUrl: './job-filters.html',
})
export class JobFilters {
  initialFilters = input<JobSearchFilters>({ keyword: '', location: '' });
  search = output<JobSearchFilters>();

  private fb = new FormBuilder();

  form: FormGroup = this.fb.group({
    keyword: [''],
    location: [''],
    remote: [false],
  });

  onSubmit(): void {
    this.search.emit(this.form.value);
  }
}
