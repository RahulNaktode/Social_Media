const getHome = (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to the Social Media API"
    })
}

const getHealth = (req, res) => {
    return res.json({
        success: true,
        message: "API is healthy"
    })
}

export { getHome, getHealth }