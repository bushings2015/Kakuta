const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });

        return res.status(201).json({
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: 'asc' }
        });
        
        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            data: category
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { name: name || category.name }
        });

        return res.status(200).json({
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({
            where: { id: categoryId }
        });

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};