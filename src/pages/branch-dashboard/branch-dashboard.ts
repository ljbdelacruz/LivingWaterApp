import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, PopoverController, ModalController } from 'ionic-angular';
import { hubConnection } from 'signalr-no-jquery';
import {Storage} from '@ionic/storage'
//services
import {GeneralService} from '../../services/general.service'
import {ClientService} from '../../services/requestServices/clientService.service'
import {LocationService} from '../../services/requestServices/locationService.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data'
//components
import {PopupMenuComponent} from '../../components/popupMenu1/popMenu1.components';
//viewmodel
import {ClientOrder} from '../../models/model.model'
import {PositionViewModel} from '../../models/positionViewModel.model'
//pages
import {DeliveryRequestModalPage} from '../../modal/delivery-request-modal/delivery-request-model'
import {TutorialsPage} from '../tutorials/tutorials'
@Component({
  selector: 'page-branch-dashboard',
  templateUrl: 'branch-dashboard.html',
})
export class BranchDashboardPage {
  mapView={lat:0, long:0};
  minimumOrders:number=130;
  isOnJob:boolean=false;
  isActiveView:boolean=true;

  myLocation:PositionViewModel=new PositionViewModel(0,0);
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public menuCtrl:MenuController, private gser:GeneralService,
              private popCtrl:PopoverController, private clientS:ClientService,
              private gs:GlobalDataService, private modalCtrl:ModalController,
              private storage:Storage, private locationS:LocationService) {
                var load;
                this.gser.ShowLoadingCtrlInstance("Getting Location Please Wait", function(object){
                  load=object;
                }.bind(this))
                load.present();
                this.gser.GetCurrentLocation(function(data){
                  this.AssignMyLocation(data.lat, data.long);
                  this.AssignView(data.lat,data.long);
                  this.GetCustomers(data.long,data.lat);
                  //listen to request
                  this.ListenRequest();
                  //updates this users location interval
                  this.UpdateLocationInterval();
                  load.dismiss();
                  this.TrackUserLocation();
                }.bind(this), function(message){
                  this.gser.ShowAlert(message);
                  load.dismiss();
                }.bind(this))
                //loads client on progress
                this.LoadOnProgressClientOrders();
  }
  //page life cycle
  ionViewDidLoad() {

  }
  ionViewDidEnter(){
    this.isActiveView=true;
  }
  ionViewWillLeave() {
    this.isActiveView=false;
  }
  //get customers within your location
  customersOnQueue:ClientOrder[]=[];
  GetCustomers(long, lat){
    this.gs.customerLists=[];
    this.customersOnQueue=[];
    this.clientS.GetClientOrdersByLocation(long, lat, this.gs.radius, this.gs.appID, function(data){
      data.data.forEach(element => {
        var temp=new ClientOrder();
        temp.set(element);
        element.OrderedItems.forEach(item => {
          temp.TotalBill+=item.Quantity * item.Item.Price;
        });
        this.gs.customerLists.push(temp);
        this.customersOnQueue.push(temp);
      });
    }.bind(this),function(error){
    }.bind(this))
  }

  //button event
  ToggleMenu(){
    this.menuCtrl.open();
  }
  viewMorePopover;
  ViewMoreOption(event){
    this.viewMorePopover = this.popCtrl.create(PopupMenuComponent, {invoke:{buttons:[{label:'Request Orders', value:1}, {label:'List of Delivery', value:2}],
    buttonEvent:this.popupButtonEvent.bind(this), title:''}});     
    this.viewMorePopover.present({
      ev: event
     });   
  }
  ViewTutorial(){
    this.menuCtrl.toggle().then(item=>{
      this.navCtrl.push(TutorialsPage);
    })
  }
  isAcceptedView=false;
  popupButtonEvent(value){
    switch(value){
      case 1:
        this.gser.ShowAlert("Client Orders Accepted Displayed!");
        this.isAcceptedView=false;
        break;
      case 2:
      this.gser.ShowAlert("Client Orders On Queue Displayed!");
        this.isAcceptedView=true;
        break;
    }
  }
  Logout(){
    this.menuCtrl.toggle().then(item=>{
      this.storage.set("username", null);
      this.storage.set("password", null);
      this.CloseObservable();

      this.navCtrl.pop();
    })
  }
  //accepted location
  acceptedLocation:ClientOrder[] =[];
  //map events
  TrackMovement(event){
    this.mapView.lat=event.lat;
    this.mapView.long=event.lng;
  }
  MovePoint(event){
    // this.AssignMyLocation(event.coords.lat, event.coords.lng);
  }
  AssignView(lat, long){
    this.mapView.lat=lat;
    this.mapView.long=long;
  }
  AssignMyLocation(lat, long){
    this.myLocation.latitude=lat;
    this.myLocation.longitude=long;
  }
  //signalR listeners
  uniqueID:string="";
  ListenRequest(){
    const connection2 = hubConnection(this.gs.url);
    var clientRequestHub = connection2.createHubProxy('clientHub');
    //listener
    clientRequestHub.on('NewClient', function(posX:number, posY:number, coID:string, appID:string) {
      //here check if the client is within your radius 
      if(( posX >=this.myLocation.longitude-this.gs.radius && posX<= this.myLocation.longitude+this.gs.radius )
        &&( posY>=this.myLocation.latitude-this.gs.radius && posY<= this.myLocation.latitude+this.gs.radius) 
        && this.gs.appID == appID && coID != this.uniqueID){
          this.uniqueID=coID;
          var observe=this.gser.ObservableIntervalSubscribe(1000, function(){
            this.uniqueID="";
            observe.unsubscribe();
          }.bind(this))
          if(!this.isOnJob){
            // first get information about the client request
            this.clientS.GetCustomerOrderByID(coID, function(resp){
              var temp=new ClientOrder();
              temp.set(resp.data);
              resp.data.OrderedItems.forEach(item => {
                temp.TotalBill+=item.Quantity * item.Item.Price;
              });
              this.gs.customerLists.push(temp);
              this.customersOnQueue.push(temp);
              let profileModal = this.modalCtrl.create(DeliveryRequestModalPage, { "userInfo":{info:resp, accept:this.Accept.bind(this)}});
              profileModal.present();
            }.bind(this), function(resp){
              this.gser.ShowAlert(resp.message);
            }.bind(this));
          }
        }
    }.bind(this));
    clientRequestHub.on('NotifyDeliveryDelivered', function(coid, dmanID, ownerID, appID){
      if(dmanID == this.gs.userLoginInfo.ID && appID == this.gs.appID && coid != this.uniqueID){
        this.uniqueID=coid;
        var observe=this.gser.ObservableIntervalSubscribe(1000, function(){
          this.uniqueID="";
          observe.unsubscribe();
        }.bind(this))
        var index=this.acceptedLocation.findIndex(d=>d.ID == coid);
        this.acceptedLocation.splice(index, 1);
        this.storage.set("tasks", this.acceptedLocation);
        this.gser.presentToast("Delivery Successful Thank you for the hard work", 10000, 'top',function(){}.bind(this));
      }
    }.bind(this))
    
    connection2.start({ jsonp: true })
    .done(function(data){
    })
    .fail(function(){ 
     });
  }
  //test only remove this after finish testing
  ShowRequestModal(){
    let profileModal = this.modalCtrl.create(DeliveryRequestModalPage, { userId: 8675309 });
    profileModal.present();
  }

  Accept(item:ClientOrder){
    //check if that request is still available
    var load;
    this.gser.ShowLoadingCtrlInstance("Accepting Request Please Wait...", function(obj){
      load=obj;
    }.bind(this));
    load.present();
    this.clientS.AcceptClientOrder(this.gs.userLoginInfo.ID, item.ID, function(resp){
      load.dismiss();
      var temp=new ClientOrder();
      temp.set(item);
      item.OrderedItems.forEach(item => {
        temp.TotalBill+=item.Quantity * item.Item.Price;
      });
      this.gs.acceptedCustomers.push(temp);
      this.acceptedLocation.push(temp);
      var index=this.gs.customerLists.findIndex(d=>d.ID == item.ID);
      this.gs.customerLists.splice(index, 1);
      this.customersOnQueue.splice(index,1);
      this.storage.set("tasks", this.acceptedLocation);
    }.bind(this), function(resp){
      load.dismiss();
      this.gser.ShowAlert(resp.message);
    }.bind(this))
  }
  Cancel(item:ClientOrder){
    var load;
    this.gser.ShowLoadingCtrlInstance("Cancelling Request Please Wait...", function(obj){
      load=obj;
    }.bind(this));
    load.present();
    this.clientS.CancelClientOrder(this.gs.userLoginInfo.ID, item.ID, function(resp){
      load.dismiss();
      var index=this.acceptedLocation.findIndex(d=>d.ID == item.ID);
      this.acceptedLocation.splice(index, 1);
      this.gs.acceptedCustomers=this.acceptedLocation;
      this.storage.set("tasks", this.acceptedLocation);
    }.bind(this), function(){
      load.dismiss();
    }.bind(this));
  }
  locationTrackObserve:any;
  TrackUserLocation(){
    this.locationTrackObserve=this.gser.ObservableIntervalSubscribe(100*30, function(){
      this.gser.GetCurrentLocation(function(data){
        this.AssignMyLocation(data.lat, data.long);
      }.bind(this), function(){
      }.bind(this));
    }.bind(this))
  }
  CloseObservable(){
    this.locationTrackObserve.unsubscribe();
    this.myLocationObserve.unsubscribe();
  }
  PromptDeliveryForm(item:ClientOrder){
    var load;
    this.gser.ShowLoadingCtrlInstance("Sending Delivery Prompt Please Wait...", function(obj){
      load=obj;
    }.bind(this));
    load.present();

    this.clientS.PromptClientDeliveryFinished(this.gs.userLoginInfo.ID, item.ID, function(data){
      load.dismiss();
      this.gser.presentToast("Delivery Form Sent to user please wait until he/she confirms that the delivery was successful", 10000, 'top', function(){}.bind(this))
    }.bind(this), function(data){
      load.dismiss();
    }.bind(this))
  }
  //update this users location observable
  myLocationObserve;
  UpdateLocationInterval(){
    this.myLocationObserve=this.gser.ObservableIntervalSubscribe(100*80, function(){
      this.locationS.UpdateUserLocationByID(this.gs.userLoginInfo.ID, this.myLocation.longitude, this.myLocation.latitude,
      function(data){
      }.bind(this),
      function(data){
        this.gser.ShowAlert(data.message);
      }.bind(this));
    }.bind(this))
  }
  //Load data of branch accepted uid
  LoadOnProgressClientOrders(){    
    this.clientS.GetClientOrdersByDManIDStatsIDCompID(this.gs.userLoginInfo.ID, "3f00508a-2b16-4de0-b5e8-abb2cdf09e26", 
    function(resp){
    resp.data.forEach(element => {
      var temp=new ClientOrder();
      temp.set(element);
      element.OrderedItems.forEach(item => {
        temp.TotalBill+=item.Quantity * item.Item.Price;
      });
      this.acceptedLocation.push(temp);
    });
    }.bind(this), 
    function(resp){
      this.gser.ShowAlert(resp.message);
    }.bind(this))
  }

}
