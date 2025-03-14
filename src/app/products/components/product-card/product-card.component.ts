import { Component, input } from '@angular/core';
import { Product } from '../../interfaces/product.interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input<Product>();
}
