"use client";

import CountrySelectField from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputFields from "@/components/forms/InputFields";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  //   const onSubmit: SubmitHandler<SignUpFormData> = (data) => console.log(data);

  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data, "data");
    } catch (e) {
      console.error(e, "error");
    }
  };

  return (
    <>
      <h1 className="form-title">Sign up and Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputFields
          name="email"
          label="Enter your Email"
          placeholder="shozofficial@mail.com"
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
          register={register}
          error={errors.email}
          type="email"
        />
        <InputFields
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          validation={{ required: "Password is required", minLength: 8 }}
          register={register}
          error={errors.password}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Creating Account" : "Log In"}
        </Button>
        <FooterLink
          text="Don't have an account ?"
          linkText="Create an account"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignUp;
