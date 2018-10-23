import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//services
import {GeneralService} from '../../services/general.service'
//singleton services
import {GlobalDataService} from '../../services/singleton/globaldata.data';
//pages
import {MyOrdersPage} from '../my-orders/my-orders'
//viewmodel
import {OrderedItems, ClientOrder} from '../../models/model.model'
@Component({
  selector: 'page-view-orders',
  templateUrl: 'view-orders.html',
})
//contains items that can be ordered by users

export class ViewOrdersPage {
  url:string="";
  totalBill:number=0;
  items:OrderedItems[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private gs:GlobalDataService, private gser:GeneralService) {
    this.gs.orderedItems.forEach(item=>{
      this.items.push(item);
    })
    this.ResetQuantity();
    this.CalculateBill();
    this.url=this.gs.url;
  }
  ionViewDidLoad() {
  }
  //button event
  Close(){
    this.navCtrl.pop();
  }
  SaveOrders(){
    var itemAdded=this.items.filter((item) => {
      return (item.Quantity>0);
    });
    if(itemAdded.length>0){
      itemAdded.forEach(item=>{
        //check if item already in the orders
        var isExist=this.gs.orders.filter(order=>{
          return order.Item.ID==item.Item.ID
        })
        //if exist then add quantity
        if(isExist.length>0){
          isExist.forEach(x=>{
            x.Quantity+=item.Quantity;
          })
        }else{
          //add the orderItem to orders
          this.gs.orders.push(new OrderedItems("", item.Quantity, item.Item));
        }
      })
      // this.ResentQuantity();
      this.gser.ShowAlert("Successfully added the items to cart");
      this.navCtrl.pop();
      this.navCtrl.push(MyOrdersPage);
    }else{
      this.gser.ShowAlert("Please add an item");
    }
  }
  ResetQuantity(){
    this.items.forEach(item=>{
      item.Quantity=0;
    })
  }
  ShowCart(){
    this.navCtrl.push(MyOrdersPage);
  }
  ButtonAddClick(item:OrderedItems){
    item.Quantity++;
    this.CalculateBill();
  }
  ButtonSubClick(item:OrderedItems){
    if(item.Quantity>0){
      item.Quantity--;
      this.CalculateBill();
    }
  }
  //functionalities
  CalculateBill(){
    this.totalBill=0;
    this.gs.orderedItems.forEach(item=>{
      this.totalBill+=item.Item.Price*item.Quantity;
      this.totalBill=Number(this.totalBill.toFixed(2));
    });
  }
}
