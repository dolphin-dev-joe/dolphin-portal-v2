import { BaseRecord, CreateResponse, UpdateResponse } from "@refinedev/core";
import { PropsWithChildren } from "react";
import { cn } from "@heroui/react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export interface FormWrapperProps<
  TFieldValues extends FieldValues = FieldValues
> extends PropsWithChildren {
  className?: string;
  methods: UseFormReturn<TFieldValues>;
  submitHandler?: (
    data: TFieldValues
  ) => Promise<void | UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>>;
}

export const FormWrapper = <T extends FieldValues>({
  methods,
  submitHandler,
  children,
  className,
}: FormWrapperProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        className={cn(
          "relative w-full",
          // Mobile-first responsive container
          "max-w-full overflow-x-hidden",
          // Small screen specific adjustments
          "min-w-0 flex-1",
          // Force box-sizing for all elements
          "*:box-border",
          className
        )}
        onSubmit={methods.handleSubmit(async (data) => {
          if (submitHandler) {
            await submitHandler(data);
          }
        })}
      >
        {children}
      </form>
    </FormProvider>
  );
};
