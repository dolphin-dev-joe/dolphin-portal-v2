import { SelectInput } from "@components/inputs/SelectInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import React from "react";

const ROLE_OPTIONS = [
  { id: "kasir", label: "Kasir" },
  { id: "admin", label: "Admin" },
];

export default function PosEmployeeForm() {
  return (
    <>
      <TextInput
        fieldName="username"
        fieldLabel="Username"
        placeholder="Masukkan username"
        isRequired
      />
      <TextInput
        fieldName="name"
        fieldLabel="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        isRequired
      />
      <TextInput
        fieldName="password"
        fieldLabel="Password"
        placeholder="Kosongkan jika tidak diubah"
      />
      <SelectInput
        fieldName="role"
        fieldLabel="Role"
        options={ROLE_OPTIONS}
        isRequired
      />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Status Aktif"
        description="Aktifkan atau nonaktifkan akun kasir ini"
      />
    </>
  );
}
