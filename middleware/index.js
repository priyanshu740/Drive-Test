// Middleware for driver authentication
export const driverMiddleware = (req,res,next) => {
    const user = req.session.userType;
    if (!user) {
    const errorMessage = "Invalid userType, Please login with DRIVER credentials.";
      const alertMessage = `
       <script>
         alert('${errorMessage}');
         window.location.href = '/login';
       </script>
    `;
        return res.send(alertMessage);
    }
    next();
}

// Middleware for admin authentication
export const authMiddleware = (req,res,next) => {
    const user = req.session.userType;
    if (!user) {
    const errorMessage = "Invalid userType, Please login with ADMIN credentials.";
      const alertMessage = `
       <script>
         alert('${errorMessage}');
         window.location.href = '/login';
       </script>
    `;
        return res.send(alertMessage);
    }
    next();
}
 

 
  
  