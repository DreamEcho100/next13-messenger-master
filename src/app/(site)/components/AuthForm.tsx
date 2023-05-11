'use client';

import { useMutation } from '@tanstack/react-query';
// import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '~/app/components/Input';
import AuthSocialButton from './AuthSocialButton';
import Button from '~/app/components/Button';
import { toast } from 'react-hot-toast';

type Variant = 'LOGIN' | 'REGISTER';

type SocialAction = 'github' | 'google';

const AuthForm = () => {
	const session = useSession();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const submitQuery = useMutation<
		| {
				socialAction: SocialAction;
				result: unknown;
		  }
		| {
				variant: Variant;
				input: FieldValues;
				result: unknown;
		  },
		{ message: string },
		{ fieldValues: FieldValues } | { socialAction: SocialAction }
	>(
		async (input) => {
			if ('socialAction' in input) {
				return {
					socialAction: input.socialAction,
					result: await signIn(input.socialAction, { redirect: false })
				};
			}

			if (variant === 'LOGIN')
				return {
					variant,
					input,
					result: await signIn('credentials', {
						...input,
						redirect: false
					})
				};

			return {
				variant,
				input,
				result: await fetch('/api/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(input)
				})
			};
		},
		{
			onError: (err) => toast.error(err.message),
			onSuccess: async (result) => {
				if ('variant' in result && result.variant === 'REGISTER') {
					await signIn('credentials', {
						...result.input,
						redirect: false
					});
				}
				router.push('/conversations');
			}
		}
	);

	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push('/conversations');
		}
	}, [session?.status, router]);

	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER');
		} else {
			setVariant('LOGIN');
		}
	}, [variant]);

	const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
		submitQuery.mutate({ fieldValues: data });
	};

	return (
		<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
			<div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					{variant === 'REGISTER' && (
						<Input
							disabled={submitQuery.isLoading}
							register={register}
							errors={errors}
							required
							id='name'
							label='Name'
						/>
					)}
					<Input
						disabled={submitQuery.isLoading}
						register={register}
						errors={errors}
						required
						id='email'
						label='Email address'
						type='email'
					/>
					<Input
						disabled={submitQuery.isLoading}
						register={register}
						errors={errors}
						required
						id='password'
						label='Password'
						type='password'
					/>
					<div>
						<Button
							disabled={submitQuery.isLoading}
							classVariants={{ w: 'full', disabled: submitQuery.isLoading }}
							type='submit'
						>
							{variant === 'LOGIN' ? 'Sign in' : 'Register'}
						</Button>
					</div>
				</form>

				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center '>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 text-gray-500 bg-white'>
								Or continue with
							</span>
						</div>
					</div>

					<div className='flex gap-2 mt-6'>
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => submitQuery.mutate({ socialAction: 'github' })}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => submitQuery.mutate({ socialAction: 'google' })}
						/>
					</div>
				</div>
				<div className='flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500 '>
					<div>
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					<div onClick={toggleVariant} className='underline cursor-pointer'>
						{variant === 'LOGIN' ? 'Create an account' : 'Login'}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
