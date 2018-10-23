import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
//viewmodels
import {PositionViewModel} from '../../models/positionViewModel.model'
import { ClientOrder } from '../../models/model.model';
//services
import {GeneralService} from '../../services/general.service'
import {ClientService} from '../../services/requestServices/clientService.service'
import {GlobalDataService} from '../../services/singleton/globaldata.data'

//
@Component({
  selector: 'page-user-confirmation-modal',
  templateUrl: 'user-confirmation-modal.html',
})
export class UserConfirmationModalPage {
  clientInfo:ClientOrder=new ClientOrder();
  deliverSuccessEvent:any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams,
              private gs:GeneralService, private gsData:GlobalDataService,
              private clientS:ClientService) {
              var data=this.navParams.get("orderInfo");
              console.log(data.data);
              this.deliverSuccessEvent=data.deliverSuccess;
              this.clientInfo=data.data;
  }
  ionViewDidLoad() {}
  DeliverRequest(){
    this.deliverSuccessEvent(this.clientInfo);
    this.viewCtrl.dismiss();
  }
  NotDeliverRequest(){
    this.viewCtrl.dismiss();
  }
}
