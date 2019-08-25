export class DistanceTotalModel {
    public dbDistanceTotal: Number;
    public dbTotalCal: Number;
    public dbTotalTimeRun: Number;
    public dbKmPointsUser: Number;

    constructor(public totalDistance: Number, public totalCal: number, public totalTimeRun: Number,
    public KmPointsUser: Number){

        this.dbTotalCal = totalDistance;
        this.dbTotalCal = totalCal;
        this.dbTotalTimeRun = totalTimeRun;
        this.dbKmPointsUser = KmPointsUser;
    }

   
} 