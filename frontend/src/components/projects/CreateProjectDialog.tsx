import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/contexts/ProjectContext";
import { Project, User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock user for project creation
const mockUser: User = {
  id: "1",
  name: "Current User",
  email: "user@example.com",
  role: "member",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
};

interface CreateProjectDialogProps {
  onProjectCreated?: (project: Project) => void;
  onProjectDeleted?: (projectId: number) => void;
  children?: React.ReactNode;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  onProjectCreated,
  onProjectDeleted,
  children,
}) => {
  const { projects, addProject, deleteProject } = useProject();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    dueDate: undefined as Date | undefined,
    status: "pending" as const,
    priority: "medium" as const,
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Reset form when opening modal
  useEffect(() => {
    if (open) {
      setActiveTab("list");
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
        dueDate: undefined,
        status: "pending",
        priority: "medium",
      });
      setDate(undefined);
    }
  }, [open]);

  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Orange", value: "#F59E0B" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const newProject = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        status: formData.status,
        priority: formData.priority,
        due_date: date?.toISOString(),
      };

      await addProject(newProject as any);

      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
        dueDate: undefined,
        status: "pending",
        priority: "medium",
      });
      setDate(undefined);
      setActiveTab("list");

      if (onProjectCreated) {
        onProjectCreated(newProject as any);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (
    projectId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        await deleteProject(projectId);
        if (onProjectDeleted) {
          onProjectDeleted(projectId);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Priority options
  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="gap-2" type="button">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        {/* Only show the project creation form, no tabs or project list */}
        <div className="flex-1 overflow-y-auto py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due Date (Optional)</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
