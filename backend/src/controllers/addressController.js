const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Create a new address
 * @route   POST /api/addresses
 * @access  Private (Admin)
 */
exports.createAddress = async (req, res) => {
    const { addressTypeId, address, phone1, phone2, email } = req.body;
    try {
        if (!addressTypeId || !address || !phone1 || !email) {
            return res.status(400).json({ message: "addressTypeId, address, phone1, and email are required" });
        }

        const parseAddressTypeId = parseInt(addressTypeId, 10);
        if (isNaN(parseAddressTypeId)) {
            return res.status(400).json({ message: "Invalid addressTypeId" });
        }

        const addressType = await prisma.addressType.findUnique({
            where: { id: parseAddressTypeId }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        const newAddress = await prisma.address.create({
            data: {
                addressTypeId: parseAddressTypeId,
                address,
                phone1,
                phone2,
                email
            }
        });

        return res.status(201).json({
            message: "Address created successfully",
            data: newAddress
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all addresses
 * @route   GET /api/addresses
 * @access  Public
 */
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            include: {
                addressType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        return res.status(200).json({
            message: "Addresses fetched successfully",
            data: addresses,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get address by ID
 * @route   GET /api/addresses/:id
 * @access  Public
 */
exports.getAddressById = async (req, res) => {
    const { id } = req.params;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
    }

    try {
        const address = await prisma.address.findUnique({
            where: { id: addressId },
            include: {
                addressType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({
            message: "Address fetched successfully",
            data: address,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update an address
 * @route   PUT /api/addresses/:id
 * @access  Private (Admin)
 */
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { addressTypeId, address, phone1, phone2, email } = req.body;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
    }

    try {
        const addressRecord = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!addressRecord) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (addressTypeId) {
            const parseAddressTypeId = parseInt(addressTypeId, 10);
            if (isNaN(parseAddressTypeId)) {
                return res.status(400).json({ message: "Invalid addressTypeId" });
            }
            const addressType = await prisma.addressType.findUnique({
                where: { id: parseAddressTypeId }
            });
            if (!addressType) {
                return res.status(404).json({ message: "Address type not found" });
            }
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                addressTypeId: addressTypeId ? parseInt(addressTypeId, 10) : undefined,
                address,
                phone1,
                phone2,
                email
            }
        });

        return res.status(200).json({
            message: "Address updated successfully",
            data: updatedAddress
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:id
 * @access  Private (Admin)
 */
exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
        return res.status(400).json({ message: "Invalid address ID" });
    }

    try {
        const addressRecord = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!addressRecord) {
            return res.status(404).json({ message: "Address not found" });
        }

        await prisma.address.delete({
            where: { id: addressId }
        });

        return res.status(200).json({
            message: "Address deleted successfully"
        });

    } catch (error) {
        return InternalServer(res, error);
    }
};