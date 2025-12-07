import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, MoreHorizontal, Calendar, AlertCircle } from 'lucide-react';
import { Priority, Task } from '../types';

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    [Priority.Low]: 'bg-slate-100 text-slate-600',
    [Priority.Medium]: 'bg-blue-50 text-blue-600',
    [Priority.High]: 'bg-orange-50 text-orange-600',
    [Priority.Critical]: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-move group">
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{task.title}</h4>
      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
          AS
        </div>
      </div>
      
      {/* Quick Status Change Actions for Demo */}
      <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {task.status !== 'To Do' && <button onClick={() => onStatusChange(task.id, 'To Do')} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">To Do</button>}
          {task.status !== 'Done' && <button onClick={() => onStatusChange(task.id, 'Done')} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200">Done</button>}
      </div>
    </div>
  );
};

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onStatusChange: (id: string, status: Task['status']) => void;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, status, onStatusChange }) => (
  <div className="flex flex-col gap-4 min-w-[280px] w-full lg:w-1/4">
    <div className="flex items-center justify-between mb-1 px-1">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{tasks.length}</span>
    </div>
    <div className="flex flex-col gap-3 min-h-[500px] bg-slate-100/50 p-2 rounded-xl border border-slate-200/50">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
      ))}
      {tasks.length === 0 && (
         <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
           No tasks
         </div>
      )}
    </div>
  </div>
);

export const Tasks: React.FC = () => {
  const { tasks, updateTaskStatus, addTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: newTaskTitle,
      description: 'New task created via quick add',
      status: 'To Do',
      priority: Priority.Medium,
      assigneeId: 'u1',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Board</h2>
           <p className="text-slate-500 text-sm">Manage project tasks and sprints</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-primary-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1000px] h-full">
          <Column title="To Do" tasks={tasks.filter(t => t.status === 'To Do')} status="To Do" onStatusChange={updateTaskStatus} />
          <Column title="In Progress" tasks={tasks.filter(t => t.status === 'In Progress')} status="In Progress" onStatusChange={updateTaskStatus} />
          <Column title="Review" tasks={tasks.filter(t => t.status === 'Review')} status="Review" onStatusChange={updateTaskStatus} />
          <Column title="Done" tasks={tasks.filter(t => t.status === 'Done')} status="Done" onStatusChange={updateTaskStatus} />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleAddTask} className="bg-white rounded-xl p-6 w-96 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold mb-4">New Task</h3>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};