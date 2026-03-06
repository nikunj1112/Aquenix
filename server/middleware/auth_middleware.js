import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {

  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      success:false,
      message:"Not Authorized"
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();

  } catch {

    return res.status(401).json({
      success:false,
      message:"Invalid Token"
    });

  }

};