const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Create a new content type
 * @route   POST /api/content-types
 * @access  Private (Admin)
 */
exports.createContentType = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Content type name is required" });
        }

        const newContentType = await prisma.contentType.create({
            data: { name }
        });

        return res.status(201).json({
            message: "Content type created successfully",
            data: newContentType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all content types
 * @route   GET /api/content-types
 * @access  Public
 */
exports.getAllContentType = async (req, res) => {
    try {
        const contentTypes = await prisma.contentType.findMany({
            orderBy: { id: 'asc' }
        });
        
        return res.status(200).json({
            message: "Content types fetched successfully",
            data: contentTypes
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get content type by ID
 * @route   GET /api/content-types/:id
 * @access  Public
 */
exports.getContentTypeById = async (req, res) => {
    const { id } = req.params;
    const contentTypeId = parseInt(id, 10);

    if (isNaN(contentTypeId)) {
        return res.status(400).json({ message: "Invalid content type ID" });
    }

    try {
        const contentType = await prisma.contentType.findUnique({
            where: { id: contentTypeId }
        });

        if (!contentType) {
            return res.status(404).json({ message: "Content type not found" });
        }

        return res.status(200).json({
            message: "Content type fetched successfully",
            data: contentType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update a content type
 * @route   PUT /api/content-types/:id
 * @access  Private (Admin)
 */
exports.updateContentType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const contentTypeId = parseInt(id, 10);

    if (isNaN(contentTypeId)) {
        return res.status(400).json({ message: "Invalid content type ID" });
    }

    try {
        const contentType = await prisma.contentType.findUnique({
            where: { id: contentTypeId }
        });

        if (!contentType) {
            return res.status(404).json({ message: "Content type not found" });
        }

        const updatedContentType = await prisma.contentType.update({
            where: { id: contentTypeId },
            data: { name: name || contentType.name }
        });

        return res.status(200).json({
            message: "Content type updated successfully",
            data: updatedContentType
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a content type
 * @route   DELETE /api/content-types/:id
 * @access  Private (Admin)
 */
exports.deleteContentType = async (req, res) => {
    const { id } = req.params;
    const contentTypeId = parseInt(id, 10);

    if (isNaN(contentTypeId)) {
        return res.status(400).json({ message: "Invalid content type ID" });
    }

    try {
        const contentType = await prisma.contentType.findUnique({
            where: { id: contentTypeId }
        });

        if (!contentType) {
            return res.status(404).json({ message: "Content type not found" });
        }

        await prisma.contentType.delete({
            where: { id: contentTypeId }
        });

        return res.status(200).json({
            message: "Content type deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};
