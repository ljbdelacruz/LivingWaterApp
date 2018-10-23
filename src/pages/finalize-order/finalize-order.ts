import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//singleton services
import {GlobalDataService} from '../../services/singleton/globaldata.data'
//services
import {GeneralService} from '../../services/general.service'
import { UsersServices } from '../../services/requestServices/usersServices.service';
import {ClientService} from '../../services/requestServices/clientService.service';
//models
import {UsersViewModel, ClientOrder, ClientOrderLocation, CompanyViewModel, ClientOrderStatus} from '../../models/model.model';
@Component({
  selector: 'page-finalize-order',
  templateUrl: 'finalize-order.html',
})
export class FinalizeOrderPage {
  addressAddons:string="";
  noteOrder:string;
  userInfo:UsersViewModel=new UsersViewModel();
  mapView={lat:0, long:0};
  myLocation={lat:0, long:0};
  isLogin:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private gs:GlobalDataService, private gser:GeneralService,
              private clientS:ClientService, private storage:Storage) {
              if(this.gs.isLogin){
                  this.isLogin=gs.isLogin;
                  this.userInfo.set(this.gs.userLoginInfo);
              }
              this.AssignLocation(this.gs.userLocation.latitude, this.gs.userLocation.longitude);
              this.AssignMapView(this.gs.userLocation.latitude, this.gs.userLocation.longitude);
              var clientOrder=new ClientOrder();
              clientOrder.Owner=this.gs.userLoginInfo;
              clientOrder.Location=new ClientOrderLocation("", gs.userLocation.longitude, gs.userLocation.latitude);
              clientOrder.Status=gs.clientOrderStatus[0];
              clientOrder.OrderedItems=gs.orders;
              this.storage.get("addon").then(data=>{
                if(data!=null){
                  console.log(data);
                  this.gser.ShowAlertEvent("Do you want to use this address?", ""+data, "Yes", "No", function(){
                    this.addressAddons=data;
                  }.bind(this), function(){}.bind(this));
                }
              })
  }
  //functionalities
  AssignLocation(lat,long){
    this.myLocation.lat=lat;
    this.myLocation.long=long;
  }
  AssignMapView(lat, long){
    this.mapView.lat=lat;
    this.mapView.long=long;
  }
  //map functionalities
  TrackMovement(event){
    this.AssignMapView(event.lat, event.lng);
  }
  MovePoint(event){
    this.AssignLocation(event.coords.lat, event.coords.lng);
  }
  //button event
  Close(){
    this.navCtrl.pop();
  }
  Finalize(){
    var loading;
    this.gser.ShowLoadingCtrlInstance("Processing Order please wait...", function(object){
      loading=object;
    }.bind(this));
    this.gser
    this.gser.ShowAlertEvent("Info", "Are you sure that data you have input is valid and correct? we will process the order once the data is correct",
                             "Yes", "Cancel", function(){
                              loading.present();
                              this.CompileClientOrders(function(data:ClientOrder){
                                this.clientS.CreateCustomerOrder(data, function(resp){
                                  if(resp.success){
                                    this.storage.set("addon", this.addressAddons);
                                    this.gser.ShowAlert("Client Order Added! our branches can now see your order");
                                    this.gs.orders=[];
                                    loading.dismiss();
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                  }else{
                                    this.gser.ShowAlert(resp.message);
                                    loading.dismiss();                               
                                  }
                                }.bind(this), function(error){
                                  console.log(error);
                                  loading.dismiss();                               
                                });
                              }.bind(this))
                              }.bind(this), function(){}.bind(this));
  }

  CompileClientOrders(event){
    var clientOrder=new ClientOrder();
    clientOrder.Owner= new UsersViewModel();
    clientOrder.Owner.ID=this.gs.userLoginInfo.ID;
    clientOrder.Location=new ClientOrderLocation("", this.myLocation.long, this.myLocation.lat);
    clientOrder.Status=new ClientOrderStatus(this.gs.clientOrderStatus[0].ID, "");
    clientOrder.OrderedItems=this.gs.orders;
    clientOrder.MyOwner=new CompanyViewModel();
    clientOrder.MyOwner.ID=this.gs.appID;
    clientOrder.AdditionalAddressInfo=this.addressAddons;
    clientOrder.Note=this.noteOrder;
    event(clientOrder);
  }

}
