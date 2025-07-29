import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiCalendar, FiMessageCircle, FiPaperclip, FiMoreHorizontal } from 'react-icons/fi';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const statusColors = {
  todo: "bg-gray-500",
  "in-progress": "bg-blue-500",
  review: "bg-purple-500",
  completed: "bg-green-500",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  isDragging,
}) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "cursor-pointer",
        isDragging && "rotate-3 scale-105 shadow-2xl"
      )}
      onClick={onClick}
    >
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200 border-l-4",
          isOverdue && "border-l-red-500 bg-red-50/50 dark:bg-red-950/10",
          !isOverdue && `border-l-[${priorityColors[task.priority]}]`
        )}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  priorityColors[task.priority]
                }`}
              />
              <Badge variant="secondary" className="text-xs">
                {task.status.replace("-", " ")}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <FiMoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm mb-2 line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-red-600"
                  )}
                >
                  <FiCalendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(task.dueDate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}

              {task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <FiMessageCircle className="w-3 h-3" />
                  <span>{task.comments.length}</span>
                </div>
              )}

              {task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <FiPaperclip className="w-3 h-3" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>

            {task.assignee && (
              <Avatar className="w-5 h-5">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
