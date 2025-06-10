import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard', title: 'DASHBOARD', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'PRODUCTS', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/products/category', title: 'CATEGORY', type: 'link' },
				{ path: '/products/sub-category', title: 'SUBCATEGORY', type: 'link' },
				{ path: '/products/product-list', title: 'Product List', type: 'link' },
				{ path: '/products/add-product', title: 'ADD_PRODUCT', type: 'link' },
				{ path: '/products/tags', title: 'Tags', type: 'link' }
			]
		},
		{
			title: 'SALES', icon: 'dollar-sign', type: 'sub', active: false, children: [
				{ path: '/sales/orders', title: 'ORDERS', type: 'link' },
			]
		},
		{
			title: 'COUPONS', icon: 'tag', type: 'sub', active: false, children: [
				{ path: '/coupons/list-coupons', title: 'LIST_COUPONS', type: 'link' },
				{ path: '/coupons/create-coupons', title: 'CREATE_COUPONS', type: 'link' },
			]
		},
		{
			title: 'USERS', icon: 'user-plus', type: 'sub', active: false, children: [
				{ path: '/users/list-user', title: 'CUSTOMER_LIST', type: 'link' },
				{ path: '/users/list-employee', title: 'EMPLOYEE_LIST', type: 'link' },

				{ path: '/users/create-user', title: 'Create User', type: 'link' },
			]
		},

		{
			title: 'SETTINGS', icon: 'settings', type: 'sub', children: [
				{ path: '/settings/profile', title: 'PROFILE', type: 'link' },
			]
		},

		{
			title: 'LOGOUT', path: '/auth/login', icon: 'log-in', type: 'link', active: false
		}
	]
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

	
}
