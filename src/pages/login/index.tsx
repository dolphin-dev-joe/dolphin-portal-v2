import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Icon } from "@iconify/react";

import {
  Alert,
  Button,
  Card,
  CloseButton,
  FieldError,
  Form,
  InputGroup,
  Label,
  Separator,
  TextField,
} from "@heroui/react";

type LoginFormValues = {
  login: string;
  password: string;
};

// Floating laundry-bubble decorations for the login background.
const BUBBLES = [
  { left: "6%", size: 28, delay: "0s", duration: "15s" },
  { left: "15%", size: 14, delay: "5s", duration: "11s" },
  { left: "24%", size: 20, delay: "9s", duration: "17s" },
  { left: "38%", size: 10, delay: "2s", duration: "9s" },
  { left: "47%", size: 34, delay: "7s", duration: "19s" },
  { left: "58%", size: 16, delay: "12s", duration: "13s" },
  { left: "69%", size: 22, delay: "3s", duration: "16s" },
  { left: "78%", size: 12, delay: "8s", duration: "10s" },
  { left: "88%", size: 26, delay: "1s", duration: "18s" },
  { left: "94%", size: 16, delay: "11s", duration: "12s" },
];

export default function Login() {
  const [values, setValues] = useState<LoginFormValues>({
    login: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } =
    useLogin<LoginFormValues>();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    login(
      {
        login: values.login,
        password: values.password,
      },
      {
        onError: (error) => {
          const msg =
            (error as { message?: string })?.message ||
            "Invalid username/email or password.";

          setErrorMessage(msg);
        },
      },
    );
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-sky-100 via-background to-cyan-100 dark:from-background dark:via-background dark:to-[oklch(15%_0.03_252.66)]">
      {/* Soft mesh gradient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-130 w-130 rounded-full bg-accent/25 blur-[120px] animate-login-blob" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-115 w-115 rounded-full bg-cyan-400/20 blur-[120px] animate-login-blob [animation-delay:-5s]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-120 w-120 rounded-full bg-sky-400/20 blur-[130px] animate-login-blob [animation-delay:-9s]" />

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 78%)",
        }}
      />

      {/* Rising laundry bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="absolute -bottom-12.5 rounded-full border border-white/40 bg-white/20 shadow-[inset_0_0_8px_rgba(255,255,255,0.5)] backdrop-blur-[1px] animate-login-bubble dark:border-white/10 dark:bg-white/5"
            style={{
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      <Card className="relative z-10 w-full max-w-sm border-small border-white/40 bg-surface/70 shadow-2xl shadow-accent/10 backdrop-blur-xl dark:border-white/10 dark:bg-surface/60">
        {/* Header */}
        <Card.Header className="flex flex-col gap-1 items-center justify-center pt-10 pb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 inner-shadow shadow-md">
            <img
              src="/assets/images/dl-logo.png"
              alt="Dolphin Laundry Logo"
              width={72}
              height={72}
              className="opacity-100"
            />
          </div>

          <Card.Title className="text-2xl font-bold text-default-900 tracking-tight">
            Welcome Back
          </Card.Title>

          <Card.Description className="text-small text-default-500 text-center leading-relaxed px-6">
            Sign in to your account to continue to Dolphin Portal
          </Card.Description>
        </Card.Header>

        {/* Content */}
        <Card.Content className="px-8 pb-8 gap-6 flex flex-col items-center">
          {/* Error Alert */}
          {errorMessage && (
            <Alert color="danger" className="w-full text-sm">
              <span>{errorMessage}</span>

              <CloseButton slot="close" onPress={() => setErrorMessage(null)} />
            </Alert>
          )}

          <Form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {/* Username or email */}
            <TextField
              isRequired
              className="w-full"
              name="login"
              value={values.login}
              onChange={(v) => {
                setValues((prev) => ({
                  ...prev,
                  login: v,
                }));

                if (errorMessage) setErrorMessage(null);
              }}
            >
              <Label>Username or Email</Label>

              <InputGroup>
                <InputGroup.Prefix>
                  <Icon
                    icon="solar:user-bold"
                    className="text-xl text-default-400"
                  />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Enter your username or email" />
              </InputGroup>

              <FieldError className="text-xs" />
            </TextField>

            {/* Password */}
            <TextField
              isRequired
              className="w-full"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              value={values.password}
              onChange={(v) => {
                setValues((prev) => ({
                  ...prev,
                  password: v,
                }));

                if (errorMessage) setErrorMessage(null);
              }}
            >
              <Label>Password</Label>

              <InputGroup>
                <InputGroup.Prefix>
                  <Icon
                    icon="solar:lock-password-bold"
                    className="text-xl text-default-400"
                  />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="Enter your password" />
                <InputGroup.Suffix>
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                    className="focus:outline-none text-default-400 hover:text-default-600 transition-colors"
                  >
                    {isPasswordVisible ? (
                      <Icon icon="solar:eye-bold" className="text-xl" />
                    ) : (
                      <Icon icon="solar:eye-closed-bold" className="text-xl" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>

              <FieldError className="text-xs" />
            </TextField>

            <Button
              type="submit"
              size="lg"
              isPending={isPending}
              className="w-full font-semibold h-12 text-medium mt-2"
            >
              Sign In
            </Button>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-2 w-full">
            <Separator className="flex-1" />

            <Card.Description className="text-tiny text-default-300 uppercase font-bold">
              Secure
            </Card.Description>

            <Separator className="flex-1" />
          </div>

          {/* Footer Text */}
          <div className="text-center">
            <Card.Description className="text-tiny text-default-400">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </Card.Description>
          </div>
        </Card.Content>

        {/* Footer */}
        <Card.Footer className="justify-center py-4 border-t border-default-100 bg-default-50/50">
          <Card.Description className="text-tiny text-default-400">
            Powered by{" "}
            <span className="text-tiny text-default-600 font-medium">
              Dolphin Portal
            </span>
          </Card.Description>
        </Card.Footer>
      </Card>
    </div>
  );
}
