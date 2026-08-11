const bcrypt = require('bcryptjs');
const {
  User,
  Patient,
  Doctor,
  Pharmacist,
  Administrator,
  Department,
} = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../middleware/auth');

/**
 * Register new user with role-specific profile creation
 */
const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      role = 'patient',
      first_name,
      last_name,
      phone,
      department_id,
      // Role specific fields
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      specialization,
      license_number,
      consultation_fee,
      shift,
    } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required.',
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password_hash,
      role,
      first_name,
      last_name,
      phone,
      department_id: department_id || null,
    });

    // Create associated profile
    if (role === 'patient') {
      await Patient.create({
        user_id: user.id,
        date_of_birth: date_of_birth || null,
        gender: gender || null,
        blood_group: blood_group || null,
        address: address || null,
        emergency_contact_name: emergency_contact_name || null,
        emergency_contact_phone: emergency_contact_phone || null,
      });
    } else if (role === 'doctor') {
      await Doctor.create({
        user_id: user.id,
        specialization: specialization || 'General Practitioner',
        license_number: license_number || `MDCN-${Date.now()}`,
        department_id: department_id || null,
        consultation_fee: consultation_fee || 5000.00,
      });
    } else if (role === 'pharmacist') {
      await Pharmacist.create({
        user_id: user.id,
        license_number: license_number || `PCN-${Date.now()}`,
        shift: shift || 'Morning',
      });
    } else if (role === 'admin') {
      await Administrator.create({
        user_id: user.id,
        admin_level: 'Admin',
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: tokenPayload,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Department, as: 'department' },
        { model: Patient, as: 'patient_profile' },
        { model: Doctor, as: 'doctor_profile' },
        { model: Pharmacist, as: 'pharmacist_profile' },
        { model: Administrator, as: 'admin_profile' },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const profileId = user.patient_profile?.id || user.doctor_profile?.id || user.pharmacist_profile?.id || user.admin_profile?.id || null;

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_id: profileId,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          profile_id: profileId,
          department: user.department,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.',
      });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
      });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User account inactive or not found.',
      });
    }

    const newPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_id: decoded.profile_id,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Department, as: 'department' },
        { model: Patient, as: 'patient_profile' },
        { model: Doctor, as: 'doctor_profile' },
        { model: Pharmacist, as: 'pharmacist_profile' },
        { model: Administrator, as: 'admin_profile' },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
