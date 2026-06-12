const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Create a new size for a product
 * @route   POST /api/sizes
 * @access  Private (Admin)
 */
exports.createSize = async (req, res) => {
    const { 
        productId, 
        holdingCapacityMetric, weightMetric, handleMovesMetric, barMovesMetric, drawingMovementMetric,
        holdingCapacityInch, weightInch, handleMovesInch, barMovesInch, drawingMovementInch
    } = req.body;

    try {
        const parseProductId = parseInt(productId, 10);
        if (isNaN(parseProductId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseProductId }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const newSize = await prisma.size.create({
            data: {
                productId: parseProductId,
                holdingCapacityMetric,
                weightMetric,
                handleMovesMetric,
                barMovesMetric,
                drawingMovementMetric,
                holdingCapacityInch,
                weightInch,
                handleMovesInch,
                barMovesInch,
                drawingMovementInch
            }
        });

        return res.status(201).json({
            message: "Size created successfully",
            data: newSize
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all sizes
 * @route   GET /api/sizes
 * @access  Public
 */
exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await prisma.size.findMany({
            include: { product: true },
            orderBy: { id: 'asc' }
        });
        
        return res.status(200).json({
            message: "Sizes fetched successfully",
            data: sizes
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get size by ID
 * @route   GET /api/sizes/:id
 * @access  Public
 */
exports.getSizeById = async (req, res) => {
    const { id } = req.params;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
        return res.status(400).json({ message: "Invalid size ID" });
    }

    try {
        const size = await prisma.size.findUnique({
            where: { id: sizeId },
            include: { product: true }
        });

        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        return res.status(200).json({
            message: "Size fetched successfully",
            data: size
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update a size
 * @route   PUT /api/sizes/:id
 * @access  Private (Admin)
 */
exports.updateSize = async (req, res) => {
    const { id } = req.params;
    const { 
        productId, 
        holdingCapacityMetric, weightMetric, handleMovesMetric, barMovesMetric, drawingMovementMetric,
        holdingCapacityInch, weightInch, handleMovesInch, barMovesInch, drawingMovementInch
    } = req.body;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
        return res.status(400).json({ message: "Invalid size ID" });
    }

    try {
        const size = await prisma.size.findUnique({
            where: { id: sizeId }
        });

        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        if (productId) {
            const parseProductId = parseInt(productId, 10);
            if (isNaN(parseProductId)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
            const product = await prisma.product.findUnique({
                where: { id: parseProductId }
            });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
        }

        const updatedSize = await prisma.size.update({
            where: { id: sizeId },
            data: {
                productId: productId ? parseInt(productId, 10) : undefined,
                holdingCapacityMetric,
                weightMetric,
                handleMovesMetric,
                barMovesMetric,
                drawingMovementMetric,
                holdingCapacityInch,
                weightInch,
                handleMovesInch,
                barMovesInch,
                drawingMovementInch
            }
        });

        return res.status(200).json({
            message: "Size updated successfully",
            data: updatedSize
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a size
 * @route   DELETE /api/sizes/:id
 * @access  Private (Admin)
 */
exports.deleteSize = async (req, res) => {
    const { id } = req.params;
    const sizeId = parseInt(id, 10);

    if (isNaN(sizeId)) {
        return res.status(400).json({ message: "Invalid size ID" });
    }

    try {
        const size = await prisma.size.findUnique({
            where: { id: sizeId }
        });

        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }

        await prisma.size.delete({
            where: { id: sizeId }
        });

        return res.status(200).json({
            message: "Size deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};


