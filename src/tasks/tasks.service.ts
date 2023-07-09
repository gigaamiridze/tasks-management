import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './tasks.model';
import { Status } from '../constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task | object {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      return task;
    }

    return {
      status: Status.FAIL,
      message: 'Task not found',
    }
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): object {
    this.tasks = this.tasks.filter(task => task.id !== id);

    return {
      status: Status.SUCCESS,
      message: 'Task deleted successfully',
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Task | object {
    const task = this.tasks.find(task => task.id === id);

    if (task) {
      task.status = status;
      return task;
    }

    return {
      status: Status.FAIL,
      message: 'Task not found',
    }
  }
}
