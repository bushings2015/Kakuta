const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Create a new address type
 * @route   POST /api/address-types
 * @access  Private (Admin)
 */
exports.createAddressType = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Address type name is required" });
        }

        const newAddressType = await prisma.addressType.create({
            data: { name }
        });

        return res.status(201).json({
            message: "Address type created successfully",
            data: newAddressType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all address types
 * @route   GET /api/address-types
 * @access  Public
 */
exports.getAllAddressTypes = async (req, res) => {
    try {
        const addressTypes = await prisma.addressType.findMany({
            orderBy: { id: 'asc' }
        });
        
        return res.status(200).json({
            message: "Address types fetched successfully",
            data: addressTypes
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get address type by ID
 * @route   GET /api/address-types/:id
 * @access  Public
 */
exports.getAddressTypeById = async (req, res) => {
    const { id } = req.params;
    const addressTypeId = parseInt(id, 10);

    if (isNaN(addressTypeId)) {
        return res.status(400).json({ message: "Invalid address type ID" });
    }

    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: addressTypeId }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        return res.status(200).json({
            message: "Address type fetched successfully",
            data: addressType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update an address type
 * @route   PUT /api/address-types/:id
 * @access  Private (Admin)
 */
exports.updateAddressType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const addressTypeId = parseInt(id, 10);

    if (isNaN(addressTypeId)) {
        return res.status(400).json({ message: "Invalid address type ID" });
    }

    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: addressTypeId }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        const updatedAddressType = await prisma.addressType.update({
            where: { id: addressTypeId },
            data: { name: name || addressType.name }
        });

        return res.status(200).json({
            message: "Address type updated successfully",
            data: updatedAddressType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete an address type
 * @route   DELETE /api/address-types/:id
 * @access  Private (Admin)
 */
exports.deleteAddressType = async (req, res) => {
    const { id } = req.params;
    const addressTypeId = parseInt(id, 10);

    if (isNaN(addressTypeId)) {
        return res.status(400).json({ message: "Invalid address type ID" });
    }

    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: addressTypeId }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        await prisma.addressType.delete({
            where: { id: addressTypeId }
        });

        return res.status(200).json({
            message: "Address type deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};