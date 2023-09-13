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
module.exports={
    createBooking
}