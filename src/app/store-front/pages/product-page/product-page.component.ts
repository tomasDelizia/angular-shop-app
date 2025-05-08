import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from '../../../products/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsService = inject(ProductsService);

  activatedRoute = inject(ActivatedRoute);

  idSlugParam: string =
    this.activatedRoute.snapshot.paramMap.get('idSlug') ?? '';
  idSlug = linkedSignal<string>(() => this.idSlugParam);

  productResource = rxResource({
    request: () => ({ idSlug: this.idSlug() }),
    loader: ({ request }) =>
      this.productsService.getProductByIdSlug(request.idSlug),
  });
}
