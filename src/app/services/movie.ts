import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '3fb8345ed39c96353f20a4407cc4d32d';

  constructor(private http: HttpClient) {}

  getNowPlaying(page: number = 1, language: string = 'en'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}&language=${language}`
    );
  }

  getMovieDetails(id: number, language: string = 'en'): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&language=${language}`);
  }

  getRecommendations(movieId: number, language: string = 'en'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}&language=${language}`
    );
  }

  searchMovies(query: string, page: number = 1, language: string = 'en'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}&language=${language}`
    );
  }

  getGenres(language: string = 'en'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=${language}`
    );
  }

  getVideos(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${id}/videos?api_key=${this.apiKey}`);
  }

  getDiscover(
    page: number = 1,
    language: string = 'en',
    sortBy: string = 'popularity.desc',
    genres: string = ''
  ): Observable<any> {
    let url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&page=${page}&language=${language}&sort_by=${sortBy}`;
    if (genres) url += `&with_genres=${genres}`;
    return this.http.get(url);
  }
}
