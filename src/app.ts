//Libraries
import express from "express";
import logger from "morgan";
//End of Libraries

//Middleware
import xss from "./middleware/xss.js";
import authenticated from "./middleware/auth.js";
import validationErrors from "./errors/validationerror.js";
//End of Middleware

//Routes
import shortenRouter from "./routes/shortener.js";
import longUrlLookup from "./routes/longUrlLookup.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
//End of Routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(xss); //Sanitize all user input before passing it to any end points.  No Cross-site scripting please. Thank you.
app.use(logger("dev")); //Enable Morgan logger using the DEV environment

app.use("/auth", authRouter); //Authentication route to log in and register new users

app.use(authenticated); //Everything from this point on requires a user to be logged in.

app.use("/shorten", shortenRouter); //Url Shortener route
app.use("/*", longUrlLookup); //Url Look up route
app.use("/user", userRouter); //User Route

app.use(validationErrors.errorHandler);

app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`);
});
