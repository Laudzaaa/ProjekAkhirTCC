import { Member } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = '7d';

// ✅ Register member
export const registerMember = async (req, res) => {
  try {
    const { nama, email, nomor_identitas, nomor_hp, alamat, password } = req.body;
    
    // Check if email already exists
    const existing = await Member.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await Member.create({
      nama,
      email,
      nomor_identitas,
      nomor_hp,
      alamat,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id_member: member.id_member, email: member.email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(201).json({ 
      success: true, 
      message: 'Pendaftaran berhasil',
      data: { 
        id_member: member.id_member,
        email: member.email,
        nama: member.nama
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Login member
export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ where: { email } });
    if (!member) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Generate token
    const token = jwt.sign({ id_member: member.id_member, email: member.email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.json({ 
      success: true, 
      message: 'Login berhasil',
      data: {
        id_member: member.id_member,
        email: member.email,
        nama: member.nama,
        status: member.status
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get member profile
export const getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findByPk(req.user.id_member, {
      attributes: { exclude: ['password'] }
    });
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update member profile
export const updateMemberProfile = async (req, res) => {
  try {
    const { nama, nomor_hp, alamat } = req.body;
    
    const member = await Member.findByPk(req.user.id_member);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    }

    await member.update({ nama, nomor_hp, alamat });
    
    res.json({ 
      success: true, 
      message: 'Profil berhasil diperbarui',
      data: member 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all members (admin only)
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get member by ID (admin)
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete member (admin)
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member tidak ditemukan' });
    }

    await member.destroy();
    res.json({ success: true, message: 'Member berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
