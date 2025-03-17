import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product.interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>('http://localhost:3000/api/products').pipe(
      tap(response => console.log(response)),
    );
  }

}
