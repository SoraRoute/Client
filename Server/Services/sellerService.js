const db = require("../Config/dbConnection");
const bcrypt = require("bcrypt");
const sellerRepository = require("../Repositories/sellerRepository");
const jwtProvider = require("../Utils/jwtProvider");


class SellerService{
    async registerSeller(sellerData){
        const connection = await db.getConnection();

        try{
            await connection.beginTransaction();

            const existingSeller = await sellerRepository.findSellerByEmail(
                connection,sellerData.email
            );

            if(existingSeller.length > 0){
                throw new Error("Email Already Registered.")
            }

            const hashedPassword = await bcrypt.hash(sellerData.passwordd,10);
            sellerData.passwordd = hashedPassword;

            const sellerId = await sellerRepository.createSeller(connection,sellerData);

            await sellerRepository.createAddress(connection,sellerId,sellerData.address);

            await sellerRepository.createBusinessDetails(connection,sellerId,sellerData.business);

            await sellerRepository.createBankDetails(connection,sellerId,sellerData.bank);

            await connection.commit();

            return{
            message:"Seller Registered Successfully",
            sellerId
        };

        }catch(error){

            await connection.rollback();
            throw error;

        }finally{
            connection.release();
        }
    }

    async loginSeller(loginData){
        const connection = await db.getConnection();
        try{
            const existingSeller = await sellerRepository.findSellerByEmail(connection,loginData.email);

            if(existingSeller.length === 0){
                throw new Error("Invalid Email or Password");
            }

            const seller = existingSeller[0];

            const isMatch = await bcrypt.compare(
                loginData.passwordd,
                seller.passwordd
            );

            if(!isMatch){
                throw new Error("Invalid Email or Password");
            }

            const token = jwtProvider.generateToken({
                sellerId:seller.id,
                role:seller.role
            });

            return{
                message: "Login Successful",
                token:token
            };
        }
        catch(error){
            throw error;
        }
        finally{
            connection.release();
        }
            
    }

    async getSellerProfile(id){
        const connection = await db.getConnection();

        try{
            const existingSeller = await sellerRepository.getSellerById(connection,id);

            if(!existingSeller){
                throw new Error("Seller Do Not Exist.");
            }

            return existingSeller;

        }finally{
            connection.release();
        }
    }
}

module.exports = new SellerService();