import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabSwitcher } from "@/components/TabSwitcher";
import {
  Users,
  Truck,
  MapPin,
  AlertTriangle,
  Search,
  Plus,
  ChevronRight,
  Check,
  X,
  ArrowLeft,
  Loader2,
  Calendar,
  Car,
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
}

interface WashJobData {
  id: string;
  scheduled_date: string;
  status: string;
  car_id: string;
  washer_id: string | null;
  gps_verified: boolean;
}

interface DisputeData {
  id: string;
  description: string;
  status: string;
  created_at: string;
  reported_by: string | null;
  wash_job_id: string;
}

const AdminDashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<UserData[]>([]);
  const [washJobs, setWashJobs] = useState<WashJobData[]>([]);
  const [disputes, setDisputes] = useState<DisputeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "users", label: "Users" },
    { id: "routes", label: "Routes" },
    { id: "disputes", label: "Disputes" },
  ];

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "admin")) {
      navigate("/");
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && userRole === "admin") {
      fetchData();
    }
  }, [user, userRole, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        // Fetch profiles with roles
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, phone");

        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role");

        if (profiles && roles) {
          const usersWithRoles = profiles.map((profile) => ({
            ...profile,
            role: roles.find((r) => r.user_id === profile.user_id)?.role || "customer",
          }));
          setUsers(usersWithRoles);
        }
      } else if (activeTab === "routes") {
        const { data } = await supabase
          .from("wash_jobs")
          .select("*")
          .order("scheduled_date", { ascending: false })
          .limit(50);
        setWashJobs(data || []);
      } else if (activeTab === "disputes") {
        const { data } = await supabase
          .from("disputes")
          .select("*")
          .order("created_at", { ascending: false });
        setDisputes(data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "washer" | "customer") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("Role updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const resolveDispute = async (disputeId: string, resolution: string) => {
    try {
      const { error } = await supabase
        .from("disputes")
        .update({
          status: "resolved",
          resolution,
          resolved_by: user?.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", disputeId);

      if (error) throw error;
      toast.success("Dispute resolved");
      fetchData();
    } catch (error) {
      toast.error("Failed to resolve dispute");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
  );

  if (authLoading || (userRole !== "admin" && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage operations</p>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-card card-elevated text-center">
            <Users className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</p>
            <p className="text-xs text-muted-foreground">Customers</p>
          </div>
          <div className="p-4 rounded-xl bg-card card-elevated text-center">
            <Truck className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.filter((u) => u.role === "washer").length}</p>
            <p className="text-xs text-muted-foreground">Washers</p>
          </div>
          <div className="p-4 rounded-xl bg-card card-elevated text-center">
            <Car className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{washJobs.filter((j) => j.status === "completed").length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="p-4 rounded-xl bg-card card-elevated text-center">
            <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold">{disputes.filter((d) => d.status === "open").length}</p>
            <p className="text-xs text-muted-foreground">Open Issues</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center mb-6">
          <TabSwitcher tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-3">
                {filteredUsers.map((userData) => (
                  <div
                    key={userData.user_id}
                    className="p-4 rounded-xl bg-card card-elevated flex items-center gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">
                        {userData.full_name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{userData.full_name || "No name"}</p>
                      <p className="text-sm text-muted-foreground">{userData.phone || "No phone"}</p>
                    </div>
                    <select
                      value={userData.role}
                      onChange={(e) => updateUserRole(userData.user_id, e.target.value as "admin" | "washer" | "customer")}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="washer">Washer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No users found</p>
                )}
              </div>
            )}

            {/* Routes Tab */}
            {activeTab === "routes" && (
              <div className="space-y-3">
                {washJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl bg-card card-elevated flex items-center gap-4"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        job.status === "completed"
                          ? "bg-success/10"
                          : job.status === "missed"
                          ? "bg-destructive/10"
                          : "bg-secondary"
                      }`}
                    >
                      {job.status === "completed" ? (
                        <Check className="h-5 w-5 text-success" />
                      ) : job.status === "missed" ? (
                        <X className="h-5 w-5 text-destructive" />
                      ) : (
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{job.scheduled_date}</p>
                      <p className="text-sm text-muted-foreground">
                        Car: {job.car_id.slice(0, 8)}... •{" "}
                        {job.gps_verified ? "GPS Verified" : "Not verified"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        job.status === "completed"
                          ? "bg-success/10 text-success"
                          : job.status === "missed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
                {washJobs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No wash jobs yet</p>
                )}
              </div>
            )}

            {/* Disputes Tab */}
            {activeTab === "disputes" && (
              <div className="space-y-3">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="p-4 rounded-xl bg-card card-elevated">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{dispute.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(dispute.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          dispute.status === "open"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {dispute.status}
                      </span>
                    </div>
                    {dispute.status === "open" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveDispute(dispute.id, "Resolved with refund")}
                        >
                          Refund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveDispute(dispute.id, "Resolved - no action needed")}
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => resolveDispute(dispute.id, "Resolved with re-wash")}
                        >
                          Re-wash
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {disputes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No disputes</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
