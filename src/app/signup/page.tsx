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

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SignupForm() {
  const postAuthRedirect = usePostAuthRedirectUrl();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: SignUpFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: postAuthRedirect },
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    if (authData.session) {
      redirectAfterAuth(postAuthRedirect);
      return;
    }

    setSubmitMessage(
      "Check your email to confirm your account, then sign in."
    );
  }

  return (
    <AuthFormLayout
      footerLink={{
        text: "Already have an account? Sign in",
        href: "/login",
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
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-departure-mono">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
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
              {submitMessage ? (
                <p className="text-sm text-muted-foreground">{submitMessage}</p>
              ) : null}
              <Button
                type="submit"
                className="font-departure-mono w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create account"}
              </Button>
              <SSOButtons variant="signUp" />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="phone">
          <PhoneAuthForm mode="signUp" />
          <div className="mt-4">
            <SSOButtons variant="signUp" />
          </div>
        </TabsContent>
      </Tabs>
    </AuthFormLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
