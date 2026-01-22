"use client";

import FooterLink from "@/components/forms/FooterLink";
import InputFields from "@/components/forms/InputFields";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.actions";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
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
      const result = await signInWithEmail(data);
      if (!result.success) {
        throw result.error;
      }

      toast("Sign in successful", {
        description: "You are now logged in",
      });
      router.push("/");
    } catch (e) {
      console.error(e, "error");
      toast("Sign in failed", {
        description: e instanceof Error ? e.message : "Failed to sign in",
      });
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
          {isSubmitting ? "Signing In" : "Sign In"}
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
