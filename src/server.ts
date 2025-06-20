import App from "./app"
import { UploadRoute } from "./routes/upload.route";
import { AuthRoute } from "./routes/auth.routes";
import { PropertyRoute } from "./routes/property.route";
import { MessageRoute } from "./routes/message.route";
import { UserRoute } from "./routes/user.routes";
import { ReviewRoute } from "./routes/review.route";
import { VerificationRoute } from "./routes/verification.route";

const application = new App([
  new UploadRoute(),
  new AuthRoute(),
  new PropertyRoute(),
  new MessageRoute(),
  new UserRoute(),
  new ReviewRoute(),
  new VerificationRoute(),
]);

application.startServer();
