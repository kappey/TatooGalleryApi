const jwt = require("jsonwebtoken");

exports.authToken = (req, res, next) => {
    let token = req.header("authorization");

    if (!token) {
        return res.status(401).send("token is invalid or expired");
    }
    token = token.split(' ')[1];
    
    if(token === 'null'){
        return res.status(401).send("token is missing");
    }

    try {
        let decodeToken = jwt.verify(token, process.env.jwtSecret);
        req.userData = decodeToken;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send("token is invalid or expired");
    }
}
