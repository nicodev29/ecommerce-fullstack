import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {


  private baseUrl = 'http://localhost:8181/api/products';

  private categoryUrl = 'http://localhost:8181/api/product-category';

  constructor(private httpClient: HttpClient) {}

  getProduct(theProductId: number): Observable<Product> {
      
      //crear URL basada en el producto id, devolviendo un observable de producto
      const productUrl = `${this.baseUrl}/${theProductId}`;
      return this.httpClient.get<Product>(productUrl);
  }

  getProductsList(theCatecoryId: number): Observable<Product[]> {

    //crear URL basada en la categoria, si no hay categoria, se muestra todos los productos
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCatecoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductsListPaginate(thePage: number, thePageSize: number, theCatecoryId: number): Observable<GetResponseProducts> {

    //crear URL basada en la categoria, pagina y tamaño para la paginacion
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCatecoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //crear url basada en la categoria
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };

  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}