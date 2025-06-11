"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Form as FormSchema } from "@/lib/types/database.types";
import {
  panelFeedbackSchema,
  talkFeedbackSchema,
  workshopFeedbackSchema,
} from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitFeedbackAction } from "@/app/feedback/[slug]/actions";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const generalFeedbackQuestions = [
  {
    label: "How would you rate the overall topic?",
    description: "Was it relevant to you? Did it fit the occasion?",
    name: "topic",
  },
  {
    label: "How would you rate the presenter's expertise?",
    description: "Did they seem knowledgeable? Did they seem prepared?",
    name: "expertise",
  },
];

const talkFeedbackQuestions = [
  {
    label: "How would you rate the presentation?",
    description: "Was it engaging? What about the pacing?",
    name: "presentation",
  },
  {
    label: "How would you rate the slides?",
    description: "Were they clear? Convoluted? Did they add value?",
    name: "slides",
  },
];

const workshopFeedbackQuestions = [
  {
    label: "How would you rate the workshop materials?",
    description:
      "Did they provide enough information? Were they easy to follow?",
    name: "materials",
  },
  {
    label: "How would you rate the interactive parts of the workshop?",
    description: "Were they engaging? Were they too easy or too hard?",
    name: "interaction",
  },
];

const panelFeedbackQuestions = [
  {
    label: "How would you rate the overall discussion?",
    description: "Were speaking times balanced? Did the panel stay on topic?",
    name: "discussion",
  },
  {
    label: "How would you rate the panel's participants?",
    description:
      "Did they present a diverse background? Did the discussion feel fair/balanced?",
    name: "panelists",
  },
];

function PanelForm({
  formId,
  formType,
}: {
  formId: number;
  formType: "talk" | "workshop" | "panel";
}) {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, {
    error: undefined,
  });

  const form = useForm<z.infer<typeof panelFeedbackSchema>>({
    resolver: zodResolver(panelFeedbackSchema),
    defaultValues: {
      formId,
      formType,
      username: "",
      email: "",
      mayPublish: false,
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success("Feedback submission successful.");
      router.push("/");
    }
  }, [router, state.success]);

  const questions = [
    ...generalFeedbackQuestions,
    ...panelFeedbackQuestions,
  ] as Array<{
    label: string;
    description: string;
    name: "topic" | "panelists" | "expertise" | "discussion";
  }>;

  return (
    <Form {...form}>
      <form action={formAction}>
        <input type="hidden" name="formId" defaultValue={formId} />
        <input type="hidden" name="formType" defaultValue={formType} />
        <div className="grid gap-4">
          {questions.map((question) => (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{question.label}</FormLabel>
                  <FormDescription className="-mt-1">
                    {question.description}
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={undefined}
                      name={field.name}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => {
                        return (
                          <FormItem
                            key={rating}
                            className="flex flex-col items-center w-16"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={rating.toString()}
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${
                                (field.value?.toString() || "") ===
                                rating.toString()
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 hover:bg-gray-2000 text-gray-700"
                              }`}
                            >
                              {rating}
                            </FormLabel>
                            <FormDescription className="text-xs mt-1">
                              {rating === 1
                                ? "Poor"
                                : rating === 2
                                ? "Fair"
                                : rating === 3
                                ? "Good"
                                : rating === 4
                                ? "Very Good"
                                : "Excellent"}
                            </FormDescription>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments/Questions</FormLabel>
                <FormDescription className="-mt-1">
                  If you have any additional comments or questions, please leave
                  them here.
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share any additional thoughts or questions"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium">Optional Information</h3>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="jane@example.com"
                    />
                  </FormControl>
                  <FormDescription>
                    Your email will only be used to contact you if requested,
                    e.g. when asking a question. It will never be published or
                    used for any other purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mayPublish"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    I allow my feedback to be published anonymously in the
                    future.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 font-bold"
          disabled={isPending || !form.formState.isValid}
        >
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
}

function TalkForm({
  formId,
  formType,
}: {
  formId: number;
  formType: "talk" | "workshop" | "panel";
}) {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, {
    error: undefined,
  });

  const form = useForm<z.infer<typeof talkFeedbackSchema>>({
    resolver: zodResolver(talkFeedbackSchema),
    defaultValues: {
      formId,
      formType,
      username: "",
      email: "",
      mayPublish: false,
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success("Feedback submission successful.");
      router.push("/");
    }
  }, [router, state.success]);

  const questions = [
    ...generalFeedbackQuestions,
    ...talkFeedbackQuestions,
  ] as Array<{
    label: string;
    description: string;
    name: "topic" | "presentation" | "expertise" | "slides";
  }>;

  return (
    <Form {...form}>
      <form action={formAction}>
        <input type="hidden" name="formId" defaultValue={formId} />
        <input type="hidden" name="formType" defaultValue={formType} />
        <div className="grid gap-4">
          {questions.map((question) => (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{question.label}</FormLabel>
                  <FormDescription className="-mt-1">
                    {question.description}
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={undefined}
                      name={field.name}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => {
                        return (
                          <FormItem
                            key={rating}
                            className="flex flex-col items-center w-16"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={rating.toString()}
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${
                                (field.value?.toString() || "") ===
                                rating.toString()
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 hover:bg-gray-2000 text-gray-700"
                              }`}
                            >
                              {rating}
                            </FormLabel>
                            <FormDescription className="text-xs mt-1">
                              {rating === 1
                                ? "Poor"
                                : rating === 2
                                ? "Fair"
                                : rating === 3
                                ? "Good"
                                : rating === 4
                                ? "Very Good"
                                : "Excellent"}
                            </FormDescription>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments/Questions</FormLabel>
                <FormDescription className="-mt-1">
                  If you have any additional comments or questions, please leave
                  them here.
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share any additional thoughts or questions"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium">Optional Information</h3>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="jane@example.com"
                    />
                  </FormControl>
                  <FormDescription>
                    Your email will only be used to contact you if requested,
                    e.g. when asking a question. It will never be published or
                    used for any other purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mayPublish"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name={field.name}
                    />
                  </FormControl>
                  <FormLabel>
                    I allow my feedback to be published anonymously in the
                    future.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 font-bold"
          disabled={isPending || !form.formState.isValid}
        >
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
}

function WorkshopForm({
  formId,
  formType,
}: {
  formId: number;
  formType: "talk" | "workshop" | "panel";
}) {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, {
    error: undefined,
  });

  const form = useForm<z.infer<typeof workshopFeedbackSchema>>({
    resolver: zodResolver(workshopFeedbackSchema),
    defaultValues: {
      formId,
      formType,
      username: "",
      email: "",
      mayPublish: false,
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success("Feedback submission successful.");
      router.push("/");
    }
  }, [router, state.success]);

  const questions = [
    ...generalFeedbackQuestions,
    ...workshopFeedbackQuestions,
  ] as Array<{
    label: string;
    description: string;
    name: "topic" | "materials" | "expertise" | "interaction";
  }>;

  return (
    <Form {...form}>
      <form action={formAction}>
        <input type="hidden" name="formType" defaultValue={formType} />
        <input type="hidden" name="formId" defaultValue={formId} />
        <div className="grid gap-4">
          {questions.map((question) => (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{question.label}</FormLabel>
                  <FormDescription className="-mt-1">
                    {question.description}
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      name={field.name}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => {
                        return (
                          <FormItem
                            key={rating}
                            className="flex flex-col items-center w-16"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={rating.toString()}
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${
                                (field.value?.toString() || "") ===
                                rating.toString()
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 hover:bg-gray-2000 text-gray-700"
                              }`}
                            >
                              {rating}
                            </FormLabel>
                            <FormDescription className="text-xs mt-1">
                              {rating === 1
                                ? "Poor"
                                : rating === 2
                                ? "Fair"
                                : rating === 3
                                ? "Good"
                                : rating === 4
                                ? "Very Good"
                                : "Excellent"}
                            </FormDescription>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Comments/Questions</FormLabel>
                <FormDescription className="-mt-1">
                  If you have any additional comments or questions, please leave
                  them here.
                </FormDescription>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share any additional thoughts or questions"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium">Optional Information</h3>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="jane@example.com"
                    />
                  </FormControl>
                  <FormDescription>
                    Your email will only be used to contact you if requested,
                    e.g. when asking a question. It will never be published or
                    used for any other purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mayPublish"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name={field.name}
                    />
                  </FormControl>
                  <FormLabel>
                    I allow my feedback to be published anonymously in the
                    future.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 font-bold"
          disabled={isPending || !form.formState.isValid}
        >
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
}

export default function FeedbackForm({ form }: { form: FormSchema }) {
  return (
    <Card className="w-full mx-0 sm:mx-auto border-0 sm:border shadow-none sm:shadow-md rounded-none sm:rounded-lg">
      <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
        <CardTitle className="text-2xl">{form.title}</CardTitle>
        {form.event_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <Calendar className="h-4 w-4" />
            <span>{form.event_name}</span>
            {form.event_date && (
              <span className="text-gray-400">
                • {new Date(form.event_date).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        {form.description && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700 leading-relaxed">{form.description}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {form.type === "talk" ? (
          <TalkForm formId={form.id} formType={form.type} />
        ) : form.type === "workshop" ? (
          <WorkshopForm formId={form.id} formType={form.type} />
        ) : (
          <PanelForm formId={form.id} formType={form.type} />
        )}
      </CardContent>
    </Card>
  );
}
