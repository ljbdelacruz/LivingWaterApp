import {PositionViewModel} from './positionViewModel.model'
import { UsersServices } from '../services/requestServices/usersServices.service';

export class AccessLevelVM{
    public ID:string;
    public Name:string;
    set(object:any){
        console.log(object);
        if(object!=null){
            this.ID=object.ID;
            this.Name=object.Name;
        }else{
            this.ID="";
            this.Name="";
        }
    }
}


export class UsersViewModel{
    public ID:string;
    public Firstname:string;
    public Middlename:string;
    public Lastname:string;
    public EmailAddress:string;
    public ContactNumber:string;
    public Password:string;
    public Repassword:string;
    public location:PositionViewModel;
    public Address:string;
    public isClient:boolean;
    public AccessLevel:AccessLevelVM=new AccessLevelVM();
    constructor(){
        this.ID="";
        this.Firstname="";
        this.Middlename="";
        this.Lastname="";
        this.EmailAddress="";
        this.ContactNumber="";
        this.Password="";
        this.Repassword="";
        this.location=new PositionViewModel(0,0);
        this.Address="";
        this.isClient=true;
    }
    set1(id, firstname, middlename, lastname, emailAddress, contactNumber, password, repassword){
        this.ID=id;
        this.Firstname=firstname;
        this.Middlename=middlename;
        this.Lastname=lastname;
        this.EmailAddress=emailAddress;
        this.ContactNumber=contactNumber;
        this.Password=password;
        this.Repassword=repassword;
        this.location=new PositionViewModel(0,0);
    }
    set(object:UsersViewModel){
        this.ID=object.ID;
        this.Firstname=object.Firstname;
        this.Middlename=object.Middlename;
        this.Lastname=object.Lastname;
        this.EmailAddress=object.EmailAddress;
        this.ContactNumber=object.ContactNumber;
        this.Password=object.Password;
        this.Repassword=object.Repassword;
    }
    setVM(object){
        this.ID=object.ID;
        this.Firstname=object.Firstname;
        this.Middlename=object.MiddleName;
        this.Lastname=object.Lastname;
        this.EmailAddress=object.EmailAddress;
        this.ContactNumber=object.ContactNumber;
        this.isClient=object.isClient;
        this.AccessLevel.set(object.AccessLevel);
    }
}

//Item
export class Item{
    public ID:string;
    public Name:string;
    public Price:number;
    public ImageSource:ItemImage[]=[];
    public Description:string;
    constructor(id, name, price, description, imageSource){
        this.ID=id;
        this.Name=name;
        this.Price=price;
        this.Description=description;
        if(imageSource!=undefined && imageSource.length>0){
            this.ImageSource=imageSource;
        }
    }
    set(item){
        this.ID=item.ID;
        this.Name=item.Name;
        this.Price=item.Price;
        this.Description=item.Description;
        if(item.ImageSource!=undefined&&item.ImageSource.length>0){
            this.ImageSource=item.ImageSource;
        }
    }
}
export class ItemImage{
    public ID:string;
    public ImageSource:string;
    constructor(id, imageSource){
        this.ID=id;
        this.ImageSource=imageSource;
    }
}

//clients
export class DeliveryPerson{
    public ID:string;
    public DeliveryMan:UsersViewModel;
    constructor(){
        this.DeliveryMan=new UsersViewModel();
    }
    set(id:string, deliveryMan:UsersViewModel){
        this.ID=id;
        if(deliveryMan!=undefined){
            this.DeliveryMan.set(deliveryMan);
        }
    }
}

export class ClientOrderStatus{
    public ID:string;
    public Name:string;
    constructor(id, name){
        this.ID=id;
        this.Name=name;
    }
    set(object:ClientOrderStatus){
        this.ID=object.ID;
        this.Name=object.Name;
    }
}
export class ClientOrderLocation extends PositionViewModel{
    public ID:string;
    constructor(id, long, lat){
        super(long, lat);
        this.ID=id;
    }
    set(object:ClientOrderLocation){
        this.longitude=object.longitude;
        this.latitude=object.latitude;
        this.ID=object.ID;
    }
}
export class OrderedItems{
    public ID:string;
    public Quantity:number;
    public Item:Item;
    constructor(id, quantity, item:Item){
        this.ID=id;
        this.Quantity=quantity;
        this.Item=new Item(item.ID, item.Name, item.Price, item.Description, item.ImageSource);
    }
}
export class ClientOrder{
    public ID:string;
    public Owner:UsersViewModel=new UsersViewModel();
    public Status:ClientOrderStatus;
    public Location:ClientOrderLocation;
    public OrderedItems:OrderedItems[]=[];
    public MyOwner:CompanyViewModel=new CompanyViewModel();
    public AdditionalAddressInfo:string="";
    public Note:string="";
    public DeliveryPerson:DeliveryPerson=new DeliveryPerson();
    public TotalBill:number=0;
    public constructor(){}
    public set(object){
        if(object != null || object != undefined){
            this.ID=object.ID;
            this.Owner.setVM(object.Owner);
            this.Status=new ClientOrderStatus(object.Status.ID, object.Status.Name);
            this.Location=new ClientOrderLocation(object.Location.ID, object.Location.longitude, object.Location.latitude);
            this.OrderedItems=[];
            object.OrderedItems.forEach(element => {
                this.OrderedItems.push(new OrderedItems(element.ID, element.Quantity, new Item(element.Item.ID, element.Item.Name, element.Item.Price, element.Item.Description, element.Item.ImageSource)));
            });
            if(object.MyOwner!=undefined){
                this.MyOwner.set(object.MyOwner.ID, object.MyOwner.Name);
            }
            if(object.DeliveryPerson!=undefined){
                this.DeliveryPerson.set(object.DeliveryPerson.ID, object.DeliveryPerson.DeliveryMan);
            }
        }
    }
}
export class CompanyViewModel{
    public ID:string
    public Name:string;
    set(id, name){
        this.ID=id;
        this.Name=name;
    }
}



