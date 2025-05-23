import jwt from 'jsonwebtoken';

const adminSecretKey = "ADMIN_SECRET_KEY";

// Statik admin məlumatları
const STATIC_ADMIN = {
  username: "Feqan2005",
  email: "merdanovf45@gmail.com",
  password: "feqan02082005" // sadə şifrə (realda bcrypt istifadə etməlisiniz)
};

export const AdminControllers = {
  login: async (req, res) => {
    const { email, username, password } = req.body;

    // İstifadəçi doğru username və ya email + password göndəribsə
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

    return res.status(401).json({ message: "Invalid credentials" });
  },

  getAllAdmins: async (req, res) => {
    // Yalnız bir admin olduğu üçün onu qaytarırıq
    res.json([
      {
        username: STATIC_ADMIN.username,
        email: STATIC_ADMIN.email,
        role: "admin"
      }
    ]);
  }
};
