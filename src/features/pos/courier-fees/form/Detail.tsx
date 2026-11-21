import { NumberInput } from "@components/inputs/NumberInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";

export default function PosCourierFeeForm() {
  return (
    <>
      <TextInput
        fieldName="name"
        fieldLabel="Nama"
        placeholder="Contoh: Antar"
        isRequired
      />
      <NumberInput
        fieldName="price"
        fieldLabel="Harga (Rp)"
        isRequired
        description="Berlaku untuk biaya yang ditambahkan setelah ini. Order lama tetap dengan harga saat itu."
      />
      <NumberInput fieldName="sortOrder" fieldLabel="Urutan" />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Ditawarkan di POS"
        description="Kalau dimatikan, kasir tidak bisa menambahkan biaya ini ke order baru."
      />
    </>
  );
}
