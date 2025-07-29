import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  X, 
  Calendar, 
  User, 
  Flag, 
  MessageCircle, 
  Paperclip,
  Clock,
  Tag,
  Send,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/types';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const statusColors = {
  'todo': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  'review': 'bg-purple-500',
  'completed': 'bg-green-500'
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, open, onClose }) => {
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  const progress = task.subtasks.length > 0 
    ? (task.subtasks.filter(st => st.status === 'completed').length / task.subtasks.length) * 100
    : task.status === 'completed' ? 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
                  {task.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Flag className="w-3 h-3" />
                  {task.priority}
                </Badge>
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Progress */}
              {task.subtasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {task.subtasks.filter(st => st.status === 'completed').length} of {task.subtasks.length} subtasks completed
                  </p>
                </div>
              )}

              {/* Attachments */}
              {task.attachments.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <h3 className="font-medium mb-3">Comments</h3>
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={handleAddComment}>
                          <Send className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Assignee</h4>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Reporter</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={task.reporter.avatar} />
                      <AvatarFallback className="text-xs">
                        {task.reporter.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.reporter.name}</span>
                  </div>
                </div>

                {task.dueDate && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Due Date</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                )}

                {task.estimatedHours && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Time Tracking</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Estimated:</span>
                        <span>{task.estimatedHours}h</span>
                      </div>
                      {task.actualHours && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Actual:</span>
                          <span>{task.actualHours}h</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Created</h4>
                  <span className="text-sm">
                    {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Updated</h4>
                  <span className="text-sm">
                    {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};