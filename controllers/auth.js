
import bcrypt from "bcryptjs";
import { userData } from "../model/userModel.js";

// For registering userData when sign IN
export const registerUserData = async (req, res) => {
  const { username, password, confirmPassword, userType } = req.body;

  if (!username) {
    res.status(400).send({ message: "Add username to register." });
  }
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    const user = await userData.findOne({ username: username });
    if (user) {
      const errorMessage = "User already exists, please login to continue.";
      const alertMessage = `
       <script>
         alert('${errorMessage}');
         window.location.href = '/login';
       </script>
    `;
      res.send(alertMessage);
    } else {
      const userRegistration = new userData({ username, password, userType });
      const newUser = await userRegistration.save();

      req.session.user_id = newUser._id;

      const successMessage = "User registration successful.";
      const onSuccess = `
       <script>
         alert('${successMessage}');
         window.location.href = '/';
       </script>
    `;
      res.send(onSuccess);
    }
  } catch (error) {
    console.log(error, "error in registerUserData API");
    return res.status(500).send("Internal Server Error.");
  }
};

// To login to drivetest
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userData.findOne({ username });

    // If user does not exist
    if (!user) {
      const verifyUserMessage = "User not found, Please enter correct username and password.";
      const verifyUser = `
         <script>
           alert('${verifyUserMessage}');
           window.location.href = '/login';
         </script>
        `;
      return res.send(verifyUser);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const passwordMessage = "Please enter correct password.";
      const checkPassword = `
         <script>
           alert('${passwordMessage}');
           window.location.href = '/login';
         </script>
        `;

      res.status(200).send({ checkPassword: checkPassword, user: user })
      return res.send(checkPassword);
    }

    req.session.username = user.username;

    req.session.userType = user.userType;

    const successMessage = "Login successfully.";
    const redirectToDashboard = `
         <script>
           alert('${successMessage}');
           window.location.href = '/';
         </script>
      `;
    res.send(redirectToDashboard);
  } catch (error) {
    console.log(error, "error in loginUser API");
    return res.status(500).send("Internal Server Error");
  }
};

// Destroying session after logout
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.redirect("/login");
  });
};


