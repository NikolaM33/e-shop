import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

tags: any []=[];
tagIDForEdit:string;
tagTitle:any;

  public settings = {
    actions: {
      position: 'right'
    },
    columns: {
      tag: {
        title: 'Tag',
      },
    
    },
  };

  constructor ( private modalService: NgbModal, private productService: ProductService){
  
  }

  ngOnInit(){
    
    this.fetchData();
  }

  open(content, model?) {
    if(model){
      console.log(model);
      this.tagTitle=model.title;
      this.tagIDForEdit=model.id;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      
    }, (reason) => {
      this.tagIDForEdit=null;
      this.tagTitle=null;
    });
  }

  saveNewTag(){
    if(this.tagIDForEdit!=null){
      this.productService.updateTag(this.tagIDForEdit,this.tagTitle).subscribe((data=>{
        this.modalService.dismissAll();
        this.fetchData();
      }));

    }else {
    this.productService.addTag(this.tagTitle).subscribe((data=>{

      this.modalService.dismissAll();
      this.fetchData();
       }));
    }
 }

 deleteTag(tagId: string){
  this.productService.deleteTag(tagId).subscribe((data=>{
    this.fetchData();
  }))
 }

   private fetchData(){
    this.productService.getAllTags().subscribe((data:any[])=>{
      this.tags=data;
    })
  }
}
