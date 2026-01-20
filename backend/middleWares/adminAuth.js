import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "Not Authorized Login Again!",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.statu(400).send({
        status: false,
        message: "Not Authorized Login Again!",
      });
    }
    next();
  } catch (error) {
    console.error("Error in Admin Login", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

export default adminAuth;
