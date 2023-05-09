import { VariantProps, cva, cx } from 'class-variance-authority';

interface ButtonProps {
	type?: 'button' | 'submit' | 'reset' | undefined;
	children?: React.ReactNode;
	onClick?: () => void;
	// secondary?: boolean;
	disabled?: boolean;
	classVariants?: VariantProps<typeof handleClassVariants>;
}

const handleClassVariants = cva(
	`
flex 
justify-center 
rounded-md 
px-3 
py-2 
text-sm 
font-semibold 
focus-visible:outline 
focus-visible:outline-2 
focus-visible:outline-offset-2 
`,
	{
		variants: {
			disabled: { true: 'opacity-50 cursor-default' },
			w: { full: 'w-full' },
			theme: {
				danger: 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
				default:
					'text-white bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600',
				secondary: 'text-gray-900'
			}
		},
		defaultVariants: {
			theme: 'default'
		}
	}
);

const Button: React.FC<ButtonProps> = ({
	type = 'button',
	children,
	onClick,
	disabled,
	classVariants
}) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={handleClassVariants(classVariants)}
		>
			{children}
		</button>
	);
};

export default Button;
