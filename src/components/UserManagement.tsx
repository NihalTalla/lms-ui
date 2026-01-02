import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  GraduationCap,
  BookOpen,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  MoveRight
} from 'lucide-react';
import { users, batches } from '../lib/data';
import { toast } from 'sonner';

interface UserManagementProps {
  onNavigate: (page: string, data?: any) => void;
}

export function UserManagement({ onNavigate }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [moveUserDialogOpen, setMoveUserDialogOpen] = useState(false);
  const [userToMove, setUserToMove] = useState<any>(null);
  const [targetBatch, setTargetBatch] = useState('');

  const allUsers = [
    ...users,
    // Additional mock users
    {
      id: 'admin-2',
      name: 'Jessica Parker',
      email: 'jessica.parker@codify.lms',
      role: 'admin' as const,
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 'faculty-3',
      name: 'David Kim',
      email: 'david.kim@codify.lms',
      role: 'faculty' as const,
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '1 day ago',
      batchesAssigned: 3,
      studentsManaged: 85,
    },
    {
      id: 'student-4',
      name: 'Isabella Garcia',
      email: 'isabella.garcia@student.codify.lms',
      role: 'student' as const,
      status: 'active',
      joinDate: '2024-09-01',
      lastActive: '5 min ago',
      coursesEnrolled: 2,
      progress: 78,
      points: 1150,
    },
    {
      id: 'student-5',
      name: 'Ethan Brown',
      email: 'ethan.brown@student.codify.lms',
      role: 'student' as const,
      status: 'inactive',
      joinDate: '2024-08-15',
      lastActive: '2 weeks ago',
      coursesEnrolled: 1,
      progress: 42,
      points: 680,
    },
  ];

  const stats = {
    totalUsers: allUsers.length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    faculty: allUsers.filter(u => u.role === 'faculty').length,
    students: allUsers.filter(u => u.role === 'student').length,
    activeToday: 128,
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'faculty': return <GraduationCap className="w-4 h-4" />;
      case 'student': return <BookOpen className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'var(--color-primary)';
      case 'faculty': return 'var(--color-secondary)';
      case 'student': return 'var(--color-accent)';
      default: return 'var(--color-neutral)';
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleMoveUser = () => {
    if (!targetBatch) {
      toast.error('Please select a target batch');
      return;
    }
    toast.success(`${userToMove.name} moved to ${batches.find(b => b.id === targetBatch)?.name}`);
    setMoveUserDialogOpen(false);
    setUserToMove(null);
    setTargetBatch('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>User Management</h2>
          <p className="text-neutral-600 mt-1">
            Manage users, roles, and permissions across the platform
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: 'var(--color-primary)' }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account on the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="faculty">Faculty/Trainer</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                  Create User
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Users</p>
                <h3 className="mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Admins</p>
                <h3 className="mt-1">{stats.admins}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Faculty</p>
                <h3 className="mt-1">{stats.faculty}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                <GraduationCap className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Students</p>
                <h3 className="mt-1">{stats.students}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Today</p>
                <h3 className="mt-1">{stats.activeToday}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback style={{ backgroundColor: getRoleColor(user.role), color: 'white' }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getRoleColor(user.role),
                          color: getRoleColor(user.role)
                        }}
                        className="flex items-center gap-1"
                      >
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      {(user as any).status === 'inactive' && (
                        <Badge variant="outline" className="border-neutral-400 text-neutral-600">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {(user as any).lastActive && (
                        <span>Last active: {(user as any).lastActive}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {user.role === 'faculty' && (user as any).batchesAssigned && (
                    <div className="text-sm text-center">
                      <p className="text-neutral-600">Batches</p>
                      <p className="font-medium">{(user as any).batchesAssigned}</p>
                    </div>
                  )}
                  {user.role === 'faculty' && (user as any).studentsManaged && (
                    <div className="text-sm text-center">
                      <p className="text-neutral-600">Students</p>
                      <p className="font-medium">{(user as any).studentsManaged}</p>
                    </div>
                  )}
                  {user.role === 'student' && (user as any).progress !== undefined && (
                    <div className="text-sm text-center">
                      <p className="text-neutral-600">Progress</p>
                      <p className="font-medium">{(user as any).progress}%</p>
                    </div>
                  )}
                  {user.role === 'student' && (user as any).points !== undefined && (
                    <div className="text-sm text-center">
                      <p className="text-neutral-600">Points</p>
                      <p className="font-medium" style={{ color: 'var(--color-primary)' }}>
                        {(user as any).points}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user.role === 'student' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setUserToMove(user);
                          setMoveUserDialogOpen(true);
                        }}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <MoveRight className="w-4 h-4 mr-1" />
                        Move
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>User Actions</DialogTitle>
                          <DialogDescription>
                            Manage user {user.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                          {user.role === 'student' && (
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => {
                                setUserToMove(user);
                                setMoveUserDialogOpen(true);
                              }}
                            >
                              <MoveRight className="w-4 h-4 mr-2" />
                              Move User to Batch
                            </Button>
                          )}
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="w-4 h-4 mr-2" />
                            Change Role
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend Account
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Move User Dialog */}
      <Dialog open={moveUserDialogOpen} onOpenChange={setMoveUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move User to Different Batch</DialogTitle>
            <DialogDescription>
              Move {userToMove?.name} to a different batch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Batch</Label>
              <Input 
                value={batches.find(b => b.id === userToMove?.batchId)?.name || 'No batch assigned'} 
                disabled 
                className="bg-neutral-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-batch">Target Batch</Label>
              <Select value={targetBatch} onValueChange={setTargetBatch}>
                <SelectTrigger id="target-batch">
                  <SelectValue placeholder="Select target batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1" 
                style={{ backgroundColor: 'var(--color-primary)' }}
                onClick={handleMoveUser}
              >
                <MoveRight className="w-4 h-4 mr-2" />
                Move User
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setMoveUserDialogOpen(false);
                  setUserToMove(null);
                  setTargetBatch('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
