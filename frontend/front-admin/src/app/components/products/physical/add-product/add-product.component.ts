import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../../product.service';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { element } from 'protractor';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public Editor = ClassicEditor;
  public counter: number = 1;
  active:any=1;
  categories:any;
  categoryId:any;
  subCategoryId:any='';
  subCategories:any;
  color:any;
  imagePreview:any="assets/images/pro3/1.jpg";

  public url = [{
    img: "assets/images/user.png",
  },
  {
    img: "assets/images/user.png",
  },
  {
    img: "assets/images/user.png",
  },
  {
    img: "assets/images/user.png",
  },
  {
    img: "assets/images/user.png",
  }
  ]

  images:any []=[];
  public productForm: UntypedFormGroup;
  public restrictionForm: UntypedFormGroup;
  public usageForm: UntypedFormGroup;
  specificationForm: UntypedFormGroup;
  inputArray: FormArray;
  specification:any []=[];

  constructor(private fb: UntypedFormBuilder, private productService:ProductService) {
   
    this.productService.getAllCategories().subscribe((data)=>{
      this.categories=data;
    })
    this.createProductForm();
    this.specificationForm=this.fb.group({});
  }
  createProductForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      code: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      size: ['', Validators.required],
      quantity:[1],
      categoryId: ['',Validators.required],
      subCategoryId: ['',Validators.required],
      specifications: this.fb.array([]),
    })
  }
  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

  //FileUpload
  readUrl(event: any, i) {

    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.images.push(event.target.files[0]);
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url[i].img = reader.result.toString();
      this.imagePreview=this.url[i].img;

    }
  }

  ngOnInit() {
   
  }
  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  onCategoryChange(){
    this.categoryId=this.productForm.get('categoryId').value;
    this.subCategoryId=null;
    this.productForm.get('subCategoryId').setValue("");
    this.productService.findSubCateogryOfCategory(this.categoryId).subscribe((data)=>{
      this.subCategories=data;
      
    });
    this.specification=[];
    this.specifications.clear();
  
  }

  setupSpecification (){
    let oldSpecification=this.specification;
    this.specification=[];
    let categoryId = this.productForm.get('categoryId').value;
    let subCategoryId = this.productForm.get('subCategoryId').value;

    // Find the category based on the ID
    let category = this.categories.find(element => element.id === categoryId);

    // Parse the specification from the category
    if(this.specifications.length>0){
      }
    this.specification = JSON.parse(category.specification);

    // If a subcategory is selected, append its specification to the main specification
    if (subCategoryId) {
      let subCategory = this.subCategories.find(element => element.id === subCategoryId);
      let subCategorySpecification = JSON.parse(subCategory.specification);
      this.specification = this.specification.concat(subCategorySpecification);
    }



    // Initialize form controls for each specification
    this.specification.forEach(field => {
      if(!oldSpecification.find(f=> f===field)){
      console.log(field)
    this.specifications.push(this.fb.control('', Validators.required));
      }
      });
    
       this.active=2;
  }

  setActiveNavItem(item: number){
    this.active=item;
    if(this.active===2){
      this.setupSpecification();
    }
  }

  addNewProduct (){
    const  productData:FormData = new FormData();
     const data=this.productForm.getRawValue();
     
  
    let specMap = new Map<string, string>();
    let specObject: { [key: string]: string } = {};

for (let i = 0; i < this.specification.length; i++) {
    let key = this.specification[i];
    let value = this.specifications.at(i).value;
    specObject[key] = value;
    // Add key-value pair to the Map
}

    data.specifications=specObject;
    // Append product data as a JSON string
    productData.append('productData', JSON.stringify(data));

    // Append each image file
    for (let i = 0; i < this.url.length; i++) {
      productData.append('images', this.images[i]);
   }

   this.productService.addProduct(productData).subscribe((data)=>{
    console.log(data);
   })
  }

  addNewSpecifiaction(){
    const newInput = new FormControl('');
    this.specifications.push(newInput)
  }
}
