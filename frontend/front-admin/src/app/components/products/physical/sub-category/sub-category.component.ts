import { DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable, Subject, debounceTime, map } from 'rxjs';
import { Category } from 'src/app/shared/tables/category';
import { TableService } from '../../../../shared/service/table.service';
import { SortEvent } from '../../../../shared/directives/shorting.directive';
import { NgbdSortableHeader } from "../../../../shared/directives/NgbdSortableHeader";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../product.service';
import { HttpResponse } from '@angular/common/http';
import { SubCategory } from 'src/app/shared/tables/sub-category';
import { base64ToFile } from 'src/app/components/util.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss'],
  providers: [TableService, DecimalPipe],
})


export class SubCategoryComponent {
  public closeResult: string;
  searchText;
  tableItem$: Observable<Category[]>;
  total$: Observable<number>;
  subCategoryName:string;
  active:boolean=true;
  subCategoryImage: File | undefined;
  private searchSubject = new Subject<string>();
  formGroupArray: FormGroup;
  inputArray: FormArray;
  categories:any;
  categoryId:any='';
  newImage:boolean=false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  subCategory:SubCategory;

  constructor(public service: TableService, private modalService: NgbModal,private formBuilder: FormBuilder,
    private productService: ProductService) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;

    this.fetchData();
  }
  ngOnInit (){
    this.searchSubject.pipe(
      debounceTime(300) 
    ).subscribe(() => {
      this.fetchData();
    }); 
    this.formGroupArray = this.formBuilder.group({
      inputArray: this.formBuilder.array([])
    });
    this.inputArray = this.formGroupArray.get('inputArray') as FormArray;

    this.productService.getAllCategories().subscribe((data)=>{
      this.categories=data;
    })
  }


  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

  }

  open(content, model?) {
    if(model){
      this.subCategory= model;
      this.setUpFields();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setUpFields(){
    this.clearAllFields();
    this.subCategoryName=this.subCategory.name;
    this.active=this.subCategory.active;
    this.categoryId=this.subCategory.categoryId;
    this.subCategoryImage= base64ToFile(this.subCategory.img, "image");
    let specification:any[]=JSON.parse(this.subCategory.specification);
    specification.forEach(spec=>{
      let newControl = new FormControl(spec, Validators.required);
      newControl.setParent(this.inputArray);
      this.inputArray.push(newControl);
    })
  }

  clearAllFields(){
    this.subCategoryName=null;
    this.subCategoryImage=null;
    this.categoryId=null;
    this.active=null;
    this.newImage=false;
    this.inputArray.clear();
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

   onFileUploadSuccess(event: any): void {
    this.subCategoryImage = event.addedFiles[0];
    this.newImage=true;
  }
  
  onRemoveFile(){
    this.subCategoryImage=null;
  }

  addSpecifiaction(){
    const newInput = new FormControl('');
    this.inputArray.push(newInput);
   }

   removeSpecification(index:number){
    this.inputArray.removeAt(index);
   }

   fetchData(){
    let params={
      sortActive: this.service.sortColumn,
      sortDirection: this.service.sortDirection,
      size: this.service.pageSize,
      page:this.service.page,
      filter: this.searchText
    };

    this.productService.getSubCategories(params).pipe(
      map((response:  HttpResponse<any[]>) => {
        const totalElements = Number(response.headers.get('X-Total-Elements'));
        this.service.setTotalElements(totalElements);
        const transformedData: SubCategory[] = response.body.map(item => {
          return {
            id: item.id,
            img: item.image,
            name: item.name,
            active: item.active,
            specification: item.specification,
            categoryId: item.categoryId,
            categoryName: item.categoryName
          };
        });
        return transformedData;
      })
    )
    .subscribe((data: Category[]) => {
      this.service.setUserData(data)
    });
   }

   saveNewSubCategory(){
    const subCategoryData: FormData= new FormData ();
    console.log(this.categoryId)
    console.log(this.categories)
    const data={
      name: this.subCategoryName,
      active: this.active, 
      specification:JSON.stringify(this.inputArray.value),
      categoryId: this.categoryId
     }
    subCategoryData.append('subCategoryData',JSON.stringify(data))
    subCategoryData.append('image', this.newImage? this.subCategoryImage:null);
      if(this.subCategory?.id!=null){
        this.productService.editSubCategory(this.subCategory.id,subCategoryData).subscribe((data)=>{
          this.fetchData();
          this.modalService.dismissAll();
          this.subCategory=null;
        })
      }else {
        this.productService.createNewSubCateogry(subCategoryData).subscribe((data)=>{
          this.fetchData();
          this.modalService.dismissAll();
        });
      }
    this.clearAllFields();
   }
   onPageChange(page){
    this.fetchData();
   }

   onPageSizeChange(){
    this.service.page=0;
    this.fetchData();
   }

   deleteSubCategory(subCateogryId:string){
    this.productService.deleteSubCategory(subCateogryId).subscribe((data)=>{
      this.fetchData();
    })
   }
}
