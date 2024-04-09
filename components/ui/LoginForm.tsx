"use client";

import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { StateDispatch } from "@/lib/utils";

type SignUpValues = {
  email: string;
};

type LoginValues = {
  email: string;
  password: string;
};

export type DisplayState = {
  login: boolean;
  signup: boolean;
};

function FormField<T extends string>({
  title,
  placeholder,
  register,
}: {
  title?: string;
  placeholder?: string;
  register: UseFormRegisterReturn<T>;
}) {
  return (
    <div className="form-field">
      {title && (
        <div className="font-medium text-home-form-title my-[6px]">{title}</div>
      )}
      <input
        placeholder={placeholder}
        {...register}
        className="bg-home-form-field-background w-full shadow-home-form-field-shadow h-[49px] rounded-xl pl-[10px] "
      />
    </div>
  );
}

function FormContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shadow-home-form-shadow rounded-2xl flex flex-col px-[24px]",
        className
      )}
    >
      {children}
    </div>
  );
}

function FormButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      className={cn(className, "border-0 text-lg text-home-form-title")}
      variant="pinkInner"
    >
      {children}
    </Button>
  );
}

export function Login({
  className,
  setDisplay,
}: {
  className?: string;
  setDisplay: StateDispatch<DisplayState>;
}) {
  const { handleSubmit, register } = useForm<LoginValues>();
  const onSubmit: SubmitHandler<LoginValues> = (data) => console.log(data);
  return (
    <FormContainer className={className}>
      <h1 className="mt-[20px] font-semibold text-home-form-text/80 text-2xl mb-[23px]">
        登陆
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="邮箱"
          placeholder="example@gmail.com"
          register={register("email")}
        />
        <FormField
          title="密码"
          placeholder="长度至少为8"
          register={register("password")}
        />
      </form>
      <button className="font-medium text-home-form-title ml-auto my-[10px]">
        忘记密码？
      </button>
      <FormButton>登陆</FormButton>
      <div className="ml-auto text-home-form-title mt-[10px] mb-[20px]">
        <span className="font-medium">尚未注册？</span>
        <button
          className="text-text-link underline"
          onClick={() => setDisplay({ login: false, signup: true })}
        >
          创建
        </button>
      </div>
    </FormContainer>
  );
}

export function SignUp({
  className,
  setDisplay,
}: {
  className?: string;
  setDisplay: StateDispatch<DisplayState>;
}) {
  const { handleSubmit, register } = useForm<SignUpValues>();
  const onSubmit: SubmitHandler<SignUpValues> = (data) => console.log(data);
  return (
    <FormContainer className={className}>
      <h1 className="mt-[20px] font-semibold text-home-form-text/80 text-2xl mb-[23px]">
        注册
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="邮箱"
          placeholder="example@gmail.com"
          register={register("email")}
        />
      </form>
      <FormButton className="mt-[20px]">注册</FormButton>
      <div className="ml-auto text-home-form-title mt-[10px] mb-[20px]">
        <span className="font-medium">已有账户？</span>
        <button
          className="text-text-link underline"
          onClick={() => setDisplay({ login: true, signup: false })}
        >
          登陆
        </button>
      </div>
    </FormContainer>
  );
}
