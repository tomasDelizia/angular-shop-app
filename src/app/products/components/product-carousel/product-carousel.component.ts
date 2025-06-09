import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
  .swiper {
    width: 100%;
    height: 500px;
  }
  `,
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  productName = input.required<string>();
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if the images input has changed and is not the first change
    if (changes['images'].firstChange) return;
    if (!this.swiper) return;
    // If swiper is already initialized, destroy it and reinitialize
    this.swiper.destroy(true, true);
    const paginationElement: HTMLDivElement =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationElement.innerHTML = ''; // Clear pagination element
    setTimeout(() => this.swiperInit(), 100); // Wait for the DOM to update
  }

  swiperInit(): void {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
