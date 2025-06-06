import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../utils/constant";
import { LogOut, Menu } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(logout());
                toast.success(res.data.message || "Logged out successfully!");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed!");
        }
    };

    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-zinc-900 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden hover:bg-zinc-800"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="h-5 w-5 text-white" />
                    </Button>
                    <h1 onClick={() => navigate('/dashboard')} className="text-xl font-bold text-white cursor-pointer">Admin Dashboard</h1>
                </div>
                <Button onClick={handleLogout} variant="destructive" className='ml-4'>
                    Logout<LogOut />
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside
                    className={`${sidebarOpen ? "block" : "hidden"
                        } md:block w-full md:w-64 bg-zinc-950 border-r border-border p-4 space-y-3`}
                >
                    <NavLink
                        to="agents"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-zinc-700 text-primary-foreground"
                                : "hover:bg-zinc-800 text-muted-foreground"
                            }`
                        }
                    >
                        Agents
                    </NavLink>
                    <NavLink
                        to="upload-tasks"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-zinc-700 text-primary-foreground"
                                : "hover:bg-zinc-800 text-muted-foreground"
                            }`
                        }
                    >
                        Upload Tasks
                    </NavLink>
                    <NavLink
                        to="tasks-by-agent"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-zinc-700 text-primary-foreground"
                                : "hover:bg-zinc-800 text-muted-foreground"
                            }`
                        }
                    >
                        Tasks By Agent
                    </NavLink>
                </aside>

                <main className="flex-1 p-4 overflow-auto bg-zinc-700">
                    {location.pathname === "/dashboard" && (
                        <div className="w-full px-4 md:px-8">
                            <h1 className="text-xl sm:text-2xl md:text-4xl text-center text-gray-400 font-bold">
                                Welcome to admin<br />
                                <span className="text-3xl sm:text-4xl md:text-5xl">Dashboard!</span>
                            </h1>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
