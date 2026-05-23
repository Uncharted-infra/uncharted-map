import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AuthFormLayoutProps {
  children: React.ReactNode;
  footerLink: {
    text: string;
    href: string;
  };
}

export function AuthFormLayout({ children, footerLink }: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 font-fenix">
      <div className="w-full max-w-[400px]">
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Link
              href={footerLink.href}
              className="font-departure-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {footerLink.text}
            </Link>
            <Link
              href="/"
              className="font-departure-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to map
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
