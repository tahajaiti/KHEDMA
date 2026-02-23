export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id?: number;
  userId: number;
  offerId: string;
  apiSource: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  notes: string;
  dateAdded: string;
}
