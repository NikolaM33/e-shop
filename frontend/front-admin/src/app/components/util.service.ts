import { Injectable } from '@angular/core';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_SORT_ACTIVE, DEFAULT_SORT_DIRECTION } from './constants';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public generateGetParams(page, pageSize, sortActive?: string, sortDirection?: string, filter?: string, released?: boolean, language?: number) {

    if (sortActive == '' || sortActive == null) {
      sortActive = DEFAULT_SORT_ACTIVE;
    }
    if (sortDirection == '' || sortDirection == null) {
      sortDirection = DEFAULT_SORT_DIRECTION;
    }

    const params = {
      page: page || 0,
      size: pageSize || 20,
    };

    let sort = sortActive + ',' + sortDirection
    params['sort'] = sort;

    if (filter && filter !== '') {
      params['filter'] = filter;
    } else {
      params['filter'] = '';
    }
    if (released) {
      params['released'] = true;
    }
    if (language) {
      params['language'] = language;
    }
    return params;
  }

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

  public getDate(formControl) {
    if (formControl.value._i != null && formControl.value._i != '') {
      const date = formControl.value._i;
      const year = date.year;
      let month;
      let day;
      month = +date.month + 1;
      if (month < 10) {
        month = '0' + month;
      }
      if (+formControl.value._i.date < 10) {
        day = '0' + formControl.value._i.date;
      } else {
        day = formControl.value._i.date;
      }
      return year + '-' + month + '-' + day;
    } else {
      return formControl.value;
    }
  }

  public convertBase64StringToBlob(base64String) {
    const byteString = window.atob(base64String);
    const int8Array = new Uint8Array(new ArrayBuffer(byteString.length));

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], {type: 'image/jpg'});
  }

  public getArrayObjectByAttributeValue(array, attrName, attrValue) {
    for (const item of array) {
      if (item.hasOwnProperty(attrName) && item[attrName] === attrValue) {
        return item;
      }
    }
    return null;
  }
  
}
export function base64ToFile(base64String: string, fileName: string): File {
  const arr = base64String.split(',');
  const mimeType = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mimeType });
}