function compareTime(departureTime,arrivalTime){
    let arrtime=new Date(arrivalTime);
    let deptime=new Date(departureTime);
    return arrtime.getTime()>deptime.getTime();
}
module.exports={
    compareTime
}