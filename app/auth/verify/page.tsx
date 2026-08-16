import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6" />
          </div>

          <CardTitle>Check your email</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            We sent a verification link to
          </p>

          {email && <p className="mt-1 font-medium">{email}</p>}

          <p className="mt-4 text-sm text-muted-foreground">
            Click the link in the email to verify your CodeSync account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
