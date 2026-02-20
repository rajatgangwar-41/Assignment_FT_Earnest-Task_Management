import { prisma } from "../../config/prisma";

export async function createTask(userId: string, title: string) {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
}

export async function getTasks(params: {
  userId: string;
  page: number;
  limit: number;
  status?: "completed" | "pending";
  search?: string;
}) {
  const { userId, page, limit, status, search } = params;

  const where: any = {
    userId,
  };

  if (status) {
    where.completed = status === "completed";
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return { items, total };
}

export async function getTaskById(userId: string, id: string) {
  return prisma.task.findFirst({
    where: { id, userId },
  });
}

export async function updateTask(
  userId: string,
  id: string,
  data: { title?: string; completed?: boolean },
) {
  return prisma.task.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteTask(userId: string, id: string) {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
}

export async function toggleTask(userId: string, id: string) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) return null;

  return prisma.task.update({
    where: { id },
    data: {
      completed: !task.completed,
    },
  });
}
