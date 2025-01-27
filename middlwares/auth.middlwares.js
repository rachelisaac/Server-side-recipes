import jwt from 'jsonwebtoken';

// יצירת מידלוואר שיבדוק את הטוקן בכל בקשה שדורשת הרשאות
export const auth = async (req, res, next) => {
    console.log("enter to auth")
    const { authorization } = req.headers;// מהreq שןלף את ההדר שנקרא אוטוריזישן 
    console.log(authorization)
    if (!authorization) {
        req.user_role = "guest";  // אם אין טוקן, נחשב את המשתמש כאורח
        req.user_id = null;  // לא קיים id למי שאין טוקן
        console.log("creat a guest")
        return next();  // תמשיך בפונקציה הבאה
    }
    let token = authorization.split(' ')[1];
    console.log(token)
    const secretKey = process.env.JWT_SECRET || 'secret';
    try {
        const user = await jwt.verify(token, secretKey);
        if (user) {
            console.log("enter to if (user)")
            console.log(user);
            
            req.user_id = user.id;
            req.user_role = user.role;
            console.log(user)
        }
        else {
            req.user_role = "guest"
            req.user_id = "undefined"
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
export const adminAuth = (req, res, next) => {
    console.log(req.user_role)
    if (req.user_role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Unauthorized: Admins only!!!!' });
};
