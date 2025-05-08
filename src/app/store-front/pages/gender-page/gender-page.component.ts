import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductListComponent } from '../../../products/components/product-list/product-list.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductListComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  activatedRoute = inject(ActivatedRoute);

  paginationService = inject(PaginationService);

  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage() - 1,
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9,
      });
    },
  });
}
