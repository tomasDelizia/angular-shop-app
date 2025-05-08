import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../interfaces/product.interfaces';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ProductsService } from '@products/services/products.service';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  productsService = inject(ProductsService);

  product = input.required<Product>();
}
