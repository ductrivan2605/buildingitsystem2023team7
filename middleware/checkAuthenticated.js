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

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    } else {
      res.redirect('/'); 
    }
  }

module.exports = {checkAuthenticated, checkNotAuthenticated, checkAdmin};