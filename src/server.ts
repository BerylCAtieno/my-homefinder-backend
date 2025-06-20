import App from "./app"
import { UploadRoute } from "./routes/upload.route";
import { AuthRoute } from "./routes/auth.routes";
import { PropertyRoute } from "./routes/property.route";
import { MessageRoute } from "./routes/message.route";
import { UserRoute } from "./routes/user.routes";

const application = new App([
  new UploadRoute(),
  new AuthRoute(),
  new PropertyRoute(),
  new MessageRoute(),
  new UserRoute(),
]);

application.startServer();
