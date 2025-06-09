import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/auth.interfaces';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interfaces';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

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
    // If the id is 'new', return an empty product
    if (id === 'new') {
      return of(emptyProduct);
    }
    const key = id;
    if (this.productsByIdOrSlugCache.has(key)) {
      return of(this.productsByIdOrSlugCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((product) => console.log(product)),
      tap((product) => this.productsByIdOrSlugCache.set(key, product))
    );
  }

  createProduct(
    productLike: Partial<Product>,
    imageFiles?: FileList
  ): Observable<Product> {
    console.log('Create product', productLike);

    return this.uploadImages(imageFiles).pipe(
      map((newImages) => ({
        ...productLike,
        images: [...newImages],
      })),
      switchMap((productToCreate) =>
        this.http.post<Product>(`${baseUrl}/products`, productToCreate)
      ),
      tap((product) => this.updateProductCache(product, true))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFiles?: FileList
  ): Observable<Product> {
    console.log('Update product', productLike);

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFiles).pipe(
      map((newImages) => ({
        ...productLike,
        images: [...currentImages, ...newImages],
      })),
      // Chain the observable to ensure images are uploaded before updating the product
      switchMap((productToUpdate) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, productToUpdate)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  updateProductCache(product: Product, isNew = false): void {
    const productId = product.id;
    this.productsByIdOrSlugCache.set(productId, product);

    if (isNew) {
      console.log('New product added to cache');
      return;
    }
    this.productsCache.forEach((response) => {
      response.products = response.products.map((current) =>
        current.id === productId ? product : current
      );
    });
    console.log('Product cache updated');
  }

  uploadImages(images?: FileList): Observable<string[]> {
    // If no images are provided, return an empty observable
    if (!images || images.length === 0) {
      return of([]);
    }
    const uploadObservables = Array.from(images).map((image) =>
      this.uploadImage(image)
    );
    // Use forkJoin to wait for all uploads tasks to complete
    return forkJoin(uploadObservables).pipe(
      tap((fileNames) => console.log('All images uploaded:', fileNames))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(
        tap((response) => console.log('Image uploaded:', response.fileName)),
        map((response) => response.fileName)
      );
  }
}
