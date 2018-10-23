import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import {GlobalDataService} from '../singleton/globaldata.data';
import {RequestService} from './requestServices.service';
//this one is for requesting data from request database
//view model
import {ClientOrder} from '../../models/model.model'

@Injectable()
export class ClientService{
    headers:Headers;
    constructor(private gser:GlobalDataService, private rs:RequestService){
        this.headers=new Headers();
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    CreateCustomerOrder(model, success,failed){
        var body=new FormData();
        var json=JSON.stringify(model);
        body.append("param", json);
        body.append("appID", this.gser.appID);
        this.rs.PostParam(this.gser.url+"ClientOrders/Create", this.headers, body).subscribe(data=>{
            if(data.json().success){
                success(data.json());
            }else{
                failed(data.json());
            }
        }, error=>{
            failed(error);
        })
    }
    //signalRPrompt
    PromptClientDeliveryFinished(UID, COID, success,failed){
        var body=new FormData();
        body.append("UID", UID);
        body.append("COID", COID);
        body.append("appID", this.gser.appID);
        this.rs.PostParam(this.gser.url+"ClientOrders/DeliveryConfirmation", this.headers, body).subscribe(item=>{
            if(item.json().success){
                success(item.json());
            }else{
                failed(item.json());
            }
        }, error=>{
            failed(error);
        })
    }
    //Status Changer
    AcceptClientOrder(deliveryManID, clientOrderID, success,failed){
        var body=new FormData();
        body.append("UID", deliveryManID);
        body.append("COID", clientOrderID);
        body.append("appID", this.gser.appID);
        this.rs.PostParam(this.gser.url+"ClientOrders/AcceptClientOrder", this.headers, body).subscribe(resp=>{
            if(resp.json().success){
                success(resp.json());
            }else{
                failed(resp.json());
            }
        }, error=>{
            failed({message:'Request Error'});
        })
    }
    CancelClientOrder(deliveryManID, clientOrderID, success,failed){
        var body=new FormData();
        body.append("UID", deliveryManID);
        body.append("COID", clientOrderID);
        body.append("appID", this.gser.appID);
        this.rs.PostParam(this.gser.url+"ClientOrders/CancelClientOrder", this.headers, body).subscribe(resp=>{
            if(resp.json().success){
                success(resp.json());
            }else{
                failed(resp.json());
            }
        }, error=>{
            failed({message:'Request Error'});
        })
    }
    DeliverClientOrder(deliveryManID, clientOrderID, success,failed){
        var body=new FormData();
        body.append("UID", deliveryManID);
        body.append("COID", clientOrderID);
        body.append("appID", this.gser.appID);
        this.rs.PostParam(this.gser.url+"ClientOrders/DeliverClientOrder", this.headers, body).subscribe(resp=>{
            if(resp.json().success){
                success(resp.json());
            }else{
                failed(resp.json());
            }
        }, error=>{
            failed({message:'Request Error'});
        })
    }
    //end here
    GetClientOrdersByLocation(longX, latY, radius, cid,  success, failed){
        this.rs.Get(this.gser.url+"ClientOrders/GetByLocationRadius?longX="+longX+"&latY="+latY+"&radius="+radius+"&cid="+cid, this.headers).subscribe(data=>{
            if(data.json().success){
                success(data.json());
            }else{
                failed(data.json());
            }
        },error=>{
            failed(error);
        })
    }
    GetCustomerOrderByID(id:string, success, failed){
        this.rs.Get(this.gser.url+"ClientOrders/GetByID?ID="+id, this.headers).subscribe(resp=>{
            if(resp.json().success){
                console.log(resp.json());
                success(resp.json());
            }else{
                failed(resp.json());
            }
        }, error=>{
            failed(error);
        })
    }
    //param ownerID and statusID
    GetClientOrderByOwnerIDStatusID(id:string, sid:string, success, failed){
        console.log(id);
        console.log(sid);
        console.log(this.gser.appID);
        this.rs.Get(this.gser.url+"ClientOrders/GetByOwnerIDStatus?oid="+id+"&sid="+sid+"&appID="+this.gser.appID, this.headers).subscribe(resp=>{
            if(resp.json().success){
                console.log("ClientOrders/GetByOwnerIDStatus");
                console.log(resp.json());
                success(resp.json());
            }else{
                failed(resp.json());
            }
        }, error=>{
            console.log("ERROR");
            failed({message:"No internet connection"});
        })
    }
    GetClientOrderByOwnerID(id:string, success, failed){
        console.log(this.gser.appID);
        this.rs.Get(this.gser.url+"ClientOrders/GetByOwnerID?oid="+id+"&appID="+this.gser.appID, this.headers).subscribe(resp=>{
            if(resp.json().success){
                success(resp.json());
            }else{
                console.log(resp.json());
                failed(resp.json());
            }
        }, error=>{
            console.log("ERROR");
            failed({message:"No internet connection"});
        })
    }

    //get client orders by deliveryPersonID, statusID, companyID
    GetClientOrdersByDManIDStatsIDCompID(dman,sid,success,failed){
        var body=new FormData();
        body.append("did", dman);
        body.append("sid", sid);
        body.append("cid", this.gser.appID);
        this.rs.Get(this.gser.url+"ClientOrders/GetByDeliveryManIDStatusID?did="+dman+"&sid="+sid+"&cid="+this.gser.appID, this.headers).subscribe(resp=>{
            console.log(resp.json());
                        if(resp.json().success){
                            success(resp.json());
                        }else{
                            failed(resp.json());
                        }
                    }, error=>{
                        failed({message:'No internet connection'});
                    })
    }



}
