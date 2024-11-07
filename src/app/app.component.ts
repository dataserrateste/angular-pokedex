import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokedex';
  numbers: number[] = Array.from({ length: 1025 }, (_, i) => i + 1);
  displayedImages: number[] = [];
  imagesPerPage: number = 12;
  currentPage: number = 0;

  constructor() {
    this.loadMoreImages();
  }

  ngOnInit(): void {
    // this.loadMoreImages();
  }

  get hasMoreImages(): boolean {
    return this.currentPage * this.imagesPerPage < this.numbers.length;
  }

  loadMoreImages(): void {
    const nextPageImages = this.numbers.slice(
      this.currentPage * this.imagesPerPage,
      (this.currentPage + 1) * this.imagesPerPage
    );
    this.displayedImages = [...this.displayedImages, ...nextPageImages];
    this.currentPage++;
  }

  searchPokemon(n: number): void {
    this.numbers = [n]
    this.displayedImages = []
    this.currentPage = 0;
    this.loadMoreImages();
  }
}
