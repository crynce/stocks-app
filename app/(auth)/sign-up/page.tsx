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
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });
  //   const onSubmit: SubmitHandler<SignUpFormData> = (data) => console.log(data);

  const onSubmit = async (data: SignUpFormData) => {
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
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          validation={{ required: "Full name is required", minLength: 2 }}
          register={register}
          error={errors.fullName}
        />
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
        />
        <InputFields
          name="password"
          label="Password"
          placeholder="Set password"
          type="password"
          validation={{ required: "Password is required", minLength: 8 }}
          register={register}
          error={errors.password}
        />
        <CountrySelectField
          label="Country"
          control={control}
          name="country"
          error={errors.country}
          required
        />
        <SelectField
          name="investmentGoals"
          placeholder="Select your investment Goals"
          label="Investment Goals"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />
        <SelectField
          name="riskTolerance"
          placeholder="Select your risk tolerance"
          label="Risk Tolerance"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />
        <SelectField
          name="preferredIndustry"
          placeholder="Select your Preferred Industry"
          label="Preferred Industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Creating Account" : "Start Your Investing Journey "}
        </Button>
        <FooterLink
          text="Already have an account ?"
          linkText="Sign In"
          href="/sign-in"
        />
      </form>
    </>
  );
};

export default SignUp;
