import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { TableService } from 'src/app/shared/service/table.service';
import { UserService } from '../user.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-user-list',
  templateUrl: './customer-user-list.component.html',
  styleUrls: ['./customer-user-list.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class CustomerUserListComponent implements OnInit {

  public tableItem$: Observable<any[]>;
  public searchText;
  total$: Observable<number>;
  public userId: string;
  constructor(public service: TableService, private userService: UserService, private route: ActivatedRoute) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;

  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

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

  ngOnInit() {
    this.fetchData();
  }

  fetchData(){
    let params={
      sortActive: this.service.sortColumn,
      sortDirection: this.service.sortDirection,
      size: this.service.pageSize,
      page:this.service.page,
      filter: this.searchText,
      type: "CUSTOMER"
    };
    this.userService.getUsers(params).subscribe((response:HttpResponse<any[]>)=>{
      const totalElements = Number(response.headers.get('X-Total-Elements'));
      this.service.setTotalElements(totalElements);
      this.service.setUserData(response.body)    })
  }

  onPageChange(page){
    this.fetchData();
   }

   onPageSizeChange(){
    this.service.page=0;
    this.fetchData();
   }

 
}

