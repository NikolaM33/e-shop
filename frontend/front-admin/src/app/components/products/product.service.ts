import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageService } from '../page.service';
import { UtilService } from '../util.service';
import { environment } from 'src/environments/environment';
import { env } from 'process';
import { Environment } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
    private pageService: PageService,
    private utilService: UtilService){
    }

    createNewCategory(data: FormData){
     return  this.http.post(environment.apiUrl+'/category', data)
    }

    getCategories (params){
      return this.http.get(environment.apiUrl+'/category',{
        params: this.utilService.generatePageParams(params),
        observe: 'response'

      })
    }

    deleteCategory(categoryId:number){
      return this.http.delete(environment.apiUrl+'/category/'+categoryId);
    }

    editCateogry(categoryId:string, data:any){
      return this.http.put(environment.apiUrl+'/category/'+categoryId, data);
    }

    getAllCategories(){
      return this.http.get(environment.apiUrl+'/category/all');
    }

    createNewSubCateogry(data:FormData){
      return this.http.post(environment.apiUrl+'/sub-category',data)
    }
    getSubCategories(params){
      return this.http.get(environment.apiUrl+'/sub-category',{
        params: this.utilService.generatePageParams(params),
        observe: 'response'
      })
    }

    editSubCategory (subCategoryId:string, data:any){
      return this.http.put(environment.apiUrl+'/sub-category/'+subCategoryId, data);
    }

    deleteSubCategory(subCategoryId:string){
      return this.http.delete(environment.apiUrl+'/sub-category/'+subCategoryId);
    }

    findSubCateogryOfCategory (categoryId:string){
      return this.http.get(environment.apiUrl+'/category/'+categoryId+'/sub-category');
    }

    addProduct(data: FormData){
      return this.http.post(environment.apiUrl+'/product',data);
    }

    getProducts (params){
      return this.http.get(environment.apiUrl+'/product',{
        params: this.utilService.generatePageParams(params),
        observe: 'response'

      })
    }
    getProduct (productId: string){
      return this.http.get(environment.apiUrl+'/product/'+productId)
    }

    updateProduct(productId:string, data:FormData){
      return this.http.put(environment.apiUrl+"/product/"+productId,data);
    }

  
}
