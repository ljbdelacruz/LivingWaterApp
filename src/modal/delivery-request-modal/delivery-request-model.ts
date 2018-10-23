import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
//viewmodels
import {PositionViewModel} from '../../models/positionViewModel.model'
import {ClientOrder} from '../../models/model.model'
//services
import {GeneralService} from '../../services/general.service'
@Component({
  selector: 'page-delivery-request-model',
  templateUrl: 'delivery-request-model.html',
})
export class DeliveryRequestModalPage {
  order:ClientOrder=new ClientOrder();
  bill:number=0;
  mapView:PositionViewModel=new PositionViewModel(0,0);
  event:any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams,
              private gs:GeneralService) {
              var data=this.navParams.get('userInfo');
              this.order=data.info.data;
              this.event=data.accept;
              console.log(this.order);
              this.bill=0;
              this.order.OrderedItems.forEach(item=>{
                this.bill+=item.Item.Price * item.Quantity;
              })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryRequestModelPage');
  }
  //mapevents
  TrackMovement(event){
    this.mapView.latitude=event.lat;
    this.mapView.longitude=event.lng;
  }
  //button events
  AcceptRequest(){
    this.gs.ShowAlertEvent("Are you Sure?", "Accept this Client Order Request?", "Ok", "Cancel",
    function(){
      this.event(this.order);
      this.viewCtrl.dismiss();
    }.bind(this), function(){}.bind(this));
  }
  CancelRequest(){
    this.viewCtrl.dismiss();
  }
}
