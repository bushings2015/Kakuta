const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");
const { uploadFileToSupabase, deleteFileFromSupabase } = require("../utils/supabaseStorage");

/**
 * @desc    Create a new content
 * @route   POST /api/contents
 * @access  Private (Admin)
 */
exports.createContent = async (req, res) => {
    try {
        const { contentTypeId, language, title, detail, isPublished } = req.body;

        if (!contentTypeId || !language || !title) {
            return res.status(400).json({ message: "contentTypeId, language, and title are required" });
        }

        const parseContentTypeId = parseInt(contentTypeId, 10);
        if (isNaN(parseContentTypeId)) {
            return res.status(400).json({ message: "Invalid contentTypeId" });
        }

        const contentType = await prisma.contentType.findUnique({
            where: { id: parseContentTypeId }
        });

        if (!contentType) {
            return res.status(404).json({ message: "Content type not found" });
        }

        let imageUrl = null;
        if (req.file) {
            const uploaded = await uploadFileToSupabase(req.file, "content");
            imageUrl = uploaded.url;
        }

        const newContent = await prisma.content.create({
            data: {
                contentTypeId: parseContentTypeId,
                language: language.trim(),
                title: title.trim(),
                detail: detail ? detail.trim() : null,
                imageUrl: imageUrl,
                isPublished: isPublished === "true" || isPublished === true || false,
            },
            include: { contentType: true },
        });

        return res.status(201).json({
            message: "Content created successfully",
            data: newContent,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all contents
 * @route   GET /api/contents
 * @access  Public
 */
exports.getContents = async (req, res) => {
    try {
        const contents = await prisma.content.findMany({
            include: { contentType: true },
            orderBy: { id: 'asc' }
        });

        return res.status(200).json({
            message: "Contents fetched successfully",
            data: contents,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get content by ID
 * @route   GET /api/contents/:id
 * @access  Public
 */
exports.getContentById = async (req, res) => {
    const { id } = req.params;
    const contentId = parseInt(id, 10);

    if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
    }

    try {
        const content = await prisma.content.findUnique({
            where: { id: contentId },
            include: { contentType: true },
        });

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({
            message: "Content fetched successfully",
            data: content,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get contents by type
 * @route   GET /api/contents/type
 * @access  Public
 */
exports.getContentsByType = async (req, res) => {
    const { contentType } = req.query;

    try {
        const whereClause = {};
        if (contentType) {
            whereClause.contentType = {
                name: { equals: contentType }
            };
        }

        const contents = await prisma.content.findMany({
            where: whereClause,
            include: { contentType: true },
            orderBy: { id: 'asc' }
        });

        return res.status(200).json({
            message: "Contents fetched successfully",
            data: contents,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update a content
 * @route   PUT /api/contents/:id
 * @access  Private (Admin)
 */
exports.updateContent = async (req, res) => {
    const { id } = req.params;
    const contentId = parseInt(id, 10);

    if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
    }

    try {
        const { contentTypeId, language, title, detail, isPublished } = req.body;

        const oldContent = await prisma.content.findUnique({
            where: { id: contentId }
        });

        if (!oldContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (contentTypeId) {
            const parseContentTypeId = parseInt(contentTypeId, 10);
            if (isNaN(parseContentTypeId)) {
                return res.status(400).json({ message: "Invalid contentTypeId" });
            }
            const contentType = await prisma.contentType.findUnique({
                where: { id: parseContentTypeId }
            });
            if (!contentType) {
                return res.status(404).json({ message: "Content type not found" });
            }
        }

        let imageUrl = oldContent.imageUrl;
        if (req.file) {
            const uploaded = await uploadFileToSupabase(req.file, "content");
            imageUrl = uploaded.url;

            if (oldContent.imageUrl && oldContent.imageUrl.includes("/storage/v1/object/public/")) {
                const pathStart = oldContent.imageUrl.split("/storage/v1/object/public/")[1];
                await deleteFileFromSupabase(pathStart, "content");
            }
        }

        const updatedContent = await prisma.content.update({
            where: { id: contentId },
            data: {
                contentTypeId: contentTypeId ? parseInt(contentTypeId, 10) : undefined,
                language: language ? language.trim() : undefined,
                title: title ? title.trim() : undefined,
                detail: detail !== undefined ? (detail ? detail.trim() : null) : undefined,
                imageUrl: imageUrl,
                isPublished: isPublished !== undefined ? (isPublished === "true" || isPublished === true) : undefined,
            },
            include: { contentType: true },
        });

        return res.status(200).json({
            message: "Content updated successfully",
            data: updatedContent,
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a content
 * @route   DELETE /api/contents/:id
 * @access  Private (Admin)
 */
exports.deleteContent = async (req, res) => {
    const { id } = req.params;
    const contentId = parseInt(id, 10);

    if (isNaN(contentId)) {
        return res.status(400).json({ message: "Invalid content ID" });
    }

    try {
        const content = await prisma.content.findUnique({
            where: { id: contentId },
        });

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.imageUrl && content.imageUrl.includes("/storage/v1/object/public/")) {
            const pathStart = content.imageUrl.split("/storage/v1/object/public/")[1];
            await deleteFileFromSupabase(pathStart, "content");
        }

        await prisma.content.delete({
            where: { id: contentId },
        });

        return res.status(200).json({
            message: "Content deleted successfully",
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};
