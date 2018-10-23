import {Component, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import {NavParams} from 'ionic-angular'
@Component({
    selector:'app-pop-menu1',
    templateUrl:'./popMenu1.components.html'
})
export class PopupMenuComponent implements OnDestroy{
    /*
        {label:'Accept', value:1}
    */
    title:'';
    buttons=[];
    event:any;
    /*number of seconds ionInput event will execute*/
    constructor(params:NavParams){
        var passed=params.get("invoke");
        this.title=passed.title;
        this.buttons=passed.buttons;
        this.event=passed.buttonEvent;
        
    }
    buttonPressed(value){
        // this.buttonEvent.emit(value);
        this.event(value);
    }
    ngOnDestroy() {
    }
}

