const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, productCount, categoryCount, request3DCount] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.category.count(),
            prisma.request3D.count()
        ]);

        const recentRequests = await prisma.request3D.findMany({
            orderBy: { id: 'desc' },
            take: 5,
            include: {
                product: {
                    select: { name: true }
                }
            }
        });

        const formattedRecentRequests = recentRequests.map(r => ({
            id: r.id,
            email: r.email,
            firstName: r.firstName || '',
            lastName: r.lastName || '',
            message: r.message || '',
            productName: r.product?.name || 'N/A',
            handled: r.handled,
            createdAt: r.createdAt
        }));
        
        const recentUsers = await prisma.user.findMany({
            orderBy: { id: 'desc' },
            take: 5,
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        
        const categoryStats = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { products: { _count: 'desc' } },
            take: 5
        });

        const formattedCategoryStats = categoryStats.map(c => ({
            name: c.name,
            productCount: c._count.products
        }));
        
        const productsByCategory = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        const formattedProductsByCategory = productsByCategory.map(c => ({
            month: c.name.substring(0, 3),
            amount: c._count.products
        })).slice(0, 9);

        const stats = {
            totalUsers: userCount,
            totalProducts: productCount,
            totalCategories: categoryCount,
            total3DRequests: request3DCount,
            recentUsers: recentUsers,
            recentRequests: formattedRecentRequests,
            popularCategories: formattedCategoryStats,
            productsByCategory: formattedProductsByCategory
        };

        return res.status(200).json({
            message: "Dashboard stats retrieved successfully",
            data: stats
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};