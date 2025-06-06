import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interfaces';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();

  private productsByIdOrSlugCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((products) => console.log(products)),
        tap((products) => this.productsCache.set(key, products))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const key = idSlug;
    if (this.productsByIdOrSlugCache.has(key)) {
      return of(this.productsByIdOrSlugCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((product) => console.log(product)),
      tap((product) => this.productsByIdOrSlugCache.set(key, product))
    );
  }

  // TODO Update
  getProductById(id: string): Observable<Product> {
    const key = id;
    if (this.productsByIdOrSlugCache.has(key)) {
      return of(this.productsByIdOrSlugCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((product) => console.log(product)),
      tap((product) => this.productsByIdOrSlugCache.set(key, product))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    console.log('Update product', productLike);
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.productsByIdOrSlugCache.set(productId, product);

    this.productsCache.forEach((response) => {
      response.products = response.products.map((current) =>
        current.id === productId ? product : current
      );
    });
    console.log('Product cache updated');
  }
}
