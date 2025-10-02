export const mockComments = [
  // open task modal comments and activities data
  {
    _id: "c1",
    avatar: "JD",
    name: "John Doe",
    time: "1 day ago",
    text: "hello",
    canEdit: true,
  },
  {
    _id: "c2",
    avatar: "SM",
    name: "Sarah Miller",
    time: "2 days ago",
    canEdit: false,
    text: "I'll start working on this today!",
  },
   {
    _id: "c3",
    avatar: "SM",
    name: "Sarah Miller",
    time: "2 days ago",
    canEdit: true,
    text: "I'll start working on this today!",
  },
];

export const mockActivities = [
  {
    avatar: "JD",
    name: "John Doe",
    time: "1 day ago",
    action: 'commented on task "Plan weekly meal prep"',
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    time: "2 days ago",
    action: 'commented on task "Plan weekly meal prep"',
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    time: "3 days ago",
    action: "was assigned to this task",
  },
  {
    avatar: "JD",
    name: "John Doe",
    time: "3 days ago",
    action: "created this task",
  },
];
