import jwt from'jsonwebtoken';

// יצירת מידלוואר שיבדוק את הטוקן בכל בקשה שדורשת הרשאות
export const auth = (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authorization.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || 'secret';

    try {
        const user = jwt.verify(token, secretKey);
        
        req.user_id = user.id;
        req.user_role = user.role;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


export const adminAuth = (req, res, next) => {
    if (req.user_role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Unauthorized: Admins only' });
};
