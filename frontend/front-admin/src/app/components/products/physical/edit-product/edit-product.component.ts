import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ProductService } from "../../product.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ActivatedRoute } from "@angular/router";
import { element } from "protractor";
import { environment } from "src/environments/environment";

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
  product: any;
  specificationsArray: any[];
  categoryChanged: boolean = false;
  subCategoryChanged: boolean = false;
  oldSubCateogryId: any;

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
  }
  createProductForm() {
    this.productForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      price: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      code: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      size: ["", Validators.required],
      quantity: [1],
      categoryId: ["", Validators.required],
      subCategoryId: ["", Validators.required],
      specifications: this.fb.array([]),
    });
  }
  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

  //FileUpload
  readUrl(event: any, i) {
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
      this.url[i].img = reader.result.toString();
      this.imagePreview = this.url[i].img;
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
    const specificationObject: { [key: string]: string } = {};

    for (let i = 0; i < this.specificationsArray.length; i++) {
      this.specificationsArray.at(i).value = this.specifications.at(i).value;
      const { key, value } = this.specificationsArray[i];

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
        console.log(data);
      });
  }

  addNewSpecifiaction() {
    const newInput = new FormControl("");
    this.specifications.push(newInput);
  }

  setupForm() {
    this.categoryId = this.product.categoryId;
    this.subCategoryId = this.product.subCategoryId;
    this.productService
      .findSubCateogryOfCategory(this.product.categoryId)
      .subscribe((data) => {
        this.subCategories = data;
        this.productForm
          .get("subCategoryId")
          .setValue(this.product.subCategoryId);
      });

    this.productForm.get("categoryId").setValue(this.product.categoryId);
    this.productForm.get("name").setValue(this.product.name);
    this.productForm.get("price").setValue(this.product.price);
    this.productForm.get("code").setValue(this.product.code);
    this.productForm.get("quantity").setValue(this.product.quantity);

    this.specificationsArray = Object.entries(this.product.specifications).map(
      ([key, value]) => ({ key, value })
    );
    this.specificationsArray.forEach((element) => {
      this.specifications.push(
        this.fb.control(element.value, Validators.required)
      );
    });
    for (let i = 1; i <= 6; i++) {
      if (this.product[`image${i}FileIdentifier`] !== null) {
        this.url.push({
          ["img"]: `${environment.publicS3Url}/product/${
            this.product[`image${i}FileIdentifier`]
          }`,
        });
      } else {
        this.url.push({ ["img"]: "assets/images/user.png" });
      }
    }
  }
}
