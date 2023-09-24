const{BookingService}=require('../services');
const {StatusCodes}=require('http-status-codes');
const {ErrorResponce,SuccessResponce}=require('../utils/common')
async function createBooking(req,res){
    try {
        console.log(req.body)
        const responce=await BookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noofSeats:req.body.noofSeats
        });
        
        SuccessResponce.data=responce;
        return res.status(StatusCodes.OK).json({SuccessResponce});
    } catch (error) {
        ErrorResponce.error=error;
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ErrorResponce});
    }
}

async function makePayment(req,res){
    try {
        console.log(req.body)
        const responce=await BookingService.makePayment({
            totalCost:req.body.totalCost,
            userId:req.body.userId,
            bookingId:req.body.bookingId
        });
        //console.log(responce)
        SuccessResponce.data=responce;
        return res.status(StatusCodes.OK).json({SuccessResponce});
    } catch (error) {
        //console.log("coming here-booking controler- error")
        ErrorResponce.error=error;
        //console.log("The error is booking-controller",error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ErrorResponce});
    }
}
module.exports={
    createBooking,
    makePayment
}