class CookieHelper{
    setAuthCookie(res,token){

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:24*60*60*1000
        });
    }
    clearAuthCookie(res){

        res.clearCookie("access_token");
    }
}
module.exports = new CookieHelper();