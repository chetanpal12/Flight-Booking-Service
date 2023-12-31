const axios=require('axios');
const {BookingRepository}=require('../repositories');
const db=require('../models');
const{ServerConfig}=require('../config')
const{StatusCodes}=require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {Enums}=require('../utils/common');
const {BOOKED,CANCELLED}=Enums.BOOKING_STATUS;

const bookingRepository=new BookingRepository();

async function createBooking(data){
    const transaction=await db.sequelize.transaction();
    try {
        const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData=flight.data.SuccessResponce.data;
        
        if(data.noofSeats > flightData.totalSeats){
            throw new AppError('Not enough seats available',StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount=data.noofSeats * flightData.price;
        const bookingPayload={...data,totalCost:totalBillingAmount};
       
        const booking=await bookingRepository.createBooking(bookingPayload,transaction);
        
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:data.noofSeats
        })
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data){
    //console.log("booking services-data",data)
    
    const transaction=await db.sequelize.transaction();
    try {
        const bookingDetails=await bookingRepository.get(data.bookingId,transaction);
        //console.log("booking services-bookingdetails",bookingDetails)
        if(bookingDetails.status==CANCELLED){
            //console.log("throwing error from there")
            throw new AppError('The booking has expired',StatusCodes.BAD_REQUEST);
        }
        //console.log("not comes here")
        const bookingTime=new Date(bookingDetails.createdAt);
        const currentTime=new Date();
//here we implemented a feature in which we have to do payment in 5 minutes if we did't do the payment in 5 min then it check that if the payment time is more than 5 min than update the status to cancelled from initiated.
        if(currentTime-bookingTime>300000){
            
            await cancelBooking(data.bookingId);// this is done by cancel booking
            
            throw new AppError('The booking has expired',StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.totalCost!=data.totalCost){
            throw new AppError('The Payment of the amount doest match',StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId!=data.userId){
            throw new AppError('The user corresponding to the booking doest match',StatusCodes.BAD_REQUEST);
        }

        //we assume here that payment is successful
        await bookingRepository.update({status:BOOKED},data.bookingId,transaction);
        
        await transaction.commit();
    } catch (error) {
        //console.log("coming inside the catch part of booking-service and rollbacking")
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId){//check in 5 min the payment happens or not after the creation of payment if do not then update status 
    const transaction= await db.sequelize.transaction();
    try {
        const bookingDetails=await bookingRepository.get(bookingId,transaction);
        if(bookingDetails.status==CANCELLED){
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats:bookingDetails.noofSeats,
            dec:0
        });
        await bookingRepository.update({status:CANCELLED},bookingId,transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        console.log("Inside service")
        const time = new Date( Date.now() - 1000 * 300 ); // time 5 mins ago
        const response = await bookingRepository.cancelOldBookings(time);

        return response;
    } catch(error) {
        console.log(error);
    }
}

module.exports={
    createBooking,
    makePayment,
    cancelOldBookings
}