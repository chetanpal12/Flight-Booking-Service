const {StatusCodes}=require('http-status-codes');

const {Booking}=require('../models');
const CrudRepository=require('./crud-repository');
const { Op } = require("sequelize");
const {Enums} = require('../utils/common');
const { CANCELLED, BOOKED } = Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking)
    }

    async createBooking(data,transaction){
        const responce=await Booking.create(data,{transaction:transaction});
        return responce;
    }
//instead of this.model you can use "Booking"
    async get(data,transaction){
        const responce=await Booking.findByPk(data,{transaction:transaction});
        if(!responce){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        //console.log("booking-repository",responce)
        return responce;
        
    }

    async update(data,id,transaction){
        const responce=await this.model.update(data,{
            where:{
                id:id
            }
        },{transaction:transaction});
        
        return responce;
        
    }

    async cancelOldBookings(timestamp) {
        console.log("in repo")
        const response = await Booking.update({status: CANCELLED},{
            where: {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lt]: timestamp
                        }
                    }, 
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne]: CANCELLED
                        }
                    }
                ]

            }
        });
        return response;
    }
}

module.exports= BookingRepository;