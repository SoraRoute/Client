const customerRepository = require("../Repositories/customerRepository");
const passwordUtil = require("../Utils/password");
const verificationCodeService = require("./verificationCodeService");
const jwtProvider = require("../Utils/jwtProvider");

class customerService {

    async registerCustomer(customerData) {

        //check whether the email is already registered
        const existingCustomer = await customerRepository.findCustomerByEmail(
            customerData.email
        );

        if (existingCustomer) {
            throw new Error("Email already registered");
        }

        await verificationCodeService.sendVerificationCode(
            customerData.email,
            "REGISTER"
        );

        return {
            success: true,
            message: "OTP sent successfully. Please verify your email"
        };
    }

    async verifyEmail(customerData, otp) {

        await verificationCodeService.verifyCode(
            customerData.email,
            "REGISTER",
            otp
        );

        customerData.password = await passwordUtil.hashPassword(
            customerData.password
        );

        const customerId = await customerRepository.createCustomer(
            customerData
        );

        return {
            success: true,
            message: "Customer registered successfully",
            customerId
        };
    }

    async loginCustomer(loginData) {

        const customer = await customerRepository.findCustomerByEmail(
            loginData.email
        );

        if (!customer) {
            throw new Error("Invalid Email or Password");
        }

        const isPasswordCorrect = await passwordUtil.comparePassword(
            loginData.password,
            customer.password
        );

        if (!isPasswordCorrect) {
            throw new Error("Invalid Email or Password");
        }

        const token = jwtProvider.generateToken({
            customerId: customer.id,
            role: customer.role
        });

        //send back data
        const customerResponse = {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            mobile: customer.mobile,
            role: customer.role
        };

        return {
            success: true,
            message: "Login successful",
            token,
            customer: customerResponse
        };
    }

}

module.exports = new customerService();