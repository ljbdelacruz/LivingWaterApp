import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//services
import {GeneralService} from '../../services/general.service'
import {ClientService} from '../../services/requestServices/clientService.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data'
//viewmodels
import {ClientOrder} from '../../models/model.model'

//displays the status and stuff of the current active user order
@Component({
  selector: 'page-user-order',
  templateUrl: 'user-order.html',
})
export class UserOrderPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private gs:GeneralService, private clientS:ClientService,
              private gsData:GlobalDataService) {
      this.GetPendingClientOrder();
  }
  //items
  items=[{id:1, status:'Pending', 
  orders:[{id:1, name:'5 Gal Round', quantity:3, source:'assets/imgs/logo.png'},
          {id:2, name:'5 Gal Slim', quantity:2, source:'assets/imgs/logo.png'}]}]
  //button events
  Close(){
    this.navCtrl.pop();
  }
  MarkedDelivered(item){
    this.gs.ShowAlertEvent("Are you sure?", 
                            "Do you want to mark this order delivered? our delivery branch will not see this request in their map anymore",
                          "Yes", "Cancel", function(){
                            this.gs.ShowAlert("Item Delivered!");
                            var index=this.items.findIndex(d=>d.id == item.id);
                            this.items.splice(index, 1);
                          }.bind(this), function(){

                          }.bind(this))
  }
  pendingClientOrders:ClientOrder[]=[];
  GetPendingClientOrder(){
    console.log(this.gsData.userLoginInfo.ID);
    this.clientS.GetClientOrderByOwnerIDStatusID(this.gsData.userLoginInfo.ID, "a3c49505-a980-4c46-9d70-438ecc9b6b79", 
    function(resp){
      console.log(resp);
      resp.data.forEach(element => {
        this.pendingClientOrders.push(element);
      });
      console.log(this.pendingClientOrders);
    }.bind(this), function(data){
      console.log(data);
    }.bind(this))
  }

}
