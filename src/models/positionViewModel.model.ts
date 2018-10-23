export class PositionViewModel{
    public longitude:number;
    public latitude:number;
    constructor(long, lat){
        this.longitude=long;
        this.latitude=lat;
    }
}
export class ClientOrderLocation extends PositionViewModel{
    public id:string;
    constructor(id, long, lat){
        super(long, lat);
        this.id=id;
    }
    set(object:ClientOrderLocation){
        this.longitude=object.longitude;
        this.latitude=object.latitude;
        this.id=object.id;
    }
}