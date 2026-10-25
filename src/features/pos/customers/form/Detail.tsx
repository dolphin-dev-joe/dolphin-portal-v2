import { TextInput } from "@components/inputs/TextInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import SwitchInput from "@components/inputs/SwitchInput";
import React from "react";

export default function PosCustomerDetail() {
  return (
    <>
      <TextInput fieldName="name" fieldLabel="Nama" isDisabled />
      <TextInput fieldName="phone" fieldLabel="Telepon" isDisabled />
      <TextAreaInput fieldName="address" fieldLabel="Alamat" isDisabled />
      <SwitchInput fieldName="isActive" fieldLabel="Status Aktif" isDisabled />
    </>
  );
}
