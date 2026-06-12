const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

/**
 * @desc    Get all 3D model requests
 * @route   GET /api/requests-3d
 * @access  Private (Admin)
 */
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.request3D.findMany({
            include: {
                product: {
                    select: { name: true }
                }
            },
            orderBy: { id: 'desc' }
        });

        const formattedRequests = requests.map(request => ({
            id: request.id,
            email: request.email,
            firstName: request.firstName || '',
            lastName: request.lastName || '',
            message: request.message || '',
            productName: request.product?.name || 'N/A',
            handled: request.handled,
            createdAt: request.createdAt
        }));

        return res.status(200).json({
            message: "3D requests retrieved successfully",
            data: formattedRequests
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Update request status
 * @route   PATCH /api/requests-3d/:id/status
 * @access  Private (Admin)
 */
exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const requestId = parseInt(id, 10);

    if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
    }

    try {
        const { handled } = req.body;

        const updatedRequest = await prisma.request3D.update({
            where: { id: requestId },
            data: { handled: handled },
            include: {
                product: {
                    select: { name: true }
                }
            }
        });

        return res.status(200).json({
            message: "Request status updated successfully",
            data: {
                id: updatedRequest.id,
                email: updatedRequest.email,
                firstName: updatedRequest.firstName || '',
                lastName: updatedRequest.lastName || '',
                message: updatedRequest.message || '',
                productName: updatedRequest.product?.name || 'N/A',
                handled: updatedRequest.handled,
                createdAt: updatedRequest.createdAt
            }
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};

/**
 * @desc    Delete a request
 * @route   DELETE /api/requests-3d/:id
 * @access  Private (Admin)
 */
exports.deleteRequest = async (req, res) => {
    const { id } = req.params;
    const requestId = parseInt(id, 10);

    if (isNaN(requestId)) {
        return res.status(400).json({ message: "Invalid request ID" });
    }

    try {
        await prisma.request3D.delete({
            where: { id: requestId }
        });

        return res.status(200).json({
            message: "Request deleted successfully"
        });
    } catch (error) {
        return InternalServer(res, error);
    }
};