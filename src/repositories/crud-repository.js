const { StatusCodes } = require("http-status-codes");
const { logger } = require("../config");
const AppError = require("../utils/errors/app-error");

class CrudRepository{
    constructor(model){
        this.model=model;
    }

    async create(data){
        const responce=await this.model.create(data);
        return responce;
    }

    async destroy(data){
        const responce=await this.model.destroy({
            where: {
                id:data
            }
        });
        if(!responce){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        return responce;
    }

    async get(data){
        const responce=await this.model.findByPk(data);
        if(!responce){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        return responce;
        
    }

    async getAll(){
        const responce=await this.model.findAll();
        return responce;
    }

    async update(data,id){
        const responce=await this.model.update(data,{
            where:{
                id:id
            }
        });
        
        if(!responce[0]){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        return responce;
        
    }
}

module.exports=CrudRepository;