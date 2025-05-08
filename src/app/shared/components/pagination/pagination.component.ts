import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input<number>(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);
  // Number array
  getPagesList = computed(() =>
    Array.from({ length: this.pages() }, (_, i) => i + 1)
  );
}
