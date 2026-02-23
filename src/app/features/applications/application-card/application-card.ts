import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideCalendar, lucideExternalLink, lucideTrash2, lucidePencil } from '@ng-icons/lucide';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [FormsModule, DatePipe, NgIcon],
  viewProviders: [provideIcons({ lucideMapPin, lucideCalendar, lucideExternalLink, lucideTrash2, lucidePencil })],
  templateUrl: './application-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationCard {
  application = input.required<Application>();

  statusChange = output<{ id: number; status: ApplicationStatus }>();
  notesChange = output<{ id: number; notes: string }>();
  remove = output<number>();

  editingNotes = false;
  notesValue = '';

  get statusColor(): string {
    switch (this.application().status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  }

  get statusLabel(): string {
    switch (this.application().status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  }

  onStatusChange(status: string): void {
    const app = this.application();
    if (app.id) {
      this.statusChange.emit({ id: app.id, status: status as ApplicationStatus });
    }
  }

  startEditNotes(): void {
    this.notesValue = this.application().notes || '';
    this.editingNotes = true;
  }

  saveNotes(): void {
    const app = this.application();
    if (app.id) {
      this.notesChange.emit({ id: app.id, notes: this.notesValue });
    }
    this.editingNotes = false;
  }

  cancelEditNotes(): void {
    this.editingNotes = false;
  }

  onRemove(): void {
    const app = this.application();
    if (app.id) {
      this.remove.emit(app.id);
    }
  }
}
