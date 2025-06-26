import jwt from "jsonwebtoken";

export function verifyAuth(req, res, next) {
  console.log(req.headers.authorization,"@req.headers")
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ message: "no authoriazion headers" });
  }
  jwt.verify(authorization, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res
        .status(401)
        .json({ message: "You are not authorized to access this" });
    }
    if (decoded) {
      console.log(decoded, "@decoded token");
      req.user = decoded;
      next();
    }
  });
}