import jwt from 'jsonwebtoken';

const adminSecretKey = "ADMIN_SECRET_KEY";


const STATIC_ADMIN = {
  username: "Feqan2005",
  email: "merdanovf45@gmail.com",
  password: "feqan02082005" 
};

export const AdminControllers = {
  login: async (req, res) => {
    const { email, username, password } = req.body;

  
    const isEmailValid = email === STATIC_ADMIN.email;
    const isUsernameValid = username === STATIC_ADMIN.username;
    const isPasswordValid = password === STATIC_ADMIN.password;

    if ((isEmailValid || isUsernameValid) && isPasswordValid) {
      const token = jwt.sign(
        {
          userId: "static-admin",
          email: STATIC_ADMIN.email,
        },
        adminSecretKey,
        { expiresIn: "30d" }
      );

      return res.json({
        token,
        user: {
          username: STATIC_ADMIN.username,
          email: STATIC_ADMIN.email,
          role: "admin"
        }
      });
    }

    return res.status(401).json({ message: "Invalid credentials please correct info!" });
  },

  getAllAdmins: async (req, res) => {
   
    res.json([
      {
        username: STATIC_ADMIN.username,
        email: STATIC_ADMIN.email,
        role: "admin"
      }
    ]);
  }
};
