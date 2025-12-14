// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckSquare, 
  Users, 
  FolderKanban, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  Star,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const features = [
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with multiple statuses and priorities',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members, assign roles, and collaborate in real-time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: FolderKanban,
      title: 'Project Organization',
      description: 'Organize tasks into projects and workspaces with visual boards',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'This task manager transformed how our team collaborates. The workspace structure is perfect for our multi-project environment.',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      company: 'StartupXYZ',
      content: 'The activity logs and detailed task views help us stay on track. Our productivity has increased by 40% since switching.',
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Team Lead',
      company: 'CreativeLab',
      content: 'Beautiful interface with powerful features. The red theme gives it a professional yet energetic feel.',
      avatar: 'ER',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-linear-to-r from-red-600/5 to-red-800/5 dark:from-red-600/10 dark:to-red-800/10"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-linear-to-r from-red-600 to-red-800 text-white border-none">
              <Star className="h-3 w-3 mr-1" />
              Workspace Task Manager
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
              Streamline Your Team&apos;s{' '}
              <span className="bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Workflow
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              A modern task management system designed for teams. Organize workspaces, 
              manage projects, and collaborate efficiently with role-based access control.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25"
                asChild
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                asChild
              >
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Everything Your Team Needs
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to help teams organize, collaborate, and deliver
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-red-50 dark:bg-red-950/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Get started in minutes with our simple workflow
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-r from-red-600 to-red-800 text-white font-bold text-lg">
                1
              </div>
              <Card className="border-red-100 dark:border-red-900/30 pt-8">
                <CardContent className="pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Create Workspace
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start by creating a workspace for your team. Set up projects and invite members.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative text-center">
              <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-r from-red-600 to-red-800 text-white font-bold text-lg">
                2
              </div>
              <Card className="border-red-100 dark:border-red-900/30 pt-8">
                <CardContent className="pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Add Projects & Tasks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Organize work into projects and create tasks with priorities, due dates, and assignees.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative text-center">
              <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-r from-red-600 to-red-800 text-white font-bold text-lg">
                3
              </div>
              <Card className="border-red-100 dark:border-red-900/30 pt-8">
                <CardContent className="pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Collaborate & Track
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Work together with your team, track progress, and get real-time updates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Loved by Teams Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              See what our users have to say about their experience
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-red-600 to-red-800 text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-1 place-content-center">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 bg-linear-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
                <span className="text-xl font-bold text-white">Workspace</span>
              </div>
              <p className="text-sm">
                A modern task management system designed for teams to collaborate and deliver.
              </p>
            </div>
            
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Workspace Task Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}