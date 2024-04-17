"use client";

import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { StateDispatch } from "@/lib/utils";
import { z, ZodError } from "zod";
import { Icons } from "./icons";
import { login, signup } from "@/lib/actions";

const LOGIN_ERR = "login-error";
const SIGNUP_ERR = "signup-error";
const VERIFICATION_ERR = "verification-error";

const LOGIN_FORM = "login-form";
const SIGNUP_FORM = "signup-form";
const VERIFICATION_FORM = "verification-form";

export type SignUpValues = {
  email: string;
  password: string;
};
export type VerificationValues = {
  email: string;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type DisplayState = {
  login: boolean;
  signup: boolean;
};

function FormField<T extends string = string>({
  title,
  placeholder,
  register,
  errorMsg,
}: {
  title?: string;
  placeholder?: string;
  register: UseFormRegisterReturn<T>;
  errorMsg?: string;
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
      {errorMsg && (
        <div className="flex gap-[3px] ">
          <Icons.Error id="login-form-error" />
          <p className="text-error-message">{errorMsg}</p>
        </div>
      )}
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

function FormButton(props: React.ComponentPropsWithoutRef<"button">) {
  const { className, children, ...rest } = props;
  return (
    <Button
      className={cn(className, "border-0 text-lg text-home-form-title")}
      variant="pinkInner"
      {...rest}
    >
      {children}
    </Button>
  );
}

function attachErr(text: string, errId: string, formId: string) {
  const err = document.getElementById(errId)!;
  err.style.display = "block";
  err.innerText = text;
  if (text == "请先对邮箱进行验证") {
    err.style.width = "fit-content";
    err.style.padding = "12px 30px";
    err.style.backgroundColor = "rgba(255, 255,255,0.6)";
    err.style.borderRadius = "16px";

    err.addEventListener("click", function (event) {}, { once: true });
  }
  document.getElementById(formId)!.addEventListener(
    "input",
    function (event) {
      event.stopPropagation();
      err.innerText = "";
      err.style.display = "none";
    },
    { once: true }
  );
}

export function Login({
  className,
  setDisplay,
}: {
  className?: string;
  setDisplay: StateDispatch<DisplayState>;
}) {
  const { handleSubmit, register, formState } = useForm<LoginValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginValues> = async (data: LoginValues) => {
    try {
      await login(data);
    } catch (e) {
      const ee = e as Error;
      ee.name = "";
      attachErr(ee.toString(), LOGIN_ERR, LOGIN_FORM);
    }
  };

  return (
    <FormContainer className={className}>
      <h1 className="mt-[20px] font-semibold text-home-form-text/80 text-2xl mb-[23px]">
        登陆
      </h1>
      <p
        id={LOGIN_ERR}
        className="mb-[10px] text-red-600 font-semibold text-lg hidden"
      />

      <form id={LOGIN_FORM} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="邮箱"
          placeholder="example@gmail.com"
          register={register("email", {
            required: { value: true, message: "请输入邮箱" },
            validate: (v) => {
              try {
                z.string()
                  .email({ message: "请输入格式正确的邮箱地址" })
                  .parse(v);
                return true;
              } catch (e) {
                const issues = (e as ZodError).issues;
                return issues[0].message;
              }
            },
          })}
          errorMsg={formState.errors.email?.message}
        />
        <FormField
          title="密码"
          placeholder="长度至少为8"
          register={register("password", {
            required: { value: true, message: "请输入密码" },
            validate: (v) => {
              try {
                z.string()
                  .min(8, { message: "密码长度必须大于等于8并且小于等于16" })
                  .max(16, { message: "密码长度必须大于等于8并且小于等于16" })
                  .parse(v);
                return true;
              } catch (e) {
                const issues = (e as ZodError).issues;
                return issues[0].message;
              }
            },
          })}
          errorMsg={formState.errors.password?.message}
        />
      </form>
      <button className="font-medium text-home-form-title ml-auto my-[10px]">
        忘记密码？
      </button>
      <FormButton type="submit" form={LOGIN_FORM}>
        登陆
      </FormButton>
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
  const { handleSubmit, register, formState } = useForm<SignUpValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpValues> = async (data: SignUpValues) => {
    try {
      await signup(data);
    } catch (e) {
      const ee = e as Error;
      ee.name = "";
      attachErr(ee.toString(), SIGNUP_ERR, SIGNUP_FORM);
    }
  };
  return (
    <FormContainer className={className}>
      <h1 className="mt-[20px] font-semibold text-home-form-text/80 text-2xl mb-[23px]">
        注册
      </h1>
      <p
        id={SIGNUP_ERR}
        className="mb-[10px] text-red-600 font-semibold text-lg hidden"
      />
      <form id={SIGNUP_FORM} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="邮箱"
          placeholder="example@gmail.com"
          register={register("email", {
            required: { value: true, message: "请输入邮箱" },
            validate: (v) => {
              try {
                z.string()
                  .email({ message: "请输入格式正确的邮箱地址" })
                  .parse(v);
                return true;
              } catch (e) {
                const issues = (e as ZodError).issues;
                return issues[0].message;
              }
            },
          })}
          errorMsg={formState.errors.email?.message}
        />
        <FormField
          title="密码"
          placeholder="长度至少为8"
          register={register("password", {
            required: { value: true, message: "请输入密码" },
            validate: (v) => {
              try {
                z.string()
                  .min(8, { message: "密码长度必须大于等于8并且小于等于16" })
                  .max(16, { message: "密码长度必须大于等于8并且小于等于16" })
                  .parse(v);
                return true;
              } catch (e) {
                const issues = (e as ZodError).issues;
                return issues[0].message;
              }
            },
          })}
          errorMsg={formState.errors.password?.message}
        />
      </form>
      <FormButton form={SIGNUP_FORM} className="mt-[20px]">
        注册
      </FormButton>
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

export function Verificatioin({
  className,
  setDisplay,
}: {
  className?: string;
  setDisplay: StateDispatch<DisplayState>;
}) {
  const { handleSubmit, register, formState } = useForm<VerificationValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<VerificationValues> = async (
    data: VerificationValues
  ) => {
    try {
    } catch (e) {
      const ee = e as Error;
      ee.name = "";
      attachErr(ee.toString(), SIGNUP_ERR, "signup-form");
    }
  };
  return (
    <FormContainer className={className}>
      <h1 className="mt-[20px] font-semibold text-home-form-text/80 text-2xl mb-[23px]">
        验证邮箱
      </h1>
      <p
        id={VERIFICATION_ERR}
        className="mb-[10px] text-red-600 font-semibold text-lg hidden"
      />
      <form id={VERIFICATION_FORM} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          title="邮箱"
          placeholder="example@gmail.com"
          register={register("email", {
            required: { value: true, message: "请输入邮箱" },
            validate: (v) => {
              try {
                z.string()
                  .email({ message: "请输入格式正确的邮箱地址" })
                  .parse(v);
                return true;
              } catch (e) {
                const issues = (e as ZodError).issues;
                return issues[0].message;
              }
            },
          })}
          errorMsg={formState.errors.email?.message}
        />
      </form>
      <FormButton form={VERIFICATION_FORM} className="mt-[20px]">
        发送链接
      </FormButton>
      <FormButton className="mt-[20px]">返回</FormButton>
    </FormContainer>
  );
}
