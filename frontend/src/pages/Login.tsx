import { loginUser, type LoginUserProps } from "@/api/auth.api"
import OrangePanel from "@/components/auth/OrangePanel"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useAuthStore } from "@/store/auth.store"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const Login = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<LoginUserProps>();
	const navigate = useNavigate();
	const { setUser } = useAuthStore();

	const onSubmit = async (data: LoginUserProps) => {
		try {
			const response = await loginUser(data);
			setUser(response.data.data.user);
			navigate("/dashboard");

		} catch (error) {
			console.log(error);
		}
	}


	return (
		<div>

			<main className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-4">
				<div className="min-h-5xl lg:h-[60vh] lg:w-[70vw] md:grid md:grid-cols-2 bg-white rounded-3xl shadow-md overflow-hidden">

					<section className="flex flex-col justify-center p-8">
						<div>
							<h1 className="text-2xl md:text-4xl font-bold">Sign In</h1>

							<p className="text-lg md:text-2xl mt-2 text-gray-500">
								Welcome back! Please login to continue.
							</p>

						</div>
						<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
							<Input
								label="Email"
								type="email"
								placeholder="Enter your email"
								error={errors.email?.message?.toString()}
								{...register("email", { required: "Email is required" })}
							/>

							<Input
								label="Password"
								type="password"
								placeholder="Enter your password"
								error={errors.password?.message?.toString()}
								{...register("password", { required: "Password is required" })}
							/>

							<Button>
								Sign In
							</Button>
						</form>
					</section>
					<OrangePanel title="Welcome to TaskFlow!" subtitle="Create an account and start managing your projects with your team." navigateTo="/register" buttonText="Create Account" />
				</div>
			</main>
		</div>
	)
}

export default Login
