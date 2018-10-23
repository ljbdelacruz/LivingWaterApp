import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//viewmodel
import {UsersViewModel} from '../../models/model.model'
//services
import {UsersServices} from '../../services/requestServices/usersServices.service'
import {GeneralService} from '../../services/general.service'


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userModel:UsersViewModel=new UsersViewModel();
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userS:UsersServices, private gser:GeneralService) {
    this.gser.GetCurrentLocation(function(coords){
      this.userModel.location.latitude=coords.lat;
      this.userModel.location.longitude=coords.long;
    }.bind(this), function(){
      this.gser.ShowAlert("Please enable location on you phone so we can locate you and restart the app");
    }.bind(this))               
  }
  ionViewDidLoad(){
    console.log('ionViewDidLoad SignupPage');
  }
  //button event
  SignupOnClick(){
    var load;
    this.gser.ShowLoadingCtrlInstance("Creating user in please wait...", function(object){
      load=object;
    }.bind(this));

    load.present();
    this.CheckInputs(function(){
      this.userS.CreateUser(this.userModel, function(data){
        if(data.success){
          console.log(data);
          load.dismiss();
          this.Close();
          this.gser.ShowAlert("Success");
        }else{
          load.dismiss();
        }
      }.bind(this),function(data){
          this.gser.ShowAlert(data.message);
          load.dismiss();
          this.Close();
      }.bind(this))
    }.bind(this), function(message){
      load.dismiss();
      this.gser.ShowAlert(message);
    }.bind(this))
  }
  SignUpEmployee(){

  }
  Close(){
    this.navCtrl.pop();
  }

  //functionalities
  CheckInputs(success, failed){
    var message="";
    if(this.userModel.Password != this.userModel.Repassword){
      this.userS.CreateUser(this.userModel, function(data){console.log(data);}.bind(this),function(data){console.log(data);}.bind(this))
      message+="Password does not match Confirm Password\n";
    }
    if(this.userModel.Firstname=="" || this.userModel.Middlename=="" || this.userModel.Lastname =="" ||
       this.userModel.EmailAddress=="" || this.userModel.Password=="" || this.userModel.Repassword=="" ||
       this.userModel.ContactNumber=="" || this.userModel.Address=="" || this.userModel.location.latitude==0 ||
       this.userModel.location.longitude==0){
        message+="Please fill the necessary field to proceed and make sure location is enabled so we can locate you\n";
    }
    if(this.userModel.ContactNumber)
    if(message==""){
      success();
    }else{
      failed(message);
    }
  }

}
