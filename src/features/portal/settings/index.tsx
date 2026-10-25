import { useGetIdentity } from "@refinedev/core";
import { Avatar, Button, Card, Separator } from "@heroui/react";
import type { AuthUser } from "@lib/authStorage";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { DefaultAppSelector } from "./DefaultAppSelector";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export const Settings = () => {
  const { data: identity } = useGetIdentity<AuthUser>();

  const user = {
    name: identity?.name ?? "User",
    email: identity?.email ?? "",
    image: identity?.image ?? null,
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <Heading as="h1" size="2xl" weight="bold">
          My Settings
        </Heading>
        <Text size="sm" color="muted" className="mt-1">
          Manage your account settings and profile information
        </Text>
      </div>

      <Card className="w-full" variant="secondary">
        <Card.Content className="p-6 space-y-6">
          <div className="flex gap-4">
            <Avatar size="lg" className="ring-2 ring-secondary/30">
              <Avatar.Image
                src={user.image ?? undefined}
                alt={user.name ?? "User"}
              />
              <Avatar.Fallback className="bg-secondary/10 text-secondary font-semibold">
                {getInitials(user.name)}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <Heading as="h2" size="lg" weight="semibold">
                {user.name ?? "User"}
              </Heading>
              <Text size="sm" color="muted">
                {user.email}
              </Text>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text size="sm" weight="semibold" color="muted" className="mb-2">
                Full Name
              </Text>
              <Text
                size="base"
                weight="normal"
                className="p-3 bg-default-100 rounded-md"
              >
                {user.name || "-"}
              </Text>
            </div>

            <div>
              <Text size="sm" weight="semibold" color="muted" className="mb-2">
                Email Address
              </Text>
              <Text
                size="base"
                weight="normal"
                className="p-3 bg-default-100 rounded-md"
              >
                {user.email || "-"}
              </Text>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" isDisabled>
              Edit Profile
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card className="w-full" variant="secondary">
        <Card.Header>
          <Card.Title>Preferences</Card.Title>
          <Card.Description>
            Preferensi aplikasi yang berlaku di seluruh portal.
          </Card.Description>
        </Card.Header>
        <Card.Content className="p-6 pt-0">
          <DefaultAppSelector />
        </Card.Content>
      </Card>
    </div>
  );
};
