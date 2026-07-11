/**
 * Shared Module
 *
 * This file is used by both Customer and Seller modules.
 * Changes to this file may affect multiple parts of the application.
 * Discuss breaking changes with the team before modifying.
 */
/**
 * ---------------------------------------------------------
 * Application Roles
 * ---------------------------------------------------------
 * Central location for user roles.
 *
 * CUSTOMER
 * SELLER
 * ADMIN
 *
 * Prevents hardcoding role strings throughout
 * the application.
 *
 * Author: Shared Module
 * ---------------------------------------------------------
 */
module.exports={
    CUSTOMER:"customer",
    SELLER:"seller",
    ADMIN:"admin"
};