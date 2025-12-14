// components/tasks/TaskBoard.tsx
import TaskCard from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Clock, Eye, CheckCircle } from 'lucide-react';

interface TaskBoardProps {
  columns: {
    todo: any[];
    in_progress: any[];
    review: any[];
    done: any[];
  };
}

const columnConfig = {
  todo: {
    title: 'To Do',
    icon: Circle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900',
    borderColor: 'border-gray-200 dark:border-gray-800',
  },
  in_progress: {
    title: 'In Progress',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-900',
  },
  review: {
    title: 'Review',
    icon: Eye,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-900',
  },
  done: {
    title: 'Done',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-900',
  },
};

export default function TaskBoard({ columns }: TaskBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {columns && Object?.entries(columns).map(([key, tasks]) => {
        const config = columnConfig[key as keyof typeof columnConfig];
        const Icon = config.icon;
        
        return (
          <Card key={key} className={`border ${config.borderColor}`}>
            <CardHeader className={`pb-3 ${config.bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                </div>
                <span className={`text-xs font-semibold ${config.color}`}>
                  {tasks.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No tasks
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}