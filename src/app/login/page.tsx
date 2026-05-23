"use client";

import { Suspense, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { PhoneAuthForm } from "@/components/auth/phone-auth-form";
import { SSOButtons } from "@/components/auth/sso-buttons";
import { redirectAfterAuth, usePostAuthRedirectUrl } from "@/lib/auth/use-post-auth-redirect";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function LoginForm() {
  const postAuthRedirect = usePostAuthRedirectUrl();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInFormValues) {
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    redirectAfterAuth(postAuthRedirect);
  }

  return (
    <AuthFormLayout
      footerLink={{
        text: "Don't have an account? Get started for free",
        href: "/signup",
      }}
    >
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="font-departure-mono">
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="font-departure-mono">
            Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-departure-mono">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-departure-mono">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
              <Button
                type="submit"
                className="font-departure-mono w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
              <SSOButtons />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="phone">
          <PhoneAuthForm mode="signIn" />
          <div className="mt-4">
            <SSOButtons />
          </div>
        </TabsContent>
      </Tabs>
    </AuthFormLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
