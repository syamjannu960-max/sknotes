'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleAdminLogin } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    success: false,
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                </>
            ) : (
                'Sign In'
            )}
        </Button>
    );
}

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction] = useActionState(handleAdminLogin, initialState);

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Login Successful',
                description: 'Redirecting to your dashboard.',
            });
            router.replace('/admin/courses');
        } else if (state.message) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: state.message,
            });
        }
    }, [state, router, toast]);

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
                        <span className="text-2xl font-headline font-bold">SKNotes</span>
                    </div>
                    <CardTitle className="text-2xl font-headline">Admin Dashboard</CardTitle>
                    <CardDescription>Enter your credentials to access the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="admin"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full">
                        Login with the credentials stored in your 'users' collection.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
