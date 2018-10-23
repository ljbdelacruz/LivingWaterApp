import {PositionViewModel} from './positionViewModel.model'

export class UsersViewModel{
    public id:string;
    public firstname:string;
    public middlename:string;
    public lastname:string;
    public emailAddress:string;
    public contactNumber:string;
    public password:string;
    public repassword:string;
    public location:PositionViewModel;
    public address:string;
    public isClient:boolean;
    constructor(id, firstname, middlename, lastname, emailAddress, contactNumber, password, repassword){
        this.id=id;
        this.firstname=firstname;
        this.middlename=middlename;
        this.lastname=lastname;
        this.emailAddress=emailAddress;
        this.contactNumber=contactNumber;
        this.password=password;
        this.repassword=repassword;
        this.location=new PositionViewModel(0,0);

    }
    set(object:UsersViewModel){
        this.id=object.id;
        this.firstname=object.firstname;
        this.middlename=object.middlename;
        this.lastname=object.lastname;
        this.emailAddress=object.emailAddress;
        this.contactNumber=object.contactNumber;
        this.password=object.password;
        this.repassword=object.repassword;
    }
    setVM(object){
        this.id=object.ID;
        this.firstname=object.Firstname;
        this.middlename=object.MiddleName;
        this.lastname=object.Lastname;
        this.emailAddress=object.EmailAddress;
        this.contactNumber=object.ContactNumber;
        this.isClient=object.isClient;
    }
}