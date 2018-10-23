// import {Device} from '@ionic-native/device';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';
@Injectable()
export class GeneralService{
    myDisplay:any;
    modal:any;
    constructor(private alertCtrl: AlertController,
                private loadCtrl:LoadingController,
                private modalCtrl:ModalController, private gl:Geolocation,
                private toastCtrl:ToastController){}
    ObservableIntervalSubscribe(time:number, event:Function){
        return Observable.interval(time).subscribe(x => {
            event();
        });
    }
    //end here
    //alert
    ShowAlert(message:string){
        const alert = this.alertCtrl.create({
            title: '',
            message: message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          });
          alert.present();
    }
    ShowAlertEvent(title, message, okText, cancelText, success, failed){
        const alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
              {
                text: cancelText,
                role: 'cancel',
                handler: () => {
                    failed();
                }
              },
              {
                text: okText,
                handler: () => {
                  success();
                }
              }
            ]
          });
          alert.present();
    }
    //loading controller
    ShowLoadingCtrl(message:string){
        this.myDisplay=this.loadCtrl.create({
            content: message
        });
    }
    ShowLoadingCtrlInstance(message,success){
        const display=this.loadCtrl.create({
            content:message
        });
        success(display);
    }
    ShowCustomLoadingCtrl(spinner, content, success){
        const myDislay=this.loadCtrl.create({
            spinner:'hide',
            content: content
        });
        success(myDislay);
    }
    //end here
    //modal controller
    ShowModal(page){
        this.modal=this.modalCtrl.create(page);
        this.modal.present();
    }
    //end here
    //message display
    DisplayShowAlertMessage(data){
        if(data.success!=undefined){
            this.ShowAlert(data.message);
        }else{
            this.ShowAlert("Sorry server cannot be contact right now please try again later and also please check your internet connection");
        }
    }
    ServerMaintenanceMessage(){
        this.ShowAlert("We are so sorry for the inconvenience we are having server maintenance right now please try again later");
    }
    //gets users did
    // GetDID(){
    //     return this.device.uuid;
    // }
    //is contain white space
    IsContainWhiteSpace(data,success,failed){
        var failedCount=0;
        for(var i=0; i<data.length;i++){
            if(data[i] == ' '){
                failed();
                failedCount++;
                break;
            }
        }
        if(failedCount==0){
            success();
        }
    }
    //local notifications
    // CreateLocalNotification(id, text, icon){
    //     this.ln.schedule({
    //         id: id,
    //         text: text,
    //         icon: icon
    //     });
    // }
    //get my location
    GetCurrentLocation(success,failed){
        this.gl.getCurrentPosition().then((resp) => {
                success({lat:resp.coords.latitude, long:resp.coords.longitude});
           }).catch((error) => {
               failed("Sorry we cannot retrieve your location please restart the app and enable access to location to our app");
        });
    }

    //toast controller
    presentToast(message,duration:number,position, dismissEvent) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: duration,
          position: position
        });      
        toast.onDidDismiss(() => {
          dismissEvent();
        });
        toast.present();
      }



}
