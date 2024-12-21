import { Injectable } from '@angular/core';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_SORT_ACTIVE, DEFAULT_SORT_DIRECTION } from './constants';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public cleanParams(params) {
    return Object.keys(params)
      .filter( key => params[key] != null && params[key] !== '')
      .reduce( (returnParam, key) => {
        returnParam[key] = params[key];
        return returnParam;
      }, {}) ;

  }

  public generatePageParams(allParams){
    const params: any = this.cleanParams(allParams);
    if (!params.page) {          params.page = DEFAULT_PAGE_INDEX; }
    if (!params.size) {          params.size = DEFAULT_PAGE_SIZE; }
    if (!params.sortActive) {    params.sortActive = DEFAULT_SORT_ACTIVE; }
    if (!params.sortDirection) { params.sortDirection = DEFAULT_SORT_DIRECTION; }
    params.sort = `${params.sortActive},${params.sortDirection}`;
    delete params.sortActive;
    delete params.sortDirection;
    if(params.page!=DEFAULT_PAGE_INDEX){
      params.page=params.page-1;
    }
    return params;
  }
}
