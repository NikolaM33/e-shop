import { Component, inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ProductService } from "../../product.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ActivatedRoute } from "@angular/router";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { Product } from "../../product";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  public Editor = ClassicEditor;
  public counter: number = 1;
  active: any = 1;
  categories: any;
  categoryId: any;
  subCategoryId: any = "";
  subCategories: any;
  color: any;
  imagePreview: any = "assets/images/pro3/1.jpg";

  public url = [];

  images: any[] = [];
  public productForm: UntypedFormGroup;
  public restrictionForm: UntypedFormGroup;
  public usageForm: UntypedFormGroup;
  specificationForm: UntypedFormGroup;
  inputArray: FormArray;
  productId: string;
  product: Product;
  specificationsArray: any[];
  categoryChanged: boolean = false;
  subCategoryChanged: boolean = false;
  oldSubCateogryId: any;
  tags:any[]=[];
  formatter = inject(NgbDateParserFormatter);

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private activeRoute: ActivatedRoute
  ) {
    activeRoute.params.subscribe((data) => {
      this.productId = data.id;
    });
    this.createProductForm();
    this.specificationForm = this.fb.group({});
    this.productService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
    this.productService.getAllTags().subscribe((data:any[])=>{
      this.tags=data;
   })
  }
  createProductForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0),Validators.max(100000)]],
      code: ['', [Validators.required]],
      brand: ['', Validators.required],
      quantity:[1],
      publish: [false, Validators.required],
      rent: [false],
      categoryId: ['',Validators.required],
      subCategoryId: ['',Validators.required],
      discount: [Validators.max(100), Validators.min(0)],
      discountStartDate: [{value: null, disabled: true}],
      discountEndDate: [{value: null, disabled: true}],
      tagId: [''],
      description:[],
      specifications: this.fb.array([]),
      sizes: this.fb.array([]),
      colors: this.fb.array([]),
      sizeColorMapping: this.fb.array([]),
    }, { validator: this.dateRangeValidator });
    this.productForm.get('discount')?.valueChanges.subscribe(value => {
      if (value) {
        // Enable date controls if discount has a value
        this.productForm.get('discountStartDate')?.enable();
        this.productForm.get('discountEndDate')?.enable();
      } else {
        // Disable date controls if discount is empty
        this.productForm.get('discountStartDate')?.disable();
        this.productForm.get('discountEndDate')?.disable();
      }
    });
  }

  increment() {
    this.productForm.get('quantity').setValue(this.productForm.get('quantity').value + 1);
  }

  decrement() {
    this.productForm.get('quantity').setValue(this.productForm.get('quantity').value - 1);
  }

  //FileUpload
  readUrl(event: any, i) {
    console.log(i)
    if (event.target.files.length === 0) return;
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
      this.product.images[i].src = reader.result.toString();
      this.imagePreview = this.product.images[i].src;
    };
  }

  ngOnInit() {
    this.productService.getProduct(this.productId).subscribe((data: any) => {
      this.product = data;
      this.setupForm();
    });
  }
  get specifications(): FormArray {
    return this.productForm.get("specifications") as FormArray;
  }

  onCategoryChange() {
    if (this.productForm.get("categoryId").value !== this.categoryId) {
      this.categoryId = this.productForm.get("categoryId").value;

      this.categoryChanged = true;

      this.subCategoryId = null;
      this.productForm.get("subCategoryId").setValue("");
      this.productService
        .findSubCateogryOfCategory(this.categoryId)
        .subscribe((data) => {
          this.subCategories = data;
        });
      this.specifications.clear();
      this.specificationsArray = [];
    }
  }

  onSubCategoryChanged() {
    if (this.productForm.get("subCategoryId").value !== this.subCategoryId) {
      this.oldSubCateogryId = this.subCategoryId;
      this.subCategoryId = this.productForm.get("subCategoryId").value;
      this.subCategoryChanged = true;
    }
  }

  setupSpecification() {
    if (this.categoryChanged) {

      let category = this.categories.find(
        (element) => element.id === this.categoryId
      );
      // Parse the specification from the category
      let categorySpecification: any[] = JSON.parse(category.specification);
      categorySpecification.forEach((element) => {
        this.specificationsArray.push({ key: element, value: "" });
      });
      this.specificationsArray.forEach((element) => {
        this.specifications.push(
          this.fb.control(element.value, Validators.required)
        );
      });

      this.categoryChanged = false;
    }

    if (this.subCategoryChanged) {
      let subcategory = this.subCategories.find(
        (element) => element.id === this.subCategoryId
      );

      let category = this.categories.find(
        (element) => element.id === this.categoryId
      );
      // Parse the specification from the category
      let categorySpecification: any[] = JSON.parse(category.specification);
      let subCategorySpecification: any[] = JSON.parse(
        subcategory.specification
      );

      for (
        let i = this.specificationsArray.length - 1;
        i >= categorySpecification.length;
        i--
      ) {
        this.specifications.removeAt(i);
        this.specificationsArray.splice(i, 1);
      }
      //add spec from subcategory
      subCategorySpecification.forEach((element) => {
        this.specificationsArray.push({ key: element, value: "" });
        this.specifications.push(
          this.fb.control(element.value, Validators.required)
        );
      });
      this.subCategoryChanged = false;
    }

    this.active = 2;
  }

  setActiveNavItem(item: number) {
    this.active = item;
    if (this.active === 2) {
      this.setupSpecification();
    }
  }

  updateProduct() {
    const productData: FormData = new FormData();
    const data = this.productForm.getRawValue();

    data.discountEndDate=this.formatter.format(data.discountEndDate);
    data.discountStartDate=this.formatter.format(data.discountStartDate);
    const specificationObject: { [key: string]: string } = {};

    for (let i = 0; i < this.product.specifications.length; i++) {
      this.product.specifications.at(i).value = this.specifications.at(i).value;
      const { key, value } = this.product.specifications[i];

      specificationObject[key] = value;
    }

    data.specifications = specificationObject;
    // Append product data as a JSON string
    productData.append("productData", JSON.stringify(data));

    // Append each image file
    //   for (let i = 0; i < this.url.length; i++) {
    //     productData.append('images', this.images[i]);
    //  }

    this.productService
      .updateProduct(this.product.id, productData)
      .subscribe((data) => {
      });
  }

  addNewSpecifiaction() {
    const newInput = new FormControl("");
    this.specifications.push(newInput);
  }

  setupForm() {
    console.log(this.product)
    this.categoryId = this.product.category;
    this.subCategoryId = this.product.subCategory;
    this.productService
      .findSubCateogryOfCategory(this.product.category)
      .subscribe((data) => {
        this.subCategories = data;
        this.productForm
          .get("subCategoryId")
          .setValue(this.product.subCategory);
      });

    this.productForm.get("categoryId").setValue(this.product.category);
    this.productForm.get("name").setValue(this.product.title);
    this.productForm.get("price").setValue(this.product.price);
    this.productForm.get("code").setValue(this.product.code);
    this.productForm.get("quantity").setValue(this.product.quantity);
    this.productForm.get("brand").setValue(this.product.brand);
    this.productForm.get("publish").setValue(this.product.publish);
    this.productForm.get("description").setValue(this.product.description);
    this.productForm.get("tagId").setValue(this.product.tag?.id);
    this.productForm.get("discount").setValue(this.product.discount);
    this.productForm.get("discountStartDate").setValue(this.formatter.parse(this.product.discountStartDate));
    this.productForm.get("discountEndDate").setValue(this.formatter.parse(this.product.discountEndDate));

 
    this.product.specifications.forEach((element) => {
      this.specifications.push(
        this.fb.control(element.value, Validators.required)
      );
    });
    if(this.product.images[0].src)
      this.imagePreview=this.product.images[0].src;
  };

  test(){
    console.log(this.productForm.valid, this.productForm)
  };

  dateRangeValidator(group: FormGroup) {
    const startDate = group.get('discountStartDate')?.value;
    const endDate = group.get('discountEndDate')?.value;

    if (startDate && endDate) {
      if (startDate > endDate) {
        return { invalidDateRange: true };
      }
    }

    return null;
  }

  goToNextTab (){
    if (this.active==1){
      this.setupSpecification();
    }else {
      this.active=3;
    }
  }

  get sizeFormArray(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  // Add a new size and quantity input group
  addSize() {
    const sizeGroup = this.fb.group({
      size: ['', Validators.required], // Custom size input
      quantity: [1, [Validators.required, Validators.min(1)]], // Default quantity is 1
    });
    this.sizeFormArray.push(sizeGroup);
  }

  // Remove a size and quantity input group
  removeSize(index: number) {
    this.sizeFormArray.removeAt(index);
  }
  get colorFormArray(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }

  // Add a new size and quantity input group
  addColor() {
    const colorGroup = this.fb.group({
      color: ['', Validators.required], // Custom size input
      quantity: [1, [Validators.required, Validators.min(1)]], // Default quantity is 1
    });
    this.colorFormArray.push(colorGroup);
  }

  // Remove a size and quantity input group
  removeColor(index: number) {
    this.colorFormArray.removeAt(index);
  }
  get sizeColorMapping(): FormArray {
    return this.productForm.get('sizeColorMapping') as FormArray;
  }

  updateSizeColorMapping() {
    this.sizeColorMapping.clear();
    this.sizeFormArray.controls.forEach(sizeControl => {
      this.colorFormArray.controls.forEach(colorControl => {
        this.sizeColorMapping.push(this.fb.group({
          size: sizeControl.get('size')?.value,
          color: colorControl.get('color')?.value,
          quantity: [0, [Validators.required, Validators.min(0)]]
        }));
      });
    });
  }
}
