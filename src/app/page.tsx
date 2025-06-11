import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import SlugForm from "@/components/slugform";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Feedback Portal
            </CardTitle>
            <CardDescription>
              Enter your feedback form code to provide feedback on a talk or
              workshop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SlugForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have a code? Contact the speaker.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
