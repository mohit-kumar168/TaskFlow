import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

interface OrangePaneProps {
	title: string;
	subtitle: string;
	navigateTo: string;
	buttonText: string;
}

const OrangePanel = ({ title, subtitle, navigateTo, buttonText }: OrangePaneProps) => {
	const navigate = useNavigate();
	return (
		<>
			<section className="hidden bg-orange-500 text-white md:flex flex-col items-center justify-center gap-4">
				<h2 className="text-4xl font-bold">
					{title}
				</h2>

				<p className="w-[30vw] text-center">
					{subtitle}
				</p>

				<Button
					variant="outline"
					onClick={() => navigate(navigateTo)}
					className="md:w-50"
				>
					{buttonText}
				</Button>
			</section>

		</>
	)
}

export default OrangePanel
