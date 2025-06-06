import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/slices/taskSlice";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function TasksByAgent() {
  const dispatch = useDispatch();
  const { tasksByAgent, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-white">
        <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
        <p className="text-gray-200">Loading tasks...</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6 text-white">
      <h2 className="text-2xl font-bold">Tasks By Agent</h2>

      {tasksByAgent.length === 0 ? (
        <p className="text-muted-foreground">No tasks found.</p>
      ) : (
        tasksByAgent.map((group, idx) => (
          <div
            key={group._id || idx}
            className="border border-zinc-700 rounded-lg shadow bg-zinc-800"
          >
            <div className="p-4 border-b border-zinc-700 bg-zinc-900 rounded-t-lg">
              <h3 className="font-semibold text-lg">
                {group?.name || "Unknown Agent"} &mdash;{" "}
                <span className="text-sm text-muted-foreground">
                  {group?.email || "No email"}
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">#</TableHead>
                    <TableHead className="text-white">First Name</TableHead>
                    <TableHead className="text-white">Phone</TableHead>
                    <TableHead className="text-white">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.tasks.map((task, idx) => (
                    <TableRow key={idx} className="hover:bg-zinc-700">
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{task.firstName}</TableCell>
                      <TableCell>{task.phone}</TableCell>
                      <TableCell>{task.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
