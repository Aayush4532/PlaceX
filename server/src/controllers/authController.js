const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connection } = require("../config/dbConnect.js");
const redisClient = require("../config/redis");

const signup = async (req, res) => {
  try {
    let { name, email, student_email, password } = req.body;
    if (!name || !email || !password || !student_email) {
      return res.status(400).json({ error: "Name, email, student_email, and password are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    student_email = student_email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(student_email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!student_email.endsWith("@dtu.ac.in")) {
      return res.status(400).json({ error: "Only DTU students are allowed" });
    }

    const existingUser = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(
      `INSERT INTO users (name, email, student_email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, student_email, role, created_at`,
      [name, email, student_email, hashedPassword, "student"]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: email, name: name }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 });
    const reply = {
      name: user.name,
      email: user.email,
      id: user.id,
    }

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: reply,
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  email = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );


    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }


    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { id, name, role } = user.rows[0];

    const reply = {
      name: name,
      email: email,
      id: id,
      role: role,
    }

    const token = jwt.sign({ id: id, email: email, role: role }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 });
    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });
    res.status(201).json({
      user: reply,
      message: "Login Successfully"
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {

  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.cookie("token", null, {
      expires: new Date(Date.now()), httpOnly: true,
      secure: true,
      sameSite: "None"
    });
    res.status(200).send("Logged Out Successfully");
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login, logout };