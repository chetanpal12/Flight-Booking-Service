const {StatusCodes}=require('http-status-codes');

const {Booking}=require('../models');
const CrudRepository=require('./crud-repository');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking)
    }

    async createBooking(data,transaction){
        const responce=await Booking.create(data,{transaction:transaction});
        return responce;
    }
}

module.exports= BookingRepository;