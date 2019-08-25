export class routeModel {
    public dbData: String;
    public dbDistance: Number;
    public dbCalorias: Number;
    public dbHoras: Number;
    public dbMinutos: Number;
    public dbSegundos: Number;
    public dbVelocidadeMedia: Number;
    public dbPath: Array<Object>;

    constructor(public data: String, public distance: Number, public calorias: Number, public hora: Number, 
    public minutos: Number,  public segundos: Number, public velocidadeMedia: Number, public path: Array<Object>){

       this.dbData = data;
       this.dbDistance = distance;
       this.dbCalorias = calorias;
       this.dbHoras = hora;
       this.dbMinutos = minutos;
       this.dbSegundos = segundos;
       this.dbVelocidadeMedia = velocidadeMedia;
       this.dbPath = path;
    }

   
} 