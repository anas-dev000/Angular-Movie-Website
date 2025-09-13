import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', loadComponent: () => import('./movies/movies').then((m) => m.MoviesComponent) },
  {
    path: 'movie/:id',
    loadComponent: () => import('./movie-details/movie-details').then((m) => m.MovieDetailsComponent),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/wishlist').then((m) => m.WishlistComponent),
    canMatch: [AuthGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('./search-results/search-results').then((m) => m.SearchResultsComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'account',
    loadComponent: () => import('./auth/account/account').then((m) => m.AccountComponent),
  },
  { path: '**', redirectTo: 'movies' },
];
