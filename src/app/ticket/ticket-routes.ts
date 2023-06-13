import { Router } from "express";
import { routeHelper } from "../../utils";
import * as ticketController from "./ticket-controller";
import { authenticate, authenticateUser, authenticateUserOrCustomer} from "../../utils/middleware/auth";

const router = Router();

router.post("/create-ticket", authenticateUserOrCustomer, (req, res) => {
    routeHelper({ req, res, controller: ticketController.createTicket});
});

router.post("/update-ticket/:ticketId", authenticateUserOrCustomer, (req, res) => {
    routeHelper({ req, res, controller: ticketController.updateTicket});
});

router.get("/view-ticket/:ticketId", authenticateUserOrCustomer,(req, res) => {
    routeHelper({ req, res, controller: ticketController.viewTicketDetails});
});

router.get("/view-ticket-status/:ticketId", (req, res) => {
    routeHelper({ req, res, controller: ticketController.viewTicketStatus});
})

router.post("/add-comment/:ticketId", authenticateUserOrCustomer,  (req, res) => {
    routeHelper({ req, res, controller: ticketController.addComment});
});

router.post("/update-comment/:ticketId", authenticateUserOrCustomer, (req, res) => {
    routeHelper({ req, res, controller: ticketController.updateComment});
});

router.post("/delete-comment/:ticketId", authenticateUserOrCustomer,(req, res) => {
    routeHelper({ req, res, controller: ticketController.deleteComment});
});

router.post("/add-note/:ticketId",authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.addNote});
});

router.post("/update-note/:ticketId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.updateNote});
});

router.post("/delete-note/:ticketId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.deleteNote});
});

router.post("/assign-ticket/:ticketId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.assignTicket});
});

router.post("/unassign-ticket/:ticketId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.unAssignTicket});
});

router.post("/set-status/:ticketId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.setTicketStatus});
});

router.post("/reports", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: ticketController.deleteNote});
});

router.get("/reports", authenticateUser, ticketController.getReports);

export default router;