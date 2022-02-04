module.exports.isAuth = (req, res, next) => {
    if(req.method == 'GET'){
        if(req.isAuthenticated()){
            next()
        } else{
            res.redirect('/login')
        }
    } else if(req.method == 'POST'){
        if(req.isAuthenticated()){
            next()
        } else{
            res.status(401).send();
        }
    }
}

module.exports.authBlock = (req, res, next) => {
    if(req.method == 'GET'){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        } else{
            next()
        }
    }
}

module.exports.authBlockSettings = (req, res, next) => {
    if(req.method == 'GET'){
        if(req.isAuthenticated()){
            res.redirect('/settings')
        } else{
            next()
        }
    }
}