const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = "user";

    const userExists = await User.findOne({
      where: { username }
    });

    if (userExists) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        username: newUser.username,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đăng ký thất bại!", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đăng nhập thất bại!", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ 
      message: 'Đăng xuất thành công',
      success: true 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đăng xuất thất bại!", error: error.message });
  }
};