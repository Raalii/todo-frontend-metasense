// Types basés sur le schéma Prisma
export type User = {
  id: string;
  email: string;
  name?: string | null;
  hashedPassword: string;
  tasks: Task[];
  projects: Project[];
  categories: Category[];
  statuses: Status[];
};

export type Status = {
  id: string;
  name: string;
  color: string;
  userId: string;
  user: User;
  tasks: Task[];
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  userId: string;
  user: User;
  tasks: Task[];
  TaskCategory: TaskCategory[];
};

export type Project = {
  id: string;
  name: string;
  userId: string;
  user: User;
  tasks: Task[];
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  projectId: string | null;
  statusId: string;
  user: User;
  project: Project | null;
  status: Status;
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
  TaskCategory: TaskCategory[];
};

export type TaskCategory = {
  taskId: string;
  categoryId: string;
  task: Task;
  category: Category;
};
