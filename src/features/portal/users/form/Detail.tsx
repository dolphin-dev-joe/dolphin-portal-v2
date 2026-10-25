import { AutoCompleteInput } from "@components/inputs/AutoCompleteInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import React from "react";

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

      {/* Email */}
      <TextInput
        fieldName="email"
        fieldLabel="Email"
        placeholder="user@example.com"
        isRequired
        additionalRules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
        options={[
          { key: "user", label: "User", value: "user" },
          { key: "admin", label: "Admin", value: "admin" },
          { key: "super_admin", label: "Super Admin", value: "super_admin" },
        ]}
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
