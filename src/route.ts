import { Request, Response, Router } from "express";
import userRoutes from "./app/user/user-routes";
import customerRoutes from "./app/customer/customer-routes";
import ticketRoutes from "./app/ticket/ticket-routes";
const routes = Router({ mergeParams: true });

routes.route("/").get((req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Fincra Customer Support" });
});

routes.use("/customer", customerRoutes);

routes.use("/user", userRoutes);

routes.use("/ticket", ticketRoutes);


export default routes;
