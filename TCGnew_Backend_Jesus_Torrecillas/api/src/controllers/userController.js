const userService = require('../services/userService');

// NUEVO: Registrar usuario
const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// NUEVO: Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
};

const getUsers = async (req, res) => {
  const { data, pagination } = await userService.getUsers(req.query);
  res.status(200).json({ success: true, data, pagination });
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: user });
};

// DELETE = baja lógica (active=false). Devolvemos el usuario para poder ver el cambio.
const deactivateUser = async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);
  res.status(200).json({ success: true, data: user });
};

module.exports = { createUser, getUsers, getUserById, updateUser, deactivateUser };