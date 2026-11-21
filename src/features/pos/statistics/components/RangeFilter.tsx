import {
  DateField,
  DateRangePicker,
  FieldError,
  I18nProvider,
  RangeCalendar,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
} from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import { useState } from "react";
import { MAX_DAYS, PRESETS, rangeDays, todayDate, type DateRange, type PresetKey } from "../ranges";

interface RangeFilterProps {
  preset: PresetKey | "custom";
  custom: DateRange | null;
  onPreset: (key: PresetKey) => void;
  onCustom: (range: DateRange) => void;
}

type PickerValue = { start: DateValue; end: DateValue } | null;

/** Date range presets first, then a custom range. Scopes the whole page. */
export default function RangeFilter({ preset, custom, onPreset, onCustom }: RangeFilterProps) {
  const [draft, setDraft] = useState<PickerValue>(null);
  const [error, setError] = useState<string | null>(null);

  const value: PickerValue =
    draft ??
    (preset === "custom" && custom ? { start: parseDate(custom.from), end: parseDate(custom.to) } : null);

  const handleCustom = (v: PickerValue) => {
    setDraft(v);
    if (!v) return;
    if (rangeDays(v.start, v.end) > MAX_DAYS) {
      setError(`Rentang maksimal ${MAX_DAYS} hari.`);
      return;
    }
    setError(null);
    setDraft(null);
    onCustom({ from: v.start.toString(), to: v.end.toString() });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
      <ToggleButtonGroup
        aria-label="Periode"
        size="sm"
        isDetached
        className="flex-wrap justify-start"
        selectionMode="single"
        selectedKeys={preset === "custom" ? new Set<Key>() : new Set<Key>([preset])}
        onSelectionChange={(keys) => {
          const [key] = keys;
          if (!key) return; // keep the current preset when it is clicked again
          setDraft(null);
          setError(null);
          onPreset(key as PresetKey);
        }}
      >
        {PRESETS.map((p) => (
          <ToggleButton key={p.key} id={p.key}>
            {p.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* dd/mm/yyyy and Indonesian month names, whatever the browser locale. */}
      <I18nProvider locale="id-ID">
        <DateRangePicker
          aria-label="Rentang tanggal kustom"
          value={value}
          onChange={handleCustom}
          maxValue={todayDate()}
          isInvalid={!!error}
          className="w-full sm:w-64"
        >
          <DateField.Group fullWidth>
            <DateField.InputContainer>
              <DateField.Input slot="start">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateRangePicker.RangeSeparator />
              <DateField.Input slot="end">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.InputContainer>
            <DateField.Suffix>
              <DateRangePicker.Trigger>
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <FieldError>{error}</FieldError>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label="Pilih rentang tanggal">
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      </I18nProvider>
    </div>
  );
}
