import { Injectable } from '@angular/core';
//viewmodel
import {UsersViewModel, ClientOrder, OrderedItems, Item, ClientOrderStatus} from '../../models/model.model';
import {PositionViewModel} from '../../models/positionViewModel.model';

@Injectable()
export class GlobalDataService {
    //companyID
    public appID="9ac13294-5b2a-426b-a262-449f61107e7e";
    public userCreateAID:string="a2e2d83d-dd8d-4a66-bacf-94ad90344ca7";
    //determines if employee app then it will show employee shit else show client side
    public isEmployeeApp=false;
    public isLogin:boolean=false;
    //radius of data that this user can see
    public radius:number=0.1;
    public userLoginInfo:UsersViewModel=new UsersViewModel();
    // public url:string="http://192.168.1.4:80/";
    public url:string="http://geoperson01-001-site1.dtempurl.com/";
    public userLocation:PositionViewModel=new PositionViewModel(0,0);
    //list of products for sale
    public items:Item[]=[new Item("9ac13294-5b2a-426b-a262-449f61107e7e", "5 Gal Slim", 67.86, "", [])];    
    public myItems:Item[]=[];
    //items with quantity
    public orderedItems:OrderedItems[]=[new OrderedItems("",0, this.items[0])];    
    public clientOrderStatus:ClientOrderStatus[]=[new ClientOrderStatus("a3c49505-a980-4c46-9d70-438ecc9b6b79", "Waiting"), 
                                                  new ClientOrderStatus("944bcd9b-60bb-42de-90aa-0cb130e7e13f", "Cancelled")];
    //contains the client orders (cart)
    public orders:OrderedItems[]=[];
    clientOrders:ClientOrder=new ClientOrder();
    transactionHistory:ClientOrder[]=[];
    //client orders ()
    public processingOrderedItems:ClientOrder[];
    //branch variables
    //list of customers within your area
    public customerLists:ClientOrder[]=[];
    public acceptedCustomers:ClientOrder[]=[];
    //viewHistory orders
    public viewOrderHistory:ClientOrder[]=[];
    public viewMyOrders:ClientOrder[]=[]; 
}