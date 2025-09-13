import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlist: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  private wishlistCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      this.wishlist = JSON.parse(stored);
      this.wishlistSubject.next([...this.wishlist]);
      this.wishlistCount.next(this.wishlist.length);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next([...this.wishlist]);
    this.wishlistCount.next(this.wishlist.length);
  }

  toggleWishlist(movie: any) {
    const index = this.wishlist.findIndex((m) => m.id === movie.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(movie);
    }
    this.saveToLocalStorage();
  }

  isInWishlist(id: number): boolean {
    return this.wishlist.some((m) => m.id === id);
  }

  getWishlist(): any[] {
    return [...this.wishlist];
  }

  getWishlistObservable() {
    return this.wishlistSubject.asObservable();
  }

  getWishlistCount() {
    return this.wishlistCount.asObservable();
  }
}