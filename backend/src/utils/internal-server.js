const InternalServer = (res, error) => {
    console.log('Error:', error);
    return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    });
};

module.exports = InternalServer