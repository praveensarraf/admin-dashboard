import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../utils/constant";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading } from "../redux/slices/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill all fields.");
    }

    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/signup`, form, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(login(res.data.user));
        toast.success(res.data.message || "Successfully registered!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 dark">
      <Card className="w-full max-w-md bg-muted/30 border border-border shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Admin Signup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <Input
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Signing up...
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>

          <div className='mt-5 flex flex-col sm:flex-row justify-center items-center sm:gap-1 text-sm text-muted-foreground'>
            <p>Already have an account?</p>
            <Link
              to="/login"
              className='text-gray-300 font-semibold hover:text-gray-100 hover:underline'
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
