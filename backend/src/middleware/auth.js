const jwt = require('jsonwebtoken');

function auth(req, res, next){
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: 'No token' });
  const token = header.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

function role(required){
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'No user' });
    if (req.user.role !== required) return res.status(403).json({ msg: 'Forbidden' });
    next();
  }
}

module.exports = { auth, role };
