import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): any {
    const noImageUrl = './assets/images/no-image.jpg';
    if (value === null || value === undefined) {
      return noImageUrl;
    }
    if (Array.isArray(value)) {
      return value.length > 0
        ? `${apiUrl}/files/product/${value[0]}`
        : noImageUrl;
    }
    return `${apiUrl}/files/product/${value}`;
  }
}
