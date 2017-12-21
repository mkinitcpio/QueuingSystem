import { Subject } from 'rxjs';
import { Task } from "./task";

export interface Phase {
    check(): void
    setTast(task: Task): void;
    onEdit(): Subject<any>;
}