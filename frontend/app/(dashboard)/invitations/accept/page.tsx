'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Users, 
  Shield, 
  User, 
  Eye,
  Calendar,
  ArrowLeft,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { useAcceptInvitationMutation, useCheckUserExistQuery } from '@/lib/api/apiSlice';

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') as string;
  
  // Check if user exists using the token
  const { isLoading: checkingUser, data: userCheckData, error: userCheckError } = useCheckUserExistQuery({ token }, {
    skip: !token,
  });
  
  const [acceptInvitation, { isLoading: isAccepting, error: acceptError }] = useAcceptInvitationMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const userExists = userCheckData?.data?.found;
  const invitationDetails = userCheckData?.data;
  const email = invitationDetails?.email;
  const workspaceName = invitationDetails?.workspaceName;
  const invitedBy = invitationDetails?.invitedBy;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!userExists) {
      // New user validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submission for existing users (just click button)
  const handleExistingUserJoin = async () => {
    if (!token) return;
    
    try {
      const result = await acceptInvitation({ token }).unwrap();
      
      if (result?.data.success) {
        toast.success(result.message);
        router.push(`/workspace/${result.data?.workspaceId}`);
      }
    } catch (err) {
      console.error('Acceptance failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to accept invitation');
    }
  };

  // Handle submission for new users (with form)
  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;
    
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        token,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await acceptInvitation(dataToSend).unwrap();
      
      if (result?.data.success) {
        toast.success(result.message);
        router.push(`/workspace/${result.data?.workspaceId}`);
      }
    } catch (err) {
      console.error('Acceptance failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to accept invitation');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'member':
        return <User className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'member':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Checking invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userCheckError || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-2">
              {!token ? 'Invalid Invitation Link' : 'Invitation Error'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {!token 
                ? 'The invitation link appears to be invalid or missing.'
                : 'Failed to verify invitation. The link may be expired or invalid.'
              }
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className="bg-red-600 text-white text-xl">
                <Users className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">
            Workspace Invitation
          </CardTitle>
          {workspaceName && (
            <CardDescription>
              You've been invited to join <span className="font-semibold">{workspaceName}</span>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {/* Invitation Details */}
          <div className="space-y-4 mb-6">
            {email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                </div>
                <span className="font-medium">{email}</span>
              </div>
            )}
            
            {workspaceName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Workspace</span>
                </div>
                <span className="font-medium">{workspaceName}</span>
              </div>
            )}
            
            
            
            {invitedBy && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Invited by</span>
                </div>
                <span className="font-medium">{invitedBy}</span>
              </div>
            )}
            
           
          </div>

          <Separator className="my-6" />

          {/* User Status Alert */}
          <Alert className={userExists ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}>
            <AlertDescription className="flex items-center gap-2">
              {userExists ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>
                    Welcome 
                  </span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>
                    You'll need to create an account to join this workspace.
                  </span>
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Existing User - Simple Button */}
          {userExists ? (
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleExistingUserJoin}
                className="w-full"
                size="lg"
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Join Workspace
                  </>
                )}
              </Button>
              
              <div className="text-center text-xs text-gray-500">
                <p>Click the button above to join {workspaceName}</p>
              </div>
            </div>
          ) : (
            /* New User - Registration Form */
            <form onSubmit={handleNewUserSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  required
                  className={formErrors.name && 'border-red-500'}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Create a password"
                  required
                  className={formErrors.password && 'border-red-500'}
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  Must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  required
                  className={formErrors.confirmPassword && 'border-red-500'}
                />
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account & Join
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500 pt-4">
                <p>By joining, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </form>
          )}

          {/* Error Display */}
          {acceptError && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertDescription className="text-red-600">
                {(acceptError as any)?.data?.message || 'Failed to process invitation'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t pt-6">

          <Link 
            href="/" 
            className="text-xs text-red-600 hover:underline"
          >
            Return to homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}