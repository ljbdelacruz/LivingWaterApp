import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//pages
import {TutorialsPage} from '../tutorials/tutorials';
import {DashboardPage} from '../dashboard/dashboard';
import {SignupPage} from '../signup/signup'
//branch dashboard
import {BranchDashboardPage} from '../branch-dashboard/branch-dashboard';
//services
import {UsersServices} from '../../services/requestServices/usersServices.service'
import {GeneralService} from '../../services/general.service'
//singleton
import {GlobalDataService} from '../../services/singleton/globaldata.data';
//viewmodel
import {UsersViewModel} from '../../models/model.model';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isEmployee=false;
  userModel:UsersViewModel=new UsersViewModel();
  constructor(public navCtrl: NavController,
              public storage:Storage, private gs:GlobalDataService,
              private userS:UsersServices, private gser:GeneralService) {
                this.CheckIfFirstTime(function(){
                  this.navCtrl.push(TutorialsPage);
                }.bind(this))
                this.isEmployee=this.gs.isEmployeeApp;
  }
  isShowTuts:boolean=false;
  CheckIfFirstTime(event){
    this.storage.get("username").then(val=>{
      console.log(val);
      this.userModel.EmailAddress=val;
      if(val!=null){
        this.storage.get("password").then(pass=>{
          this.userModel.Password=pass;
          if(this.gs.isEmployeeApp){
            this.LoginEmployee();
          }else{
            this.Login();
          }
        })
      }else{
        event();
      }
    });
  }
  //button events
  ShowTutorial(){
    this.navCtrl.push(TutorialsPage);
  }
  Login(){
    var load;
    this.gser.ShowLoadingCtrlInstance("Logging in please wait...", function(object){
      load=object;
    }.bind(this));
    load.present();
    this.userS.Authenticate(this.userModel, function(data){
      //returns the logged in user
      load.dismiss();
      console.log(data.data);
      if(data.data.isClient && data.data.AccessLevel.Name == "CompanyEmployee"){
        this.gser.ShowAlertEvent("Info!", "Do you want to login as Branch?", "Ok", "Cancel", function(){
          this.LoginEmployee();
        }.bind(this), function(){
          this.gs.userLoginInfo.setVM(data.data);
          this.LoginUser();
        }.bind(this));
      }else if(!data.data.isClient && data.data.AccessLevel.Name == "User"){
        this.gs.userLoginInfo.setVM(data.data);
        this.LoginUser();
      }else{
        this.gser.ShowAlert("Sorry you access level restricted to access this app please consult administrator");
      }
    }.bind(this), function(error){
      console.log("Error");
      load.dismiss();
      this.gser.ShowAlert(error.message);
    }.bind(this))
  }
  LoginUser(){
    this.gs.isEmployeeApp=false;
    this.storage.set("username", this.userModel.EmailAddress);
    this.storage.set("password", this.userModel.Password);
    this.gs.isLogin=true;
    this.navCtrl.push(DashboardPage);
  }

  LoginEmployee(){
    var load;
    this.gser.ShowLoadingCtrlInstance("Logging in please wait...", function(object){
      load=object;
    }.bind(this));
    load.present();
    this.userS.AuthenticateEmployee(this.userModel, function(data){
      //returns the logged in user
      this.gs.isEmployeeApp=true;
      load.dismiss();
      this.gs.userLoginInfo.setVM(data.data);
      this.storage.set("username", this.userModel.EmailAddress);
      this.storage.set("password", this.userModel.Password);
      this.gs.isLogin=true;
      this.navCtrl.push(BranchDashboardPage);
    }.bind(this), function(error){
      load.dismiss();
      this.gser.ShowAlert(error.message);
      load.dismiss();
    }.bind(this))
  }
  Order(){
    this.navCtrl.push(DashboardPage);
  }
  SignUpOnClick(){
    this.navCtrl.push(SignupPage);
  }
  BranchDashboard(){
    this.navCtrl.push(BranchDashboardPage);
  }
}
