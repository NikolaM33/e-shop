import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Category } from '../../../../shared/tables/category';
import { NgbModal, ModalDismissReasons, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { ProductService } from '../../product.service';
import { SortDirection } from '../../../../shared/directives/NgbdSortableHeader';
import { debounceTime, map, share } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { base64ToFile } from 'src/app/components/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
  public closeResult: string;
  categoryName:string;
  categoryImage:File| undefined;

  searchText:any;
  tableItem$: Observable<Category[]>;
  total$: Observable<number>;
  private searchSubject = new Subject<string>();
  formGroupArray: FormGroup;
  inputArray: FormArray;
  active:boolean=true;
  newImage:boolean=false;
  category:Category;
  dropzoneConfig: any = {
    // Configuration options
    url: '/your-upload-url',
    maxFilesize: 1,
    acceptedFiles: 'image/*',
    // Add other configuration options as needed
  };
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: TableService, private modalService: NgbModal,
    private productService: ProductService, private formBuilder: FormBuilder) { 
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
  
    this.fetchData();
  


  }
  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300) 
    ).subscribe(() => {
      this.fetchData();
    }); 
    this.formGroupArray = this.formBuilder.group({
      inputArray: this.formBuilder.array([])
    });
    this.inputArray = this.formGroupArray.get('inputArray') as FormArray;
  }
  

  onSort({ column, direction }) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;

    this.fetchData();
  }

   onPageChange(page){
    this.fetchData();
   }

   onPageSizeChange(){
    this.service.page=0;
    this.fetchData();
   }

   addSpecifiaction(){
    const newInput = new FormControl('');
    this.inputArray.push(newInput);
   }

   removeSpecification(index:number){
    this.inputArray.removeAt(index);
   }

   onSelectionChange(value){
    this.active=value;
   }
  open(content, model?) {
    if(model){
      this.category= model;
      this.setUpFields();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.category=null;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  onSearchChange(){
    this.searchSubject.next(this.searchText)
  }

  onFileUploadSuccess(event: any): void {
    this.categoryImage = event.addedFiles[0];
    this.newImage=true;
  }

  saveNewCategory(){
    const categoryData: FormData= new FormData ();
    const data={
      name: this.categoryName,
      active: this.active, 
      specification:JSON.stringify(this.inputArray.value)
     }
    categoryData.append('categoryData',JSON.stringify(data))
    categoryData.append('image', this.newImage? this.categoryImage: null);
    if(this.category?.id){
      this.productService.editCateogry(this.category.id,categoryData).subscribe((data)=>{
        this.fetchData();
        this.modalService.dismissAll();
        this.category=null;
      })
    }else {
    this.productService.createNewCategory(categoryData).subscribe((data)=>{
      this.fetchData();
      this.modalService.dismissAll();
    });

  }
  this.clearAllFields();
  }

  onRemoveFile(){
    this.categoryImage=null;
  }

  fetchData (){
    let params={
      sortActive: this.service.sortColumn,
      sortDirection: this.service.sortDirection,
      size: this.service.pageSize,
      page:this.service.page,
      filter: this.searchText
    };

    this.productService.getCategories(params).pipe(
      map((response:  HttpResponse<any[]>) => {
        const totalElements = Number(response.headers.get('X-Total-Elements'));
        this.service.setTotalElements(totalElements);
        const transformedData: Category[] = response.body.map(item => {
          return {
            id: item.id,
            img: item.image,
            name: item.name,
            active: item.active,
            specification: item.specification
          };
        });
        return transformedData;
      })
    )
    .subscribe((data: Category[]) => {
      this.service.setUserData(data)
    });
  }

  deleteCategory(categoryId:number){
    this.productService.deleteCategory(categoryId).subscribe(()=>{
      this.fetchData();
    })
  }
  setUpFields(){
    this.clearAllFields();
    this.categoryName=this.category.name;
    this.active=this.category.active;
    this.categoryImage= base64ToFile(this.category.img, "image");
    let specification:any[]=JSON.parse(this.category.specification);
    specification.forEach(spec=>{
      let newControl = new FormControl(spec, Validators.required);
      newControl.setParent(this.inputArray);
      this.inputArray.push(newControl);
    })
  }

  clearAllFields(){
    this.categoryName=null;
    this.categoryImage=null;
    this.active=null;
    this.newImage=false;
    this.inputArray.clear();
  }
}
