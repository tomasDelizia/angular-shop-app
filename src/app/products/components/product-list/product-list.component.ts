import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interfaces';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  products = input.required<Product[]>();
}
