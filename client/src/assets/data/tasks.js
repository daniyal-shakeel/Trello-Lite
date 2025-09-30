const DEFAULT_TASK_PROPS = {
  "Backlog": { status: "Backlog", color: "#6B7280" },
  "To Do": { status: "To Do", color: "#9CA3AF" },
  "In Progress": { status: "In Progress", color: "#3B82F6" },
  "Review": { status: "Review", color: "#8B5CF6" },
  "Blocked": { status: "Blocked", color: "#EF4444" },
  "On Hold": { status: "On Hold", color: "#F97316" },
  "Done": { status: "Done", color: "#22C55E" },
  "Urgent": { status: "Urgent", color: "#F59E0B" }
};

export const TASKS = [
  {
    _id: "1",
    title: "Buy groceries",
    description: "Milk, bread, eggs, and vegetables",
    avatar: "JD",
    name: "John Doe",
    time: "2 hours ago",
    boardId: "b1",
    ...DEFAULT_TASK_PROPS["To Do"]
  },
  {
    _id: "2",
    title: "Workout session",
    description: "Leg day at the gym",
    avatar: "SM",
    name: "Sara Miller",
    time: "5 hours ago",
    boardId: "b2",
    ...DEFAULT_TASK_PROPS["Backlog"]
  },
  {
    _id: "3",
    title: "Finish project report",
    description: "Draft for the Q4 update",
    avatar: "AK",
    name: "Alex King",
    time: "1 day ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["In Progress"]
  },
  {
    _id: "4",
    title: "Team meeting",
    description: "Discuss sprint backlog",
    avatar: "LS",
    name: "Lina Smith",
    time: "3 days ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Review"]
  },
  {
    _id: "5",
    title: "Fix server issue",
    description: "Database connection timeout",
    avatar: "NH",
    name: "Nora Hill",
    time: "10 minutes ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Urgent"]
  },
  {
    _id: "6",
    title: "Doctor Appointment",
    description: "Routine checkup",
    avatar: "MJ",
    name: "Mary Johnson",
    time: "2 days ago",
    boardId: "b1",
    ...DEFAULT_TASK_PROPS["On Hold"]
  },
  {
    _id: "7",
    title: "Prepare slides",
    description: "For client meeting",
    avatar: "TK",
    name: "Tom Knight",
    time: "4 hours ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["To Do"]
  },
  {
    _id: "8",
    title: "Code Review",
    description: "Review pull requests",
    avatar: "RS",
    name: "Ravi Singh",
    time: "30 minutes ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Review"]
  },
  {
    _id: "9",
    title: "Fix production bug",
    description: "Resolve API timeout",
    avatar: "OM",
    name: "Oliver Moore",
    time: "1 hour ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Blocked"]
  },
  {
    _id: "10",
    title: "Plan weekend trip",
    description: "Research hotels",
    avatar: "KP",
    name: "Kyle Parker",
    time: "6 hours ago",
    boardId: "b1",
    ...DEFAULT_TASK_PROPS["Backlog"]
  },
  {
    _id: "11",
    title: "Write blog post",
    description: "Article on React performance",
    avatar: "EC",
    name: "Emma Clark",
    time: "12 hours ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["In Progress"]
  },
  {
    _id: "12",
    title: "Interview candidate",
    description: "Backend dev interview",
    avatar: "DB",
    name: "David Brown",
    time: "3 days ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Done"]
  },
  {
    _id: "13",
    title: "Database backup",
    description: "Run weekly scripts",
    avatar: "LF",
    name: "Liam Fox",
    time: "2 days ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Urgent"]
  },
  {
    _id: "14",
    title: "Design mockups",
    description: "Dashboard feature UI",
    avatar: "AW",
    name: "Alice White",
    time: "1 day ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["To Do"]
  },
  {
    _id: "15",
    title: "Test mobile app",
    description: "QA testing v2.0",
    avatar: "BM",
    name: "Ben Martin",
    time: "8 hours ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Review"]
  },
  {
    _id: "16",
    title: "Send invoices",
    description: "Client billing",
    avatar: "CR",
    name: "Chris Rogers",
    time: "2 hours ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Done"]
  },
  {
    _id: "17",
    title: "Server monitoring",
    description: "Check logs & metrics",
    avatar: "GP",
    name: "George Patel",
    time: "15 minutes ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Blocked"]
  },
  {
    _id: "18",
    title: "Organize files",
    description: "Clean old documents",
    avatar: "HK",
    name: "Hina Khan",
    time: "9 hours ago",
    boardId: "b4",
    ...DEFAULT_TASK_PROPS["Backlog"]
  },
  {
    _id: "19",
    title: "Prepare invoice report",
    description: "Finance department report",
    avatar: "OM",
    name: "Oscar Miller",
    time: "5 hours ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["In Progress"]
  },
  {
    _id: "20",
    title: "Launch campaign",
    description: "Email campaign new product",
    avatar: "VS",
    name: "Vera Scott",
    time: "1 day ago",
    boardId: "b3",
    ...DEFAULT_TASK_PROPS["Done"]
  }
];
