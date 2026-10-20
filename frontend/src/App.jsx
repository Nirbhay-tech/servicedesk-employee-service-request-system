import React from 'react';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  FilePlus2,
  Filter,
  Headphones,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  X,
  Building2,
  HeartHandshake,
  Laptop,
  CircleAlert,
  RefreshCw,
} from "lucide-react";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const client = axios.create({ baseURL: API });
client.interceptors.request.use((c) => {
  const t = localStorage.getItem("servicedesk_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
const categoryIcon = { IT: Laptop, HR: HeartHandshake, Facilities: Building2 };
const statusLabel = {
  open: "Open",
  in_progress: "In progress",
  waiting_for_employee: "Waiting on you",
  resolved: "Resolved",
  closed: "Closed",
};
function App() {
  const [token, setToken] = useState(localStorage.getItem("servicedesk_token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("servicedesk_user") || "null"),
  );
  const [mode, setMode] = useState("login");
  const [page, setPage] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [supportUsers, setSupportUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: "",
    department: "IT",
  });
  const [form, setForm] = useState({
    category: "IT",
    title: "",
    description: "",
    priority: "medium",
  });
  const staff = ["admin", "support"].includes(user?.role);
  async function load() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (query.trim()) params.search = query.trim();
      const [r, m, u] = await Promise.all([
        client.get("/requests", { params }),
        staff
          ? client.get("/requests/metrics")
          : Promise.resolve({ data: { metrics: null } }),
        staff ? client.get("/users") : Promise.resolve({ data: { users: [] } }),
      ]);
      setRequests(r.data.requests);
      setMetrics(m.data.metrics);
      setSupportUsers(u.data.users);
    } catch (e) {
      setError(
        e.response?.data?.error ||
          "Could not load requests. Check that the API and database are running.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [token, page, statusFilter]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (token) load();
    }, 250);
    return () => clearTimeout(id);
  }, [query]);
  async function authenticate(e) {
    e.preventDefault();
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email: auth.email, password: auth.password }
          : auth;
      const r = await client.post(endpoint, body);
      localStorage.setItem("servicedesk_token", r.data.token);
      localStorage.setItem("servicedesk_user", JSON.stringify(r.data.user));
      setToken(r.data.token);
      setUser(r.data.user);
      setPage("overview");
    } catch (e) {
      setError(e.response?.data?.error || "Authentication failed.");
    }
  }
  function logout() {
    localStorage.removeItem("servicedesk_token");
    localStorage.removeItem("servicedesk_user");
    setToken(null);
    setUser(null);
    setRequests([]);
  }
  async function createRequest(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/requests", form);
      setShowCreate(false);
      setForm({
        category: "IT",
        title: "",
        description: "",
        priority: "medium",
      });
      await load();
      setPage("requests");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to create request.");
    }
  }
  async function updateStatus(id, status) {
    try {
      await client.patch(`/requests/${id}/status`, { status });
      setSelected(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Status update failed.");
    }
  }
  async function assign(id, assigneeId) {
    try {
      await client.patch(`/requests/${id}/assign`, {
        assigneeId: assigneeId ? Number(assigneeId) : null,
      });
      await load();
      const r = await client.get(`/requests`);
      setRequests(r.data.requests);
    } catch (e) {
      setError(e.response?.data?.error || "Assignment failed.");
    }
  }
  const visible = useMemo(
    () =>
      requests.filter((r) =>
        `${r.title} ${r.request_number} ${r.category} ${r.requester_name || ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [requests, query],
  );
  const openCount = requests.filter((r) => r.status === "open").length;
  const inProgress = requests.filter((r) => r.status === "in_progress").length;
  const overdue = requests.filter((r) => r.is_overdue).length;
  if (!token)
    return (
      <div className="auth-shell">
        <div className="auth-left">
          <div className="brand">
            <span className="brand-mark">
              <Command size={20} />
            </span>{" "}
            servicedesk<span className="brand-dot">.</span>
          </div>
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={14} /> WORKPLACE SUPPORT, REIMAGINED
            </span>
            <h1>
              Good work
              <br />
              starts with <em>good support.</em>
            </h1>
            <p>
              One calm place to ask for help, track progress, and keep your work
              moving.
            </p>
            <div className="mini-stats">
              <div>
                <strong>01</strong>
                <span>Raise a request</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Track every update</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Get back to work</span>
              </div>
            </div>
          </div>
          <div className="auth-foot">
            A clearer way to get things done. <span>© 2026 ServiceDesk</span>
          </div>
          <div className="decor decor-one" />
          <div className="decor decor-two" />
        </div>
        <div className="auth-right">
          <div className="mobile-brand">
            <span className="brand-mark">
              <Command size={20} />
            </span>{" "}
            servicedesk<span className="brand-dot">.</span>
          </div>
          <div className="auth-card">
            <span className="eyebrow">
              {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
            </span>
            <h2>
              {mode === "login"
                ? "Sign in to your workspace"
                : "Create your account"}
            </h2>
            <p className="muted">
              {mode === "login"
                ? "Your requests and updates are waiting."
                : "Set up your employee support workspace."}
            </p>
            {error && (
              <div className="alert">
                <CircleAlert size={16} />
                {error}
              </div>
            )}
            <form onSubmit={authenticate} className="form-stack">
              {mode === "register" && (
                <label>
                  Full name
                  <input
                    required
                    minLength="2"
                    value={auth.name}
                    onChange={(e) => setAuth({ ...auth, name: e.target.value })}
                    placeholder="Alex Morgan"
                  />
                </label>
              )}
              <label>
                Work email
                <input
                  required
                  type="email"
                  value={auth.email}
                  onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  placeholder="you@company.com"
                />
              </label>
              <label>
                Password
                <input
                  required
                  minLength="8"
                  type="password"
                  value={auth.password}
                  onChange={(e) =>
                    setAuth({ ...auth, password: e.target.value })
                  }
                  placeholder="At least 8 characters"
                />
              </label>
              {mode === "register" && (
                <label>
                  Department
                  <select
                    value={auth.department}
                    onChange={(e) =>
                      setAuth({ ...auth, department: e.target.value })
                    }
                  >
                    <option>IT</option>
                    <option>HR</option>
                    <option>Facilities</option>
                    <option>Finance</option>
                    <option>General</option>
                  </select>
                </label>
              )}
              <button className="btn primary full" type="submit">
                {mode === "login" ? "Sign in" : "Create account"}{" "}
                <ArrowUpRight size={16} />
              </button>
            </form>
            <div className="switch-auth">
              {mode === "login"
                ? "New to ServiceDesk?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
            <div className="secure-note">
              <ShieldCheck size={15} /> Secure access powered by JWT
              authentication
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Command size={20} />
          </span>{" "}
          servicedesk<span className="brand-dot">.</span>
        </div>
        <div className="workspace">
          <div className="workspace-icon">N</div>
          <div>
            <strong>Northstar Studio</strong>
            <span>Employee workspace</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <button
          className={`nav-item ${page === "overview" ? "active" : ""}`}
          onClick={() => setPage("overview")}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button
          className={`nav-item ${page === "requests" ? "active" : ""}`}
          onClick={() => setPage("requests")}
        >
          <MessageSquareText size={18} />{" "}
          {staff ? "All requests" : "My requests"}
          <span className="nav-count">{requests.length}</span>
        </button>
        {staff && (
          <>
            <button
              className={`nav-item ${page === "team" ? "active" : ""}`}
              onClick={() => setPage("team")}
            >
              <Users size={18} /> Support team
            </button>
            <button
              className={`nav-item ${page === "insights" ? "active" : ""}`}
              onClick={() => setPage("insights")}
            >
              <Activity size={18} /> Service insights
            </button>
          </>
        )}
        <div className="sidebar-spacer" />
        <div className="help-card">
          <div className="help-icon">
            <Headphones size={18} />
          </div>
          <strong>Need a hand?</strong>
          <p>Our support team is here to help you move forward.</p>
          <button onClick={() => setShowCreate(true)}>
            Create a request <ArrowUpRight size={14} />
          </button>
        </div>
        <button className="nav-item" onClick={logout}>
          <LogOut size={18} /> Sign out
        </button>
        <div className="profile">
          <div className="avatar">
            {user?.name
              ?.split(" ")
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="profile-info">
            <strong>{user?.name}</strong>
            <span>
              {user?.role} · {user?.department}
            </span>
          </div>
          <Settings2 size={17} className="profile-setting" />
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {page === "overview"
                ? "Overview"
                : page === "requests"
                  ? "Requests"
                  : page === "team"
                    ? "Support team"
                    : "Service insights"}
            </strong>
          </div>
          <div className="top-actions">
            <div className="top-date">
              <span className="online-dot" /> All systems operational
            </div>
            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">TUESDAY, YOUR WORKSPACE</div>
              <h1>
                {page === "overview"
                  ? "Your work, in good hands."
                  : page === "requests"
                    ? staff
                      ? "Request management"
                      : "Your requests"
                    : page === "team"
                      ? "Support team"
                      : "Service insights"}
              </h1>
              <p className="muted">
                {page === "overview"
                  ? `Here’s what’s happening with ${staff ? "your service desk" : "your requests"} today.`
                  : page === "requests"
                    ? "Keep every request moving, with clear ownership and updates."
                    : page === "team"
                      ? "People ready to keep your workplace running smoothly."
                      : "A clearer view of service quality and SLA performance."}
              </p>
            </div>
            <button className="btn primary" onClick={() => setShowCreate(true)}>
              <Plus size={17} /> New request
            </button>
          </div>
          {error && (
            <div className="alert page-alert">
              <CircleAlert size={16} />
              {error}
              <button onClick={() => setError("")}>
                <X size={15} />
              </button>
            </div>
          )}
          {page === "team" ? (
            <section className="panel team-panel">
              <div className="panel-head">
                <div>
                  <h3>Support directory</h3>
                  <p>People who can own and resolve service requests.</p>
                </div>
                <span className="soft-pill">{supportUsers.length} members</span>
              </div>
              <div className="team-grid">
                {supportUsers.map((u) => (
                  <div className="team-card" key={u.id}>
                    <div className="team-avatar">
                      {u.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <strong>{u.name}</strong>
                    <span>{u.email}</span>
                    <div className="team-meta">
                      <span>{u.department}</span>
                      <span className="role-chip">{u.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!supportUsers.length && (
                <div className="empty">
                  <Users size={28} />
                  <strong>No support members yet</strong>
                  <span>
                    An admin can promote a user to support through the API.
                  </span>
                </div>
              )}
            </section>
          ) : (
            <>
              {(page === "overview" || page === "insights") && (
                <div className="metrics-grid">
                  <Metric
                    icon={MessageSquareText}
                    label="Total requests"
                    value={staff && metrics ? metrics.total : requests.length}
                    note="Requests in your view"
                  />
                  <Metric
                    icon={Clock3}
                    label="Open requests"
                    value={staff && metrics ? metrics.open : openCount}
                    note="Awaiting action"
                    accent="amber"
                  />
                  <Metric
                    icon={Wrench}
                    label="In progress"
                    value={staff && metrics ? metrics.in_progress : inProgress}
                    note="Being worked on"
                    accent="violet"
                  />
                  <Metric
                    icon={CircleAlert}
                    label="Overdue SLAs"
                    value={staff && metrics ? metrics.overdue : overdue}
                    note="Needs attention"
                    accent="rose"
                  />
                </div>
              )}
              {page === "overview" && (
                <div className="insight-banner">
                  <div className="insight-icon">
                    <Sparkles size={19} />
                  </div>
                  <div>
                    <strong>
                      {overdue
                        ? `${overdue} request${overdue > 1 ? "s are" : " is"} past the SLA deadline.`
                        : "You’re all caught up with your queue."}
                    </strong>
                    <span>
                      {overdue
                        ? "Review overdue items and follow up with the assigned support owner."
                        : "Create a request whenever you need help from IT, HR, or Facilities."}
                    </span>
                  </div>
                  <button onClick={() => setPage("requests")}>
                    View requests <ArrowUpRight size={15} />
                  </button>
                </div>
              )}
              {(page === "overview" || page === "insights") && staff && (
                <div className="metrics-secondary">
                  <div className="secondary-card">
                    <div className="secondary-label">
                      Resolved requests <Check size={15} />
                    </div>
                    <strong>{metrics?.resolved ?? 0}</strong>
                    <span>Completed service requests</span>
                  </div>
                  <div className="secondary-card">
                    <div className="secondary-label">
                      Waiting on employee <Clock3 size={15} />
                    </div>
                    <strong>{metrics?.waiting ?? 0}</strong>
                    <span>Need requester input</span>
                  </div>
                  <div className="secondary-card">
                    <div className="secondary-label">
                      Avg. resolution time <Activity size={15} />
                    </div>
                    <strong>
                      {metrics?.avg_resolution_hours
                        ? `${metrics.avg_resolution_hours}h`
                        : "—"}
                    </strong>
                    <span>For resolved requests</span>
                  </div>
                </div>
              )}
              <section className="panel requests-panel">
                <div className="panel-head">
                  <div>
                    <h3>
                      {page === "overview"
                        ? "Recent requests"
                        : "Request queue"}
                    </h3>
                    <p>
                      {staff
                        ? "Review, assign and update employee service requests."
                        : "Track progress and see the latest status of your requests."}
                    </p>
                  </div>
                  <button
                    className="text-btn"
                    onClick={() => setPage("requests")}
                  >
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="toolbar">
                  <div className="search-box">
                    <Search size={16} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search requests or ID..."
                    />
                  </div>
                  <div className="filter-select">
                    <Filter size={15} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All statuses</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In progress</option>
                      <option value="waiting_for_employee">
                        Waiting on employee
                      </option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <button
                    className="icon-btn refresh"
                    title="Refresh"
                    onClick={load}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                {loading ? (
                  <div className="empty">
                    <span className="spinner" />
                    Loading requests…
                  </div>
                ) : visible.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">
                      <FilePlus2 size={25} />
                    </div>
                    <strong>No requests found</strong>
                    <span>
                      {query
                        ? "Try a different search term."
                        : "Create your first request and it will appear here."}
                    </span>
                    <button
                      className="btn primary"
                      onClick={() => setShowCreate(true)}
                    >
                      <Plus size={16} /> Create request
                    </button>
                  </div>
                ) : (
                  <div className="request-list">
                    {visible
                      .slice(0, page === "overview" ? 5 : 100)
                      .map((r) => (
                        <RequestRow
                          key={r.id}
                          r={r}
                          onOpen={() => setSelected(r)}
                          staff={staff}
                        />
                      ))}
                  </div>
                )}
                <div className="panel-foot">
                  <span>
                    Showing{" "}
                    <strong>
                      {Math.min(visible.length, page === "overview" ? 5 : 100)}
                    </strong>{" "}
                    of <strong>{visible.length}</strong> requests
                  </span>
                  <span className="live-label">
                    <span className="online-dot" /> Live data
                  </span>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      {showCreate && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setShowCreate(false)
          }
        >
          <div className="modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">NEW SERVICE REQUEST</span>
                <h2>What can we help with?</h2>
                <p className="muted">
                  Give us a little context so we can get you to the right
                  person.
                </p>
              </div>
              <button className="icon-btn" onClick={() => setShowCreate(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={createRequest} className="form-stack">
              <label>
                Request category
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="IT">IT & Technology</option>
                  <option value="HR">People & HR</option>
                  <option value="Facilities">Facilities & Workplace</option>
                </select>
              </label>
              <label>
                Short title
                <input
                  required
                  minLength="5"
                  maxLength="140"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Need access to analytics dashboard"
                />
              </label>
              <label>
                Details
                <textarea
                  required
                  minLength="10"
                  maxLength="4000"
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What are you trying to do? What have you tried so far?"
                />
              </label>
              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option value="low">Low · within 72 hours</option>
                  <option value="medium">Medium · within 48 hours</option>
                  <option value="high">High · within 24 hours</option>
                  <option value="urgent">Urgent · within 4 hours</option>
                </select>
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button className="btn primary" type="submit">
                  <FilePlus2 size={16} /> Submit request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="modal detail-modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">{selected.request_number}</span>
                <h2>{selected.title}</h2>
                <p className="muted">
                  Created {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button className="icon-btn" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="detail-badges">
              <Status status={selected.status} />
              <span className={`priority ${selected.priority}`}>
                {selected.priority} priority
              </span>
              <span className="category-tag">{selected.category}</span>
            </div>
            <div className="detail-description">{selected.description}</div>
            <div className="detail-facts">
              <div>
                <span>Requester</span>
                <strong>{selected.requester_name || user.name}</strong>
              </div>
              <div>
                <span>Assigned to</span>
                <strong>{selected.assignee_name || "Unassigned"}</strong>
              </div>
              <div>
                <span>SLA deadline</span>
                <strong className={selected.is_overdue ? "overdue-text" : ""}>
                  {new Date(selected.sla_due_at).toLocaleString()}
                </strong>
              </div>
            </div>
            {staff && (
              <div className="staff-controls">
                <label>
                  Assign support owner
                  <select
                    value={selected.assignee_id || ""}
                    onChange={(e) => assign(selected.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {supportUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} · {u.role}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Update status
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                  >
                    {Object.entries(statusLabel).map(([v, l]) => (
                      <option value={v} key={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setSelected(null)}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Metric({ icon: Icon, label, value, note, accent = "" }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value ?? 0}</div>
      <div className="metric-note">
        <span className="note-dot" />
        {note}
      </div>
    </div>
  );
}
function Status({ status }) {
  return (
    <span className={`status status-${status}`}>
      <i />
      {statusLabel[status] || status}
    </span>
  );
}
function RequestRow({ r, onOpen, staff }) {
  const Icon = categoryIcon[r.category] || CircleHelp;
  return (
    <button className="request-row" onClick={onOpen}>
      <div className={`request-category ${r.category.toLowerCase()}`}>
        <Icon size={18} />
      </div>
      <div className="request-main">
        <div className="request-title-line">
          <strong>{r.title}</strong>
          <span className="request-number">{r.request_number}</span>
        </div>
        <div className="request-meta">
          <span>{r.category}</span>
          <i />{" "}
          <span>{staff ? r.requester_name || "Employee" : "Created"} </span>
          <i />{" "}
          <span>
            {new Date(r.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="request-right">
        <Status status={r.status} />
        <span className={`priority ${r.priority}`}>{r.priority}</span>
      </div>
      {r.is_overdue && <span className="overdue-flag">SLA overdue</span>}
      <ArrowDownRight className="row-arrow" size={17} />
    </button>
  );
}
export default App;
