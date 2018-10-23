import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, MenuController, PopoverController, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { hubConnection } from 'signalr-no-jquery';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
//component
import {PopupMenuComponent} from '../../components/popupMenu1/popMenu1.components'
//pages
import {MyOrdersPage} from '../my-orders/my-orders'
import {ViewOrdersPage} from '../view-orders/view-orders'
import {ViewTransanctionHistoryPage} from '../view-transanction-history/view-transanction-history'
import {UserOrderPage} from '../user-order/user-order'
//services
import {GeneralService} from '../../services/general.service';
import {ItemServices} from '../../services/requestServices/itemService.service';
import {ClientService} from '../../services/requestServices/clientService.service'
import {LocationService} from '../../services/requestServices/locationService.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data';
//modal
import {UserConfirmationModalPage} from '../../modal/user-confirmation-modal/user-confirmation-modal'
//model
import {Item, ItemImage, OrderedItems, ClientOrder, UsersViewModel} from '../../models/model.model'
import { PositionViewModel } from '../../models/positionViewModel.model';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  public searchControl: FormControl;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  
  isLogin=false;
  isActivePage:boolean=true;
  //set this page as active again
  PageActive(){
    this.isActivePage=true;
  }
  currentUserlocation=new PositionViewModel(0,0);
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public menuCtrl:MenuController, private gl:Geolocation, 
              private popCtrl:PopoverController, private gs:GlobalDataService,
              private gser:GeneralService, private iab:InAppBrowser, private platform:Platform,
              private modalCtrl:ModalController, private itemS:ItemServices,
              private clientS:ClientService, private locationS:LocationService,
              private storage:Storage,private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
    platform.registerBackButtonAction(()=>{});
    this.isLogin=this.gs.isLogin;
    
    //signalR listens
    this.ListenOrderAccept();
    //loading data
    this.LoadItems();
    //get on progress my on progress orders
    this.GetMyOnProgressOrders(function(data:ClientOrder[]){
      data.forEach(element => {
        var contains=this.acceptedLocation.find(x=>x.ID == element.DeliveryPerson.DeliveryMan.ID);
        if(contains==undefined){
          var temp=new UsersViewModel();
          temp.ID=element.DeliveryPerson.DeliveryMan.ID;
          this.acceptedLocation.push(temp);
          // this.acceptedLocation.push(element.DeliveryPerson.DeliveryMan);
        }
      });
      this.TrackDeliveryMan();
    }.bind(this));
    this.myLocation.lat
    //setup search for places
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          
          this.myLocation.lat = place.geometry.location.lat();
          this.myLocation.long = place.geometry.location.lng();
          this.AssignView(place.geometry.location.lat(), place.geometry.location.lng());
          // this.zoom = 12;
        });
      });
    });

  }
  ionViewDidLoad() {
    this.FindMyLocation();
  }
  ionViewDidEnter(){
    this.isActivePage=true;
  }
  ionViewWillLeave() {
    this.isActivePage=false;
  }



  //map events
  mapView={lat:0, long:0};
  myLocation={lat:0, long:0};
  AssignView(lat, long){
    this.mapView.lat=lat;
    this.mapView.long=long;
  }
  AssignMyLocation(lat, long){
    this.myLocation.lat=lat;
    this.myLocation.long=long;
    this.gs.userLocation.latitude=lat;
    this.gs.userLocation.longitude=long;
  }
  TrackMovement(event){
    this.mapView.lat=event.lat;
    this.mapView.long=event.lng;
  }
  MovePoint(event){
    this.AssignMyLocation(event.coords.lat, event.coords.lng);
  }
  //button events
  ToggleMenu(){
    this.menuCtrl.toggle();
  }
  ShopOnClick(){
    this.navCtrl.push(MyOrdersPage);
  }
  ViewOrdersOnClick(){
    this.navCtrl.push(ViewOrdersPage);
    // this.popover.dismiss();
  }
  ShowPopupModalConfirmDelivery(data){
    let profileModal = this.modalCtrl.create(UserConfirmationModalPage, { "orderInfo":{data:data, deliverSuccess:this.DeliverSuccess.bind(this)}});
    profileModal.present();
  }
  //side menu events
  GotoMyLocation(){
    this.menuCtrl.toggle().then(function(){
      this.FindMyLocation();
    }.bind(this))
  }
  fbNavigate(){
    this.iab.create("https://www.facebook.com/OfficialLivingwater/", '_self',{location:'no'});
  }
  GotoFacebookPage(){
    this.menuCtrl.toggle().then(function(){
      this.fbNavigate();
    }.bind(this))
  }
  ViewTransactionHistory(){
    this.menuCtrl.toggle().then(function(){
      this.navCtrl.push(ViewTransanctionHistoryPage);
    }.bind(this))
  }
  ViewUserOrders(){
    this.menuCtrl.toggle().then(function(){
      this.navCtrl.push(UserOrderPage);
    }.bind(this))
  }
  Logout(){
    this.menuCtrl.toggle().then(function(){
      this.storage.set("username", null);
      this.storage.set("password", null);
      this.gs.isLogin=false;
      this.trackDeliveryManObserve.unsubscribe();
      this.navCtrl.pop();
    }.bind(this))
  }
  //popover event
  popover:any=undefined;
  ShowPopover(event){
     if(this.popover==undefined){
      this.popover = this.popCtrl.create(PopupMenuComponent, {invoke:{buttons:[{label:'Order Item', value:1}],
      buttonEvent:this.popupButtonEvent.bind(this), title:''}});        
     }
     this.popover.present({
      ev: event
     });
  }
  popupButtonEvent(value){
    switch(value){
      case 1:
        this.ViewOrdersOnClick();
        break;
    }
  }
  //signalr listeners
  clientOrderID="";
  ListenOrderAccept(){
    const connection2 = hubConnection(this.gs.url);
    var clientRequestHub = connection2.createHubProxy('clientHub');

    //listener deliverymanID, clientOwnerID, clientOrderID
    clientRequestHub.on('PromptUserDeliver', function(dmanID, clientUID, coid, appID){
      var load;
      if(this.gs.userLoginInfo.ID==clientUID && this.gs.appID == appID && this.clientOrderID!=coid){
        this.clientOrderID=coid;
        var observe=this.gser.ObservableIntervalSubscribe(1000, function(){
          this.clientOrderID="";
          observe.unsubscribe();
        }.bind(this))
        this.gser.ShowLoadingCtrlInstance("Getting order details please wait", function(obj){
          load=obj
        })
        load.present();
        this.clientS.GetCustomerOrderByID(coid, function(resp){
          this.ShowPopupModalConfirmDelivery(resp.data);
          load.dismiss();
        }.bind(this),function(resp){
          load.dismiss();
        }.bind(this))
      }
    }.bind(this))
    //ownerOfClientOrderID, deliverymanID, clientOrderID
    clientRequestHub.on('NotifyClientOrderAccepted', function(ownerCOID, dmanID, coid, appID) {

      if(this.gs.userLoginInfo.ID == ownerCOID && this.gs.appID == appID && this.clientOrderID!=coid){
        this.clientOrderID=coid;
        var observe=this.gser.ObservableIntervalSubscribe(1000, function(){
          this.clientOrderID="";
          observe.unsubscribe();
        }.bind(this))
        this.clientS.GetCustomerOrderByID(coid, function(resp){
          var temp=new UsersViewModel();
          temp.ID=resp.data.DeliveryPerson.DeliveryMan.ID;
          this.acceptedLocation.push(temp);
        }.bind(this),function(resp){
        }.bind(this))
        this.gser.presentToast("Your request is on progress please wait until the delivery man arrives", 10000, 'top', 
        function(){}.bind(this));
      }
    }.bind(this));
    //ownerOfClientOrderID, deliverymanID, clientOrderID
    clientRequestHub.on('NotifyClientOrderCancelled', function(ownerCOID, dmanID, coid, appID) {
      if(this.gs.userLoginInfo.ID == ownerCOID && this.gs.appID==appID && this.clientOrderID!=coid){
        this.clientOrderID=coid;
        var observe=this.gser.ObservableIntervalSubscribe(1000, function(){
          this.clientOrderID="";
          observe.unsubscribe();
        }.bind(this))
        var index=this.acceptedLocation.findIndex(d=>d.ID == dmanID);
        this.acceptedLocation.splice(index, 1);
        this.gser.presentToast("Your request has been cancelled please wait until another branch accepts your request", 10000, 'top', 
        function(){}.bind(this));
      }
    }.bind(this));

    connection2.start({ jsonp: true })
    .done(function(data){
    })
    .fail(function(){ 
     });
  }
  //functionalities
  FindMyLocation(){
    var load;
    this.gser.ShowLoadingCtrlInstance("Getting your location please wait...", function(object){
      load=object;
    }.bind(this));
    load.present();
    
    this.gl.getCurrentPosition().then((resp) => {
      this.AssignView(resp.coords.latitude, resp.coords.longitude);
      this.AssignMyLocation(resp.coords.latitude, resp.coords.longitude);
      this.currentUserlocation.latitude=resp.coords.latitude;
      this.currentUserlocation.longitude=resp.coords.longitude;
      load.dismiss();
     }).catch((error) => {
       this.gser.ShowAlert("Sorry we cannot retrieve your location please restart the app and enable access to location to our app");
       load.dismiss();
     });
  }

  //Loading data
  LoadItems(){
    //assign items and ordered items
    this.gs.items=[];
    this.gs.orderedItems=[];
    var items:Item[]=[];
    var oItems:OrderedItems[]=[];
    this.itemS.GetItemsByCompanyID(this.gs.appID, function(data){
      data.data.forEach(element => {
        var tempItem:Item=new Item(element.ID, element.Name, element.Price, element.Description, []);
        if(element.ImageSource.length>0){
          element.ImageSource.forEach(image => {
            tempItem.ImageSource.push(new ItemImage(image.ID, image.ImageSource));
          })
        }
        items.push(tempItem);
        var tempOrderedItem=new OrderedItems("", 0, tempItem);
        oItems.push(tempOrderedItem);
        this.gs.items=items;
        this.gs.orderedItems=oItems;
      });
    }.bind(this),function(data){
      this.gser.ShowAlert(data.message);
    }.bind(this));
  }
  //track accepted client orderID
  //this is where to store the delivery man that accepted your request
  acceptedLocation:UsersViewModel[]=[];
  trackDeliveryManObserve:any;
  TrackDeliveryMan(){
    this.trackDeliveryManObserve=this.gser.ObservableIntervalSubscribe(100*80, function(){
      if(this.acceptedLocation.length>0){
        this.acceptedLocation.forEach(item=>{
          this.locationS.GetUserLocationByID(item.ID, function(data){
            item.location.longitude=Number(data.data.longitude);
            item.location.latitude=Number(data.data.latitude);
          }.bind(this),
          function(error){
          }.bind(this))
        });
      }
    }.bind(this))
  }
  GetMyOnProgressOrders(event){
    this.clientS.GetClientOrderByOwnerIDStatusID(this.gs.userLoginInfo.ID,"3f00508a-2b16-4de0-b5e8-abb2cdf09e26", 
    function(resp){
      event(resp.data);
    }.bind(this), function(resp){
    }.bind(this))
  }
  //deliver success function
  DeliverSuccess(clientInfo:ClientOrder){
    this.gser.ShowAlertEvent("Are you sure?", "Confirm that item is delivered to you?", "Yes", "Cancel", function(){
      this.clientS.DeliverClientOrder(clientInfo.DeliveryPerson.DeliveryMan.ID, clientInfo.ID, function(data){
        var index=this.acceptedLocation.findIndex(d=>d.ID == clientInfo.DeliveryPerson.DeliveryMan.ID);
        this.acceptedLocation.splice(index, 1);
        this.gser.ShowAlert("Request Delivered!");
      }.bind(this), function(data){
        this.gser.ShowAlert(data.message);
      }.bind(this));
    }.bind(this), function(){}.bind(this))
  }

}
