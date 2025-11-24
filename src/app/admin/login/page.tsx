"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

// NOTE: This is a mock login. In a real app, you would use Firebase Auth.
async function signIn(email: string) {
    // Mock sign in. In a real app, this would be:
    // await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signing in with ${email}`);
    if (email.endsWith('@admin.com')) {
      // In a real app, the session/cookie would be set by Firebase automatically or via a server action
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use an email ending in @admin.com" };
}


export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn(email);
        
        if (result.success) {
            toast({
                title: "Login Successful",
                description: "Redirecting to dashboard...",
            });
            router.push('/admin/courses');
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: result.error || "An unknown error occurred.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40">
            <div className='absolute top-4 right-4'>
                <Button asChild variant="ghost">
                    <Link href="/courses">Back to Site</Link>
                </Button>
            </div>
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-headline font-bold">CourseNote</span>
                    </div>
                    <CardTitle className="text-2xl font-headline">Admin Dashboard</CardTitle>
                    <CardDescription>Enter your credentials to access the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full">This is a mock login. Use any email ending with <span className="font-semibold text-primary">@admin.com</span>.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
