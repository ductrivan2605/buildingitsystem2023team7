function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/auth/signin');
    }
}


function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

module.exports = {checkAuthenticated, checkNotAuthenticated};