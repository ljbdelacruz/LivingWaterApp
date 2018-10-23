import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//pages
import {SignupPage} from '../signup/signup'
//services
import {GlobalDataService} from '../../services/singleton/globaldata.data'
@Component({
  selector: 'page-tutorials',
  templateUrl: 'tutorials.html',
})
export class TutorialsPage {
  username:string="";
  password:string="";
  repassword:string="";
  isEmployee:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public gdata:GlobalDataService){
                console.log(this.gdata.isEmployeeApp);
                this.isEmployee=this.gdata.isEmployeeApp;
  }
  ionViewDidLoad() {
  }
  Close(){
    this.navCtrl.pop();
  }
  //button event
  SignUpEvent(){
    this.navCtrl.push(SignupPage);
  }

}
