"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Script from "next/script";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get("p");
    if (payment) {
      handlePayment();
    }
    urlParams.delete("payment");
    window.history.replaceState({}, "", window.location.pathname);
  }, [user]);
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/upgrade", {
        method: "POST",
        body: JSON.stringify({ isYearly }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to create order");
      const data = await response.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.orderId,
        handler: (response: any) => {
          console.log(response);
        },
        prefill: {
          name: user?.displayName,
          email: user?.email,
          phone: user?.phoneNumber,
        },
        theme: {
          color: "#000000",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="py-16 md:py-32 max-md:pt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Simple Pricing
          </h1>
          <p>
            Choose the plan that fits your PR workflow needs. From occasional
            use to daily development.
          </p>

          <div className="flex items-center justify-center space-x-3 pt-4">
            <Label htmlFor="billing-toggle" className="font-medium">
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className="font-medium">
              Yearly
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Save 33%
              </span>
            </Label>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:mt-16 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>

              <span className="my-3 block text-2xl font-semibold">$0</span>

              <CardDescription className="text-sm">
                Perfect for occasional PRs
              </CardDescription>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/login">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "3 Free PR Message Generations",
                  "Auto-Fill PR Description",
                  "One-Click Generation",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="relative">
            <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </span>

            <CardHeader>
              <CardTitle className="font-medium">Pro</CardTitle>

              <span className="my-3 block text-2xl font-semibold">
                ${isYearly ? "2.67" : "3.99"} {isYearly ? "/ mo" : "/ mo"}
                {isYearly && (
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    billed annually
                  </span>
                )}
              </span>

              <CardDescription className="text-sm">
                For active developers
              </CardDescription>

              {!user ? (
                <Button asChild className="mt-4 w-full">
                  <Link href="/login">Get Started</Link>
                </Button>
              ) : (
                <Button
                  onClick={handlePayment}
                  className="mt-4 w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Upgrade Now"}
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Unlimited PR Message Generations",
                  "Auto-Fill PR Description",
                  "One-Click Generation",
                  "Priority Support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="relative border-dashed border-muted-foreground/30">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-amber-950">
              Coming Soon
            </span>

            <CardHeader>
              <CardTitle className="font-medium">Enterprise</CardTitle>

              <span className="my-3 block text-2xl font-semibold">Custom</span>

              <CardDescription className="text-sm">
                For teams and organizations
              </CardDescription>

              <Button variant="outline" className="mt-4 w-full" disabled>
                Coming Soon
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm text-muted-foreground">
                {[
                  "Everything in Pro Plan",
                  "Unlimited Team Members",
                  "Direct GitHub Integration",
                  "Diagram Generation",
                  "Auto Analysis",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
