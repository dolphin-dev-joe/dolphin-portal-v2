import { AutoCompleteInput } from "@components/inputs/AutoCompleteInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import { USER_ROLE_OPTIONS } from "../interfaces";

// One account works for both the portal and the POS app.
// Role "kasir" can only sign in to the POS app.
export default function Detail() {
  return (
    <>
      {/* Name */}
      <TextInput
        fieldName="name"
        fieldLabel="Name"
        placeholder="Enter user name"
        isRequired
      />

      {/* Username */}
      <TextInput
        fieldName="username"
        fieldLabel="Username"
        placeholder="e.g. kasir1"
        description="Used to sign in. A username or an email is required."
        additionalRules={{
          maxLength: { value: 50, message: "Max 50 characters" },
          pattern: {
            value: /^[^\s@]*$/,
            message: "No spaces or @",
          },
          validate: (value: string, values: { email?: string }) =>
            !!value?.trim() ||
            !!values.email?.trim() ||
            "Fill in a username or an email",
        }}
      />

      {/* Email */}
      <TextInput
        fieldName="email"
        fieldLabel="Email"
        placeholder="user@example.com"
        description="Optional for cashiers."
        additionalRules={{
          pattern: {
            value: /^$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
      />

      {/* Password */}
      <TextInput
        fieldName="password"
        fieldLabel="Password"
        placeholder="Enter password"
        description="Leave empty to keep the current password."
        isRequired={false}
        additionalRules={{
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        }}
      />

      {/* Role */}
      <AutoCompleteInput
        fieldName="role"
        fieldLabel="Role"
        placeholder="Select user role"
        description="Kasir can only sign in to the POS app."
        options={USER_ROLE_OPTIONS.map((r) => ({ key: r.value, ...r }))}
        isRequired
      />

      {/* Active Status */}
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Account Status"
        description="Enable or disable user account"
      />
    </>
  );
}
