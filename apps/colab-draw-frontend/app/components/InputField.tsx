import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  isSignin: boolean;
}

export default function InputField({ isSignin }: InputFieldProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
        <Input
          id="fieldgroup-email"
          type="email"
          placeholder="name@example.com"
        />
        <FieldDescription>Please enter your account email</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
        <Input id="fieldgroup-name" placeholder=". . . . ." type="password" />
      </Field>
      <FieldDescription>Please enter your account password</FieldDescription>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">{isSignin ? "Signin" : "Signup"}</Button>
      </Field>
    </FieldGroup>
  );
}
