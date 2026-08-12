import { registerUser, type RegisterUserProps } from "@/api/auth.api"
import OrangePanel from "@/modules/auth/components/OrangePanel"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const Register = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterUserProps>();
	const navigate = useNavigate();

	const onSubmit = async (data: RegisterUserProps) => {
		try {
			const response = await registerUser(data);
			console.log(response.data);
			navigate("/login");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<main className="min-h-screen bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center p-4">
				<div className="min-h-5xl lg:h-[60vh] lg:w-[70vw] md:grid md:grid-cols-2 bg-white rounded-3xl shadow-md overflow-hidden">
					<OrangePanel title="Welcome Back!" subtitle="Already have an account? Login and continue managing your projects." navigateTo="/login" buttonText="Sign In" />
					<section className="flex flex-col justify-center p-8">
						<h1 className="text-4xl font-bold">
							Create Account
						</h1>

						<p className="text-lg md:text-2xl mt-2 text-gray-500">
							Join TaskFlow today.
						</p>

						<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
							<Input
								label="Name"
								placeholder="Enter your name"
								error={errors.name?.message?.toString()}
								{...register("name", { required: "Name is required" })}
							/>

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
								placeholder="Create password"
								error={errors.password?.message?.toString()}
								{...register("password", { required: "Password is required" })}

							/>
							<Button type="submit">
								Register
							</Button>
						</form>
					</section>
				</div>
			</main>

		</div>
	)
}

export default Register
