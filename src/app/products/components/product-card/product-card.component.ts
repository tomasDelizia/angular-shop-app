import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../interfaces/product.interfaces';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  productsService = inject(ProductsService);

  product = input.required<Product>();

  productImageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${
      this.product().images[0]
    }`;
  });
}
