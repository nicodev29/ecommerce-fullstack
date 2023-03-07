import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

  //propiedades para la paginacion
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //buscamos los productos usando el keyword
    this.productService.searchProducts(theKeyword).subscribe((data) => {
      this.products = data;
    });
  }

  handleListProducts() {
    //verificamos si el parametro id esta presente en la url
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    //si el parametro id esta presente en la url
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      //no hay categoria id disponible, por defecto mostramos la categoria 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Libros';
    }


    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    //obtenemos los productos para la categoria seleccionada
    
    this.productService.getProductsListPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(
                                                  data => {
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber = data.page.number + 1;
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                );
  }
}
