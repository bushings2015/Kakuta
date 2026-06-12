const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");
const { deleteFileFromSupabase, uploadModelFiles, uploadFileToSupabase } = require("../utils/supabaseStorage");

/**
 * Utility to map sizes for database
 */
const mapSizesForDB = (sizes) => sizes.map((s) => ({
    holdingCapacityMetric: s.holdingCapacityMetric || null,
    weightMetric: s.weightMetric || null,
    handleMovesMetric: s.handleMovesMetric || null,
    barMovesMetric: s.barMovesMetric || null,
    drawingMovementMetric: s.drawingMovementMetric || null,
    holdingCapacityInch: s.holdingCapacityInch || null,
    weightInch: s.weightInch || null,
    handleMovesInch: s.handleMovesInch || null,
    barMovesInch: s.barMovesInch || null,
    drawingMovementInch: s.drawingMovementInch || null,
}));

/**
 * Utility to extract storage path from Supabase public URL
 */
const extractPathFromUrl = (url) => {
    if (!url || !url.includes("/storage/v1/object/public/")) return null;
    return url.split("/storage/v1/object/public/")[1].split("/").slice(1).join("/");
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
    const { name, details, description, categoryId, sizes } = req.body;

    try {
        if (!name || !description || !categoryId) {
            return res.status(400).json({ message: "Name, description, and categoryId are required" });
        }

        const parseCategoryId = parseInt(categoryId, 10);
        if (isNaN(parseCategoryId)) {
            return res.status(400).json({ message: "Invalid categoryId" });
        }

        const category = await prisma.category.findUnique({ where: { id: parseCategoryId } });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                details,
                description,
                categoryId: parseCategoryId,
                sizes: sizes ? { create: mapSizesForDB(sizes) } : undefined,
            },
            include: { sizes: true, images: true, models: true },
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category
 * @access  Public
 */
exports.getProductByCategory = async (req, res) => {
    const { category } = req.query;

    try {
        let whereClause = {};
        if (category && category !== "All") {
            whereClause = {
                category: { name: category }
            };
        }

        let products = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: true,
                images: true
            },
            orderBy: { id: 'asc' }
        });

        products = products.map(p => ({
            ...p,
            images: p.images.sort((a, b) => {
                const aIsJpg = a.imageUrl?.toLowerCase().endsWith('.jpg');
                const bIsJpg = b.imageUrl?.toLowerCase().endsWith('.jpg');
                if (aIsJpg && !bIsJpg) return -1;
                if (!aIsJpg && bIsJpg) return 1;
                return 0;
            })
        }));

        return res.status(200).json({
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { sizes: true, images: true, models: true, category: true },
            orderBy: { id: 'asc' }
        });

        const sortedProducts = products.map(p => ({
            ...p,
            images: p.images.sort((a, b) => {
                const aIsJpg = a.imageUrl?.toLowerCase().endsWith('.jpg');
                const bIsJpg = b.imageUrl?.toLowerCase().endsWith('.jpg');
                if (aIsJpg && !bIsJpg) return -1;
                if (!aIsJpg && bIsJpg) return 1;
                return 0;
            })
        }));

        return res.status(200).json({
            message: "Products fetched successfully",
            data: sortedProducts
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { sizes: true, images: true, models: true, category: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.images.sort((a, b) => {
            const aIsJpg = a.imageUrl?.toLowerCase().endsWith('.jpg');
            const bIsJpg = b.imageUrl?.toLowerCase().endsWith('.jpg');
            if (aIsJpg && !bIsJpg) return -1;
            if (!aIsJpg && bIsJpg) return 1;
            return 0;
        });

        return res.status(200).json({
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get product images
 * @route   GET /api/products/:id/images
 * @access  Public
 */
exports.getProductImages = async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const images = await prisma.productImage.findMany({
            where: { productId },
            select: { imageUrl: true },
        });

        if (!images || images.length === 0) {
            return res.status(404).json({ message: "No images found for this product" });
        }

        images.sort((a, b) => {
            const aIsJpg = a.imageUrl?.toLowerCase().endsWith('.jpg');
            const bIsJpg = b.imageUrl?.toLowerCase().endsWith('.jpg');
            if (aIsJpg && !bIsJpg) return -1;
            if (!aIsJpg && bIsJpg) return 1;
            return 0;
        });

        return res.status(200).json({
            message: "Images fetched successfully",
            data: images
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Get product 3D models
 * @route   GET /api/products/:id/models
 * @access  Public
 */
exports.getProductModels = async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const models = await prisma.productModel.findMany({
            where: { productId },
            select: { gltfUrl: true, binUrl: true, stepUrl: true }
        });

        if (!models || models.length === 0) {
            return res.status(404).json({ message: "No 3D models found" });
        }

        return res.status(200).json({
            message: "Models fetched successfully",
            data: models
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, details, description, categoryId, sizes, updateType } = req.body;
    const files = req.files;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { sizes: true, images: true, models: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let parseCategoryId = product.categoryId;
        if (categoryId) {
            parseCategoryId = parseInt(categoryId, 10);
            const category = await prisma.category.findUnique({ where: { id: parseCategoryId } });
            if (!category) return res.status(404).json({ message: "Category not found" });
        }

        if (updateType === "images" && files?.length > 0) {
            await Promise.all(product.images.map(img => {
                const path = extractPathFromUrl(img.imageUrl);
                return deleteFileFromSupabase(path, "images");
            }));
            await prisma.productImage.deleteMany({ where: { productId } });

            const uploadedImages = await Promise.all(
                files.filter(f => f.mimetype.startsWith("image/"))
                    .map(f => uploadFileToSupabase(f, "images"))
            );
            const imagesData = uploadedImages.map(f => ({ productId, imageUrl: f.url }));
            if (imagesData.length > 0) await prisma.productImage.createMany({ data: imagesData });
        }

        if (updateType === "models" && files?.length > 0) {
            await Promise.all(
                product.models.flatMap(model => [
                    extractPathFromUrl(model.gltfUrl),
                    extractPathFromUrl(model.binUrl),
                    extractPathFromUrl(model.stepUrl)
                ].filter(Boolean)).map(p => deleteFileFromSupabase(p, "models"))
            );
            await prisma.productModel.deleteMany({ where: { productId } });

            const uploadedModels = await uploadModelFiles(files, productId);

            if (Object.keys(uploadedModels).length > 0) {
                await prisma.productModel.create({
                    data: {
                        productId,
                        gltfUrl: uploadedModels.gltf?.url || null,
                        binUrl: uploadedModels.bin?.url || null,
                        stepUrl: uploadedModels.step?.url || null,
                    },
                });
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name || product.name,
                details: details || product.details,
                description: description || product.description,
                categoryId: parseCategoryId,
                sizes: sizes ? { deleteMany: {}, create: mapSizesForDB(sizes) } : undefined,
            },
            include: { sizes: true, images: true, models: true },
        });

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { deleteType } = req.query;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { images: true, models: true, sizes: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (deleteType === "images") {
            await Promise.all(product.images.map(img => {
                const path = extractPathFromUrl(img.imageUrl);
                return deleteFileFromSupabase(path, "images");
            }));
            await prisma.productImage.deleteMany({ where: { productId } });
            return res.status(200).json({ message: "Images deleted successfully" });
        }

        if (deleteType === "models") {
            await Promise.all(
                product.models.flatMap(m => [
                    extractPathFromUrl(m.gltfUrl),
                    extractPathFromUrl(m.binUrl),
                    extractPathFromUrl(m.stepUrl)
                ].filter(Boolean)).map(p => deleteFileFromSupabase(p, "models"))
            );
            await prisma.productModel.deleteMany({ where: { productId } });
            return res.status(200).json({ message: "Models deleted successfully" });
        }

        // Delete all associated files
        await Promise.all(product.images.map(img => {
            const path = extractPathFromUrl(img.imageUrl);
            return deleteFileFromSupabase(path, "images");
        }));
        await Promise.all(
            product.models.flatMap(m => [
                extractPathFromUrl(m.gltfUrl),
                extractPathFromUrl(m.binUrl),
                extractPathFromUrl(m.stepUrl)
            ].filter(Boolean)).map(p => deleteFileFromSupabase(p, "models"))
        );

        await prisma.productImage.deleteMany({ where: { productId } });
        await prisma.productModel.deleteMany({ where: { productId } });
        await prisma.size.deleteMany({ where: { productId } });
        await prisma.product.delete({ where: { id: productId } });

        return res.status(200).json({
            message: "Product and all files deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Upload product images
 * @route   POST /api/products/:id/images
 * @access  Private (Admin)
 */
exports.uploadImages = async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    try {
        const uploaded = await Promise.all(
            req.files.filter(f => f.mimetype.startsWith("image/"))
                .map(f => uploadFileToSupabase(f, "images"))
        );

        const imagesData = uploaded.map(f => ({
            productId: productId,
            imageUrl: f.url,
        }));

        await prisma.productImage.createMany({ data: imagesData });

        return res.status(201).json({
            message: "Images uploaded successfully",
            data: imagesData
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Upload product 3D model
 * @route   POST /api/products/:id/models
 * @access  Private (Admin)
 */
exports.uploadModel = async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No model files uploaded" });
    }

    try {
        const uploadedFiles = await uploadModelFiles(files, productId);

        if (!uploadedFiles.gltf || !uploadedFiles.bin) {
            return res.status(400).json({ message: "GLTF and BIN files are required" });
        }

        const newModel = await prisma.productModel.create({
            data: {
                productId: productId,
                gltfUrl: uploadedFiles.gltf.url,
                binUrl: uploadedFiles.bin.url,
                stepUrl: uploadedFiles.step?.url || null,
            },
        });

        return res.status(201).json({
            message: "Model uploaded successfully",
            data: newModel,
            files: {
                gltf: uploadedFiles.gltf.fileName,
                bin: uploadedFiles.bin.fileName,
                step: uploadedFiles.step?.fileName,
            }
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};