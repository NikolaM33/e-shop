import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  readonly defaultSize = 1000;

  constructor(private http:HttpClient,private utilService:UtilService) { }

  /**
   * Makes get all request from pageable request.
   *
   * If you have error like 'http is undefined' or 'Cannot read property 'get' of undefined' you must
   * bind that function(request) in service. For other question you can call me for help.
   * Sinisa Bozic
   *
   * @param request Request from service with declaration -> functionName(page, size, otherParameters...).
   * @param params Params for request (other parameters). They must be in array. Params are optional.
   * @param size Size of page. Size is optional and default is 100.
   */
  getAllFromPageable(request:Function, params?:Array<any>, size?:number ){
    const data = {
      request : request,
      size : size || this.defaultSize,
      params : params || [],
      page : 0,
      totalPages : 1,
      result : [],
      subject :new Subject<any>()
    };
    this.fetchDataRecursively(data);
    return data.subject;
  }

  /**
   * If page is last emmit subject, else do recursively request
   *
   */
  private fetchDataRecursively(data:any){
    if( data.page >= data.totalPages ){
      data.subject.next(data.result);
      data.subject.complete();
      return;
    }
    data.request(data.page,data.size, ...data.params).subscribe((response:any)=>{
      data.result.push(...response.body);
      data.page++;
      const totalPages = +response.headers.get('X-total-pages');
      if(data.totalPages !=  totalPages && data.page > 1){
        data.page = 0;
        data.result = [];
      }
      data.totalPages = totalPages;
      this.fetchDataRecursively(data);
    });

    return;
  }

  // IMPORTANT these two methods are very similiar as previous two methods and it is better approach!!!
  // TODO make all get page request like this!!!
  /**
   * Makes get all request from pageable request.
   *
   * If you have error like 'http is undefined' or 'Cannot read property 'get' of undefined' you must
   * bind that function(request) in service. For other question you can call me for help.
   * Sinisa Bozic
   *
   * @param url Request from service with declaration -> functionName(params).
   * @param params Params for request (other parameters). Params is type of object. Params is optional.
   * @param size Size of page. Size is optional and default is 100.
   */
  getAll(url:string, params?:any , size?:number ){
    if(!params) params = {};
    params.size = size || this.defaultSize;
    params.page = 0;
    const data = {
      url : url,
      params : this.utilService.generatePageParams(params),
      totalPages : 1,
      result : [],
      subject :new Subject<any>()
    };
    this.fetchRecursively(data);
    return data.subject;
  }

  /**
   * If page is last emmit subject, else do recursively request
   *
   */
  private fetchRecursively(data:any){
    if( data.params.page >= data.totalPages ){
      data.subject.next(data.result);
      data.subject.complete();
      return;
    }
    this.http.get(data.url, { params: data.params, observe: 'response' }).subscribe((response:any)=>{
      data.result.push(...response.body);
      data.params.page++;
      const totalPages = +response.headers.get('X-total-pages');
      if(data.totalPages !=  totalPages && data.params.page > 1){
        data.params.page = 0;
        data.result = [];
      }
      data.totalPages = totalPages;
      this.fetchRecursively(data);
    });

    return;
  }


}
