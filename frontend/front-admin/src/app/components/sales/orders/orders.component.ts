import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'src/app/shared/directives/shorting.directive';
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from 'src/app/shared/service/table.service';
import { debounceTime, Observable, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../products/product.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [TableService, DecimalPipe],
})

export class OrdersComponent implements OnInit {
  public closeResult: string;
  public tableItem$: Observable<any[]>;
  public searchText;
  total$: Observable<number>;
  public orderStatusList:string[] = ["PROCESSING", "SHIPPED", "DELIVERED", "READY_FOR_PICKUP", "CANCELED", "PENDING_APPROVAL"];
  public selectedOrder:any;
  private searchSubject = new Subject<string>();
  
  constructor(public service: TableService, private modalService: NgbModal, private productService: ProductService) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  ngOnInit() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
          this.fetchData();
        });

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
    this.fetchData();

  }

  open(content, order) {
    this.selectedOrder = order;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
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

  private fetchData() {
    let params={
      sortActive: this.service.sortColumn,
      sortDirection: this.service.sortDirection,
      size: this.service.pageSize,
      page:this.service.page,
      filter: this.searchText
    };
      this.productService.getOrders(params).subscribe((response:HttpResponse<any[]>)=>{
        const totalElements = Number(response.headers.get('X-Total-Elements'));
        this.service.setTotalElements(totalElements);
        this.service.setUserData(response.body)
      })
   
  }

  onPageChange(page){
    this.fetchData();
   }

   onPageSizeChange(){
    this.service.page=0;
    this.fetchData();
   }
  onSearchChange() {
    this.searchSubject.next(this.searchText)
  }

 updateOrderStatus(){
    this.productService.updateOrderStatus(this.selectedOrder.id, this.selectedOrder.status).subscribe((data:any)=>{
     this.modalService.dismissAll();
     this.fetchData();
    })
 }
}
