
import jwt from 'jsonwebtoken';


// פונקציה ליצירת טוקן עם הרשאות
export const generateToken = (myUser) => {
    // אם יש ב-req את המשתמש (למשל אחרי התחברות), נשלוף את הנתונים
    const user = myUser;

    const secretKey = process.env.JWT_SECRET || 'secret';  // מחרוזת סודית פרטית לשרת

    // אם יש משתמש, יוצרים טוקן עם פרטי המשתמש
    if (user) {
        const token = jwt.sign(
            { id: user._id, role: user.role }, // נתוני המשתמש
            secretKey,                         // המפתח הסודי
            { expiresIn: '1h' }               // הגדרת זמן תפוגה של 1 שעה
        );
        return token;
    } else {
        // אם אין משתמש ב-req (אורח), יוצרים טוקן עם מידע מינימלי (למשל אפשרות לעקוב אחרי אורחים)
        const token = jwt.sign(
            { role: 'guest' },                  // לאנשים אורחים אין מידע מלא כמו _id או role נוסף
            secretKey,                         // המפתח הסודי
            { expiresIn: '2h' }               // הגדרת זמן תפוגה של 2 שעה
        );
        return token;
    }
}