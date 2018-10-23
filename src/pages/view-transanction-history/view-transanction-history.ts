import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//services
import {ClientService} from '../../services/requestServices/clientService.service'
import {GeneralService} from '../../services/general.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data'
import { ClientOrder } from '../../models/model.model';
//view transaction history
@Component({
  selector: 'page-view-transanction-history',
  templateUrl: 'view-transanction-history.html',
})
export class ViewTransanctionHistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private clientS:ClientService, private gs:GlobalDataService,
              private genS:GeneralService) {
                this.LoadData();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTransanctionHistoryPage');
  }
  //button event
  Close(){
    this.navCtrl.pop();
  }

  transactionHistory:ClientOrder[]=[];
  LoadData(){
    var load;
    this.genS.ShowLoadingCtrlInstance("Getting Order History Please Wait...", function(obj){
      load=obj;
    }.bind(this))
    load.present();
    //get all delivered client orders
    console.log(this.gs.userLoginInfo.ID);
    this.clientS.GetClientOrderByOwnerID(this.gs.userLoginInfo.ID,
    function(resp){
      console.log(resp);
      resp.data.forEach(element => {
        this.transactionHistory.push(element);
      });
      load.dismiss();
    }.bind(this), 
    function(data){}.bind(this))
  }
  //sample transaction history data
  historyTransaction=[{id:1, status:'Requesting', 
                       orders:[{id:1, name:'5 Gal Slim', quantity:2, source:'assets/imgs/logo.png'},
                               {id:2, name:'5 Gal Round', quantity:3, source:'assets/imgs/logo.png'}],
                       location:{long:0, lat:0},
                       bill:2500
                      },
                      {id:2, status:'Delivered', 
                      orders:[{id:1, name:'5 Gal Slim', quantity:3, source:'assets/imgs/logo.png'},
                              {id:2, name:'5 Gal Round', quantity:3, source:'assets/imgs/logo.png'}],
                      location:{long:0, lat:0},
                      bill:2000
                     }]

}
