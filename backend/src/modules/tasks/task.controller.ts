import { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTask,
  updateTask,
} from "./task.service";
import {
  createTaskSchema,
  listTaskQuerySchema,
  updateTaskSchema,
} from "./task.schema";

export async function create(req: Request, res: Response) {
  const body = createTaskSchema.parse(req.body);

  const task = await createTask(req.userId!, body.title);

  res.status(201).json(task);
}

export async function list(req: Request, res: Response) {
  const query = listTaskQuerySchema.parse(req.query);

  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const result = await getTasks({
    userId: req.userId!,
    page,
    limit,
    status: query.status,
    search: query.search,
  });

  res.json({
    items: result.items,
    total: result.total,
    page,
    limit,
  });
}

export async function getOne(req: Request, res: Response) {
  const task = await getTaskById(req.userId!, req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
}

export async function update(req: Request, res: Response) {
  const body = updateTaskSchema.parse(req.body);

  const result = await updateTask(req.userId!, req.params.id, body);

  if (result.count === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ success: true });
}

export async function remove(req: Request, res: Response) {
  const result = await deleteTask(req.userId!, req.params.id);

  if (result.count === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(204).send();
}

export async function toggle(req: Request, res: Response) {
  const task = await toggleTask(req.userId!, req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
}
