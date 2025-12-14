// components/workspace/WorkspaceCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FolderKanban, 
  Calendar, 
  MoreVertical,
  Settings,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkspaceCardProps {
  workspace: any;
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();

  const recentMembers = workspace.members?.slice(0, 3) || [];
  const memberCount = workspace._count?.members || 0;
  const projectCount = workspace._count?.projects || 0;

  const handleClick = () => {
    router.push(`/workspace/${workspace.id}`);
  };

  return (
    <Card 
      className="border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all cursor-pointer group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {workspace.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Created {format(new Date(workspace.createdAt), 'MMM d, yyyy')}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FolderKanban className="h-4 w-4 mr-2" />
              {projectCount} projects
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              {memberCount} members
            </div>
          </div>
          
          {/* Members */}
          {recentMembers.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Team Members
              </p>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {recentMembers?.map((member: any, index: number) => (
                    <Avatar 
                      key={member.id} 
                      className="h-8 w-8 border-2 border-white dark:border-gray-900"
                      style={{ zIndex: recentMembers.length - index }}
                    >
                      <AvatarFallback className="bg-linear-to-r from-red-600 to-red-700 text-white text-xs">
                        {member?.user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {memberCount > 3 && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    +{memberCount - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-red-100 dark:border-red-900/30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              Active
            </Badge>
            {workspace.role && (
              <Badge variant="secondary" className="text-xs">
                {workspace.role}
              </Badge>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
        </div>
      </CardFooter>
    </Card>
  );
}