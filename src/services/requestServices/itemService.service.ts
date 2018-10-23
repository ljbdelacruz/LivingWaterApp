import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import {GlobalDataService} from '../singleton/globaldata.data';
import {RequestService} from './requestServices.service';
//this one is for requesting data from request database
//view model
import {UsersViewModel} from '../../models/model.model'

@Injectable()
export class ItemServices{
    headers:Headers;
    constructor(private gser:GlobalDataService, private rs:RequestService){
        this.headers=new Headers();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    GetItemsByCompanyID(id:string, success,failed){
        this.rs.Get(this.gser.url+"Item/GetByCompanyID?id="+id, this.headers).subscribe(temp=>{
            if(temp.json().success){
                success(temp.json());
            }else{
                failed(temp.json());
            }
        }, error=>{
            failed({message:'No Internet connection'});
        })
    }
}
