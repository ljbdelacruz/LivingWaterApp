import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
//services
import {GeneralService} from '../../services/general.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data'
//pages
import {FinalizeOrderPage} from '../finalize-order/finalize-order'
//viewmodel
import {OrderedItems} from '../../models/model.model'
//myorders contains the items that is available for ordering
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {
  myList=[];
  totalBill:number=0;
  url:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public gs:GlobalDataService, private alertCtrl:AlertController,
              private gser:GeneralService) {
                this.gs.orders.forEach(item=>{
                  this.myList.push(item);
                })
                console.log(this.gs.orders);
                this.CalculateBill();
                this.url=this.gs.url;
  }
  ionViewDidLoad() {
  }
  //button events
  Close(){
    this.navCtrl.pop();
  }
  Finalize(){
    this.gser.ShowAlertEvent("Confirm Purchase", "Is this all the items you want to order?", 
                            "Yes", "Cancel", function(){
                              if(this.gs.orders.length>0){
                                console.log(this.gs.orders);
                                this.navCtrl.push(FinalizeOrderPage);
                              }else{
                                this.gser.ShowAlert("Sorry no items to check out");
                              }
                            }.bind(this), function(){}.bind(this))
  }
  ButtonSubClick(item:OrderedItems){
    if(item.Quantity<=1){
      //removes the item if quantity is 0
      item.Quantity--;
      var index=this.gs.orders.findIndex(d=>d.Item.ID == item.Item.ID);
      this.gs.orders.splice(index, 1);
      this.CalculateBill();
    }else{
      item.Quantity--;
      this.CalculateBill();
    }
    
  }
  ButtonAddClick(item:OrderedItems){
    item.Quantity++;
    this.CalculateBill();
  }

  //functionalities
  CalculateBill(){
    this.totalBill=0;
    this.gs.orders.forEach(item=>{
      this.totalBill+=item.Item.Price*item.Quantity;
      this.totalBill=Number(this.totalBill.toFixed(2));
    });
  }
}
