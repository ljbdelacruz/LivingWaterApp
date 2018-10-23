import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
@Injectable()
export class RequestService{
    constructor(private http:Http){}
    Get(route:string, headers:any ){
        return this.http.get(route, {headers:headers}).map((response)=>{
            return response;
        }, err => console.log(err));
    }
    Post(route:string, headers:any){
        return this.http.post(route, {headers:headers}).map((response)=>{
            return response;
        }, err => console.log(err));
    }
    PostParam(route:string, headers:any, param:any){
        let options = new RequestOptions({ headers: headers });
        return this.http.post(route, param, options).map((response)=>{
            return response;
        }, err=>console.log("Error"));
    }
    GetParam(route:string, headers:any, param:any){
        let options = new RequestOptions({ headers: headers });
        return this.http.get(route, options).map((response)=>{
            return response;
        }, err => console.log(err));
    }    
}



