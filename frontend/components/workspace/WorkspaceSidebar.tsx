// components/workspace/WorkspaceSidebar.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FolderKanban, 
  Calendar, 
  UserPlus,
  Settings,
  MoreVertical,
  Crown,
  Shield,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  workspace: any;
}

export default function WorkspaceSidebar({ workspace }: WorkspaceSidebarProps) {
  const members = workspace.members || [];
  const recentProjects = workspace.projects?.slice(0, 3) || [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'admin':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <Card className="border-red-100 dark:border-red-900/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {workspace._count?.members || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {workspace._count?.projects || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/30">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Created</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {format(new Date(workspace.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {/* <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
          >
            <FolderKanban className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
          >
            <Settings className="h-4 w-4 mr-2" />
            Workspace Settings
          </Button>
        </CardContent>
      </Card> */}

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </CardTitle>
              <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
                {workspace._count?.projects || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.tasks?.length || 0} tasks
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </CardTitle>
            <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              {members.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member: any) => {
              const RoleIcon = getRoleIcon(member.role);
              
              return (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                        {member.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.user.name}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs px-1 py-0',
                            getRoleColor(member.role)
                          )}
                        >
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}