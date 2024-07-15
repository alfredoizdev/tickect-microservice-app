"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import useSignup from "@/hooks/useSignup";

type Inputs = {
  email: string;
  password: string;
  username: string;
};

const Signup = () => {
  const { onSubmit } = useSignup();
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="row">
      <div className="col-md-6 w-100 vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-sm p-3"
          style={{ border: "none", minWidth: "350px" }}
        >
          <div className="card-body">
            <h2 className="card-title text-uppercase fw-bold">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group mb-3">
                <label>Username</label>
                <input
                  {...register("username", {
                    required: "Username is required",
                    maxLength: {
                      value: 15,
                      message: "Username should not exceed 15 characters",
                    },
                    minLength: {
                      value: 3,
                      message: "Username should have at least 3 characters",
                    },
                  })}
                  type="text"
                  className="form-control"
                />
                {errors.username && (
                  <p className="text-danger">{errors.username?.message}</p>
                )}
              </div>
              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  {...register("email", {
                    required: "Email Address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="form-control"
                />
                {errors.email && (
                  <p className="text-danger">{errors.email?.message}</p>
                )}
              </div>
              <div className="form-group mb-3">
                <label>Password</label>
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className="form-control"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password?.message}</p>
                )}
              </div>
              <button className="btn btn-primary">Sign Up</button>
              <div className="text-center m-4">
                <Link className="btn btn-link text-muted" href="/auth/signin">
                  Has account Already? Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
