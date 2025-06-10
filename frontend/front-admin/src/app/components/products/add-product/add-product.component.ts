import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../product.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public Editor = ClassicEditor;
  public counter: number = 1;
  active: any = 1;
  categories: any;
  categoryId: any;
  subCategoryId: any = '';
  subCategories: any;
  color: any;
  imagePreview: any = "assets/images/pro3/1.jpg";

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

  images: any[] = [];
  public productForm: UntypedFormGroup;
  public restrictionForm: UntypedFormGroup;
  public usageForm: UntypedFormGroup;
  specificationForm: UntypedFormGroup;
  inputArray: FormArray;
  specification: any[] = [];
  isEditing: boolean[] = [];
  tags: any[] = [];
  formatter = inject(NgbDateParserFormatter);

  constructor(private fb: UntypedFormBuilder, private productService: ProductService, private toastrService: ToastrService) {

    this.productService.getAllCategories().subscribe((data) => {
      this.categories = data;
    })
    this.createProductForm();
    this.specificationForm = this.fb.group({});
  }
  createProductForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      code: ['', [Validators.required]],
      brand: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0)]],
      publish: [false, Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      discount: [Validators.max(100), Validators.min(0)],
      discountStartDate: [{ value: null, disabled: true }],
      discountEndDate: [{ value: null, disabled: true }],
      tagId: [''],
      description: [],
      specifications: this.fb.array([]),
      sizes: this.fb.array([]),
      colors: this.fb.array([]),
      sizeColorMapping: this.fb.array([]),
      type: ["SALE", Validators.required]
    }, { validator: this.dateRangeValidator })
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
    this.sizeFormArray.valueChanges.subscribe(() => {
      this.updateSizeColorMapping();
    })
    this.colorFormArray.valueChanges.subscribe(() => {
      this.updateSizeColorMapping();
    })
  }
  increment() {
    this.productForm.get('quantity').setValue(this.productForm.get('quantity').value + 1);
  }

  decrement() {
    this.productForm.get('quantity').setValue(this.productForm.get('quantity').value - 1);
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
      this.imagePreview = this.url[i].img;

    }
  }

  ngOnInit() {
    this.productService.getAllTags().subscribe((data: any[]) => {
      this.tags = data;
    })
  }

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  onCategoryChange() {
    this.categoryId = this.productForm.get('categoryId').value;
    this.subCategoryId = null;
    this.productForm.get('subCategoryId').setValue("");
    this.productService.findSubCateogryOfCategory(this.categoryId).subscribe((data) => {
      this.subCategories = data;

    });
    this.specification = [];
    this.specifications.clear();

  }

  setupSpecification() {
    let oldSpecification = this.specification;
    this.specification = [];
    let categoryId = this.productForm.get('categoryId').value;
    let subCategoryId = this.productForm.get('subCategoryId').value;

    // Find the category based on the ID
    let category = this.categories.find(element => element.id === categoryId);

    // Parse the specification from the category
    if (category)
      this.specification = JSON.parse(category.specification);

    // If a subcategory is selected, append its specification to the main specification
    if (subCategoryId) {
      let subCategory = this.subCategories.find(element => element.id === subCategoryId);
      let subCategorySpecification = JSON.parse(subCategory.specification);
      this.specification = this.specification.concat(subCategorySpecification);
    }



    // Initialize form controls for each specification
    this.specification.forEach(field => {
      if (!oldSpecification.find(f => f === field)) {
        console.log(field)
        this.specifications.push(this.fb.control('', Validators.required));
      }
    });
    this.isEditing = new Array(this.specification.length).fill(false);
    this.active = 2;
  }

  setActiveNavItem(item: number) {
    this.active = item;
    if (this.active === 2) {
      this.setupSpecification();
    }
  }

  addNewProduct() {
    console.log(this.productForm)
    const productData: FormData = new FormData();
    const data = this.productForm.getRawValue();
    data.discountEndDate = this.formatter.format(data.discountEndDate);
    data.discountStartDate = this.formatter.format(data.discountStartDate);


    let specObject: { [key: string]: string } = {};

    for (let i = 0; i < this.specification.length; i++) {
      let key = this.specification[i];
      let value = this.specifications.at(i).value;
      specObject[key] = value;
      // Add key-value pair to the Map
    }
    data.specifications = specObject;
    data.discountStartDate = data.discountStartDate
    // Append product data as a JSON string
    productData.append('productData', JSON.stringify(data));

    // Append each image file
    for (let i = 0; i < this.url.length; i++) {
      productData.append('images', this.images[i]);
    }

    this.productService.addProduct(productData).subscribe((data) => {
      this.toastrService.success('Product has been added!');
      this.productForm.reset();
    })
  }

  addNewSpecifiaction() {
    const newInput = new FormControl('');
    this.specifications.push(newInput);
    this.specification.push('');
    this.isEditing.push(true)
  }

  resetForm() {
    this.productForm.reset();
  }

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

  goToNextTab() {
    if (this.active == 1) {
      this.setupSpecification();
    } else {
      this.active = 3;
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
