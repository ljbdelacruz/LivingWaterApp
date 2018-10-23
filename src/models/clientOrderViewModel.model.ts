import {UsersViewModel} from './usersViewModel.model'
import {ClientOrderLocation} from './positionViewModel.model'
export class ClientOrderViewModel{
    public id:string;
    public user:UsersViewModel;
    public location:ClientOrderLocation;
    public orderedItems:OrderedItems[];
    constructor(id, user, location, orderedItems){
        this.id=id;
        this.user.set(user);
        this.location.set(location);
        orderedItems.forEach(elem => {
            this.orderedItems.push(elem);
        });
    }
    set(object:ClientOrderViewModel){
        this.id=object.id;
        this.user.set(object.user);
        this.location.set(object.location);
        object.orderedItems.forEach(elem => {
            this.orderedItems.push(elem);
        });
    }
}
export class ClientOrderStatus{
    public id:string;
    public name:string;
    constructor(id, name){
        this.id=id;
        this.name=name;
    }
    set(object:ClientOrderStatus){
        this.id=object.id;
        this.name=object.name;
    }
}
export class OrderedItems{
    public id:string;
    public quantity:number;
    public item:Item;
    constructor(id, quantity, item){
        this.id=id;
        this.quantity=quantity;
        this.item.set(item);
    }
    set(object:OrderedItems){
        this.id=object.id;
        this.quantity=object.quantity;
        this.item.set(object.item);
    }
}
export class Item{
    public id:string;
    public name:string;
    public price:number;
    constructor(id, name, price){
        this.id=id;
        this.name=name;
        this.price=price;
    }
    set(object:Item){
        this.id=object.id;
        this.name=object.name;
        this.price=object.price;
    }
}