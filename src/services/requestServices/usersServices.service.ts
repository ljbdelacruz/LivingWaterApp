import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import {GlobalDataService} from '../singleton/globaldata.data';
import {RequestService} from './requestServices.service';
//this one is for requesting data from request database
//view model
import {UsersViewModel} from '../../models/model.model';

@Injectable()
export class UsersServices{
    headers:Headers;
    constructor(private gser:GlobalDataService, private rs:RequestService){
        this.headers=new Headers();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    
    Authenticate(userInfo:UsersViewModel, success, failed){
        let body=new FormData();
        body.append('username', userInfo.EmailAddress);
        body.append('password', userInfo.Password);
        this.rs.PostParam(this.gser.url+"/Users/Authenticate",this.headers, 
                         body).subscribe((data)=>{
                           if(data.json().success){
                             success(data.json());
                           }else{
                             failed(data.json());
                           }
        }, error=>{
            failed("ERRROR");
        });
    }
    AuthenticateEmployee(userInfo:UsersViewModel, success,failed){
        let body=new FormData();
        body.append('username', userInfo.EmailAddress);
        body.append('password', userInfo.Password);
        this.rs.PostParam(this.gser.url+"/Users/AuthenticateBranch",this.headers, 
                         body).subscribe((data)=>{
                           if(data.json().success){
                             success(data.json());
                           }else{
                             failed(data.json());
                           }
        }, error=>{
            failed({message:'Sorry server cannot be contact as of this moment please try again later'});
        });
    }


    //creating normal users
    CreateUser(userInfo:UsersViewModel, success,failed){
        var body=new FormData();
        body.append("emailAddress", userInfo.EmailAddress);
        body.append("password", userInfo.Password);
        body.append("firstname", userInfo.Firstname);
        body.append("middlename", userInfo.Middlename);
        body.append("lastname", userInfo.Lastname);
        body.append("contactNumber", userInfo.ContactNumber);
        body.append("address", userInfo.Address);
        body.append("longitude", ""+userInfo.location.longitude);
        body.append("latitude", ""+userInfo.location.latitude);
        body.append("CompanyID", "ccca1cf9-9a42-4d16-a267-2f4df1529496");
        body.append("aID", this.gser.userCreateAID);
        this.rs.PostParam(this.gser.url+"Users/CreateNewUser", this.headers, body).subscribe((data)=>{
          if(data.json().success){
              success(data.json());
            }else{failed(data.json());}
        }, error=>{failed(error.json());})
    }
}
