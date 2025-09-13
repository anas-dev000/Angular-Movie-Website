import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: '././movie-card.html',
  styleUrls: ['./movie-card.css'],

})
export class MovieCardComponent implements OnInit {
  @Input() movie: any;
  imgBaseUrl = environment.imgBaseUrl;
  defaultImage = 'default-poster.jpg';
  isInWishlist = false;

  constructor(private wishlistService: WishlistService, private router: Router) {}

  ngOnInit() {
    if (this.movie) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.movie.id);
      this.wishlistService.getWishlistObservable().subscribe((wishlist) => {
        this.isInWishlist = wishlist.some((m) => m.id === this.movie.id);
      });
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.movie);
  }
}
