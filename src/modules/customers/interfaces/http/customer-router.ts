import { Router } from "express";
import { z } from "zod";

import { AppDataSource } from "../../../../main/config/data-source";
import { authMiddleware } from "../../../../main/http/middlewares/auth-middleware";
import { validateRequest } from "../../../../main/http/middlewares/validate-request";
import { addResponsibleToCustomer } from "../../application/use-cases/add-responsible-to-customer";
import { createCustomer } from "../../application/use-cases/create-customer";
import { deleteCustomer } from "../../application/use-cases/delete-customer";
import { getCustomerById } from "../../application/use-cases/get-customer-by-id";
import { getResponsible } from "../../application/use-cases/get-responsible";
import { listCustomers } from "../../application/use-cases/list-customers";
import { listResponsiblesByCustomer } from "../../application/use-cases/list-responsibles-by-customer";
import { removeResponsible } from "../../application/use-cases/remove-responsible";
import { searchCustomers } from "../../application/use-cases/search-customers";
import { updateCustomer } from "../../application/use-cases/update-customer";
import { updateResponsible } from "../../application/use-cases/update-responsible";
import {
  createResponsibleSchema,
  createCustomerSchema,
  updateCustomerSchema,
  updateResponsibleSchema,
} from "./customer-schemas";

const paramsSchema = z.object({
  customerId: z.string().uuid(),
  responsibleId: z.string().uuid().optional(),
});

export const customerRouter = Router();

customerRouter.use(authMiddleware);

customerRouter.get("/search", async (request, response) => {
  const query = z.string().trim().min(1).parse(request.query.query);
  const limit = z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .parse(request.query.limit ?? 10);
  const result = await searchCustomers(AppDataSource, query, limit);
  response.status(200).json(result);
});

customerRouter.post("/", validateRequest(createCustomerSchema), async (request, response) => {
  const result = await createCustomer(AppDataSource, request.body);
  response.status(201).json(result);
});

customerRouter.get("/", async (request, response) => {
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .parse(request.query.page ?? 1);
  const limit = z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .parse(request.query.limit ?? 10);
  const result = await listCustomers(AppDataSource, page, limit);
  response.status(200).json(result);
});

customerRouter.get("/:customerId", async (request, response) => {
  const { customerId } = paramsSchema.parse(request.params);
  const result = await getCustomerById(AppDataSource, customerId);
  response.status(200).json(result);
});

customerRouter.patch("/:customerId", validateRequest(updateCustomerSchema), async (request, response) => {
  const { customerId } = paramsSchema.parse(request.params);
  const result = await updateCustomer(AppDataSource, customerId, request.body);
  response.status(200).json(result);
});

customerRouter.delete("/:customerId", async (request, response) => {
  const { customerId } = paramsSchema.parse(request.params);
  await deleteCustomer(AppDataSource, customerId);
  response.status(204).send();
});

customerRouter.post(
  "/:customerId/responsibles",
  validateRequest(createResponsibleSchema),
  async (request, response) => {
    const { customerId } = paramsSchema.parse(request.params);
    const result = await addResponsibleToCustomer(AppDataSource, customerId, request.body);
    response.status(201).json(result);
  },
);

customerRouter.get("/:customerId/responsibles", async (request, response) => {
  const { customerId } = paramsSchema.parse(request.params);
  const result = await listResponsiblesByCustomer(AppDataSource, customerId);
  response.status(200).json(result);
});

customerRouter.get("/:customerId/responsibles/:responsibleId", async (request, response) => {
  const { customerId, responsibleId } = paramsSchema.parse(request.params);
  const result = await getResponsible(AppDataSource, customerId, responsibleId!);
  response.status(200).json(result);
});

customerRouter.patch(
  "/:customerId/responsibles/:responsibleId",
  validateRequest(updateResponsibleSchema),
  async (request, response) => {
    const { customerId, responsibleId } = paramsSchema.parse(request.params);
    const result = await updateResponsible(AppDataSource, customerId, responsibleId!, request.body);
    response.status(200).json(result);
  },
);

customerRouter.delete("/:customerId/responsibles/:responsibleId", async (request, response) => {
  const { customerId, responsibleId } = paramsSchema.parse(request.params);
  await removeResponsible(AppDataSource, customerId, responsibleId!);
  response.status(204).send();
});
