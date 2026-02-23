import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FavoriteOffer } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly apiUrl = '/api/favoritesOffers';

  constructor(private http: HttpClient) {}

  getFavoritesByUser(userId: number): Observable<FavoriteOffer[]> {
    return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addFavorite(favorite: FavoriteOffer): Observable<FavoriteOffer> {
    return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  isFavorite(userId: number, offerId: string): Observable<boolean> {
    return this.http
      .get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`)
      .pipe(map(favs => favs.length > 0));
  }
}
