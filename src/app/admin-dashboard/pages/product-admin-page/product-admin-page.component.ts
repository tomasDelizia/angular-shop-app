import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-admin-page',
  imports: [],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  productsService = inject(ProductsService);

  productId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  productResource = rxResource({
    request: () => ({
      id: this.productId(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProductById(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
