type AtmosphereBackgroundProps = {
	className?: string;
};

export function AtmosphereBackground({
	className = "",
}: AtmosphereBackgroundProps) {
	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
			<div className="absolute left-[-10%] top-[-20%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,hsl(173_80%_55%/0.34),transparent_62%)] blur-3xl" />
			<div className="absolute bottom-[-15%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,hsl(36_95%_60%/0.26),transparent_60%)] blur-3xl" />
			<div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,hsl(214_90%_60%/0.18),transparent_65%)]" />
		</div>
	);
}
