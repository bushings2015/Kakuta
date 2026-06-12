const prisma = require("../config/db");
const { JWT_SECRET, DEFAULT_ADMIN_PASSWORD } = require("../utils/constants");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const InternalServer = require("../utils/internal-server");
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUsername = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            message: "User registered successfully",
            data: userWithoutPassword
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    const { login, password } = req.body;

    try {
        if (!login || !password) {
            return res.status(400).json({ message: "Username/email and password are required" });
        }

        const isEmail = login.includes("@");
        const user = await prisma.user.findFirst({
            where: {
                OR: isEmail ? [{ email: login }] : [{ username: login }]
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or email" });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const jwtToken = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Login successful",
            data: {
                userId: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: jwtToken
            }
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Initialize default admin user (Not an Express route)
 */
exports.initializeAdminUser = async () => {
    try {
        const defaultAdminPassword = DEFAULT_ADMIN_PASSWORD || 'SecurePass!2025@Kakuta';
        const hashedPassword = await hashPassword(defaultAdminPassword);

        await prisma.user.upsert({
            where: { username: 'KakutaAdmin' },
            update: {},
            create: {
                username: 'KakutaAdmin',
                email: 'KakutaAdmin@example.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('Admin user initialized successfully!');
        if (!DEFAULT_ADMIN_PASSWORD) {
            console.warn('Warning: Using default admin password. Please set DEFAULT_ADMIN_PASSWORD environment variable.');
        }
    } catch (error) {
        console.error('Failed to initialize admin user:', error);
    }
};

/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.userInfo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        return res.status(200).json({
            message: "User info retrieved successfully",
            data: req.user
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;
        const dataToUpdate = { username, email };

        if (password && password.trim() !== "") {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        const { password: _, ...userWithoutPassword } = updatedUser;

        return res.status(200).json({
            message: "Profile updated successfully",
            data: userWithoutPassword
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};
