import { useEffect, useState } from "react";
import axios from "axios";
import { AGENTS_API_ENDPOINT } from "../../utils/constant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  setAgents,
  addAgent,
  deleteAgent as removeAgent,
} from "../redux/slices/agentSlice";
import { Loader2, Trash2, Eye, EyeOff } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Agents() {
  const dispatch = useDispatch();
  const agents = useSelector((state) => state.agents.agents);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${AGENTS_API_ENDPOINT}/get`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAgents(res.data.agents));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      const res = await axios.post(`${AGENTS_API_ENDPOINT}/add`, form, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(addAgent(res.data.agent));
        setForm({ name: "", email: "", mobile: "", password: "" });
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add agent!");
    } finally {
      setAdding(false);
    }
  };

  const confirmDelete = (agentId) => {
    setAgentToDelete(agentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${AGENTS_API_ENDPOINT}/${agentToDelete}/delete`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(removeAgent(agentToDelete));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete agent");
    } finally {
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 text-white">
      {/* Add Agent Form */}
      <div className="bg-zinc-800 p-6 rounded-xl shadow-lg max-w-xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-4">Add New Agent</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="bg-zinc-900 border border-zinc-700 text-white" />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="bg-zinc-900 border border-zinc-700 text-white" />
          <Input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} className="bg-zinc-900 border border-zinc-700 text-white" />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-700 text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <Button type="submit" disabled={adding} className="w-full mt-3 bg-white text-black hover:bg-gray-200">
            {adding ? (
              <div className="flex items-center justify-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" /> Adding...
              </div>
            ) : (
              "Add Agent"
            )}
          </Button>
        </form>
      </div>

      {/* Agent List */}
      <div className="max-w-4xl mx-auto mt-8">
        <h3 className="text-xl text-gray-100 font-semibold mb-4">Agent List</h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 p-10 text-white">
            <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
            <p className="text-gray-200">Loading...</p>
          </div>
        ) : agents.length === 0 ? (
          <p className="text-white">No agents found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <Table>
              <TableHeader className="bg-zinc-900">
                <TableRow className="hover:bg-zinc-900">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Mobile</TableHead>
                  <TableHead className="text-white text-center">Tasks</TableHead>
                  <TableHead className="text-white text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-zinc-800">
                {agents.map((agent) => (
                  <TableRow key={agent._id} className="hover:bg-zinc-700">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.mobile}</TableCell>
                    <TableCell className='text-center text-green-600 font-bold'>{Array.isArray(agent.tasks) ? agent.tasks.length : 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(agent._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this agent?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
