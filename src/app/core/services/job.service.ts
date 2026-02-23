import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, JobSearchResponse, JobSearchFilters } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

  constructor(private http: HttpClient) {}

  searchJobs(filters: JobSearchFilters): Observable<JobSearchResponse> {
    let params = new HttpParams();

    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }

    if (filters.remote) {
      params = params.set('remote', 'true');
    }

    return this.http.get<JobSearchResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        data: this.processJobs(response.data ?? [], filters),
      }))
    );
  }

  private processJobs(jobs: Job[], filters: JobSearchFilters): Job[] {
    let result = jobs;

    if (filters.keyword?.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();
      result = result.filter(job =>
        job.title.toLowerCase().includes(keyword)
      );
    }

    if (filters.location?.trim()) {
      const location = filters.location.toLowerCase().trim();
      result = result.filter(job =>
        job.location.toLowerCase().includes(location)
      );
    }

    result.sort((a, b) => b.created_at - a.created_at);

    // Strip HTML once in the service layer rather than per-card in the view
    return result.map(job => ({
      ...job,
      description: this.stripHtml(job.description),
    }));
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
}
