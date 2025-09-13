import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private languages = ['en', 'ar', 'fr', 'zh'];
  private currentLanguage = new BehaviorSubject<string>('en');
  private direction = new BehaviorSubject<string>('ltr');

  getLanguages() {
    return [...this.languages];
  }

  setLanguage(lang: string) {
    this.currentLanguage.next(lang);
    this.direction.next(lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('dir', this.direction.value);
  }

  getCurrentLanguage() {
    return this.currentLanguage.asObservable();
  }

  getDirection() {
    return this.direction.asObservable();
  }
}
