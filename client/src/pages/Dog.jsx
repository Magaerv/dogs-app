import { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MdLocationOn } from 'react-icons/md';

export const Dog = () => {
	const [dog, setDog] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [copied, setCopied] = useState(false);

	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchDog = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/dog/get/${params.id}`);
				const data = await res.json();
				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}
				setDog(data);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};
		fetchDog();
	}, [params.id]);

	useEffect(() => {
		const nextButton = document.querySelector('.swiper-button-next');
		const prevButton = document.querySelector('.swiper-button-prev');

		if (nextButton) {
			nextButton.style.color = 'rgb(51 65 85)';
			nextButton.style.fontSize = '20px';
		}

		if (prevButton) {
			prevButton.style.color = 'rgb(51 65 85)';
			prevButton.style.fontSize = '20px';
		}
	}, [dog]);

	const userId = useSelector(state => state.user.currentUser?._id);

	const goBack = () => {
		navigate(-1);
	};

	return (
		<main>
			{loading && (
				<p className='text-center my-7 text-3xl text-slate-600'>Loading...</p>
			)}
			{error && (
				<p className='text-center my-7 text-2xl text-red-600'>
					Something went wrong.
				</p>
			)}
			{dog && !loading && !error && (
				<div className='my-auto'>
					<div className='min-h-screen flex items-center justify-center mt-7'>
						<div className='bg-slate-300 w-full max-w-2xl p-4'>
							<div className='flex justify-center items-center'>
								{userId && userId === dog.userRef && (
									<Link
										to={`/update-dog/${params.id}`}
										className='text-sm bg-green-700 text-white text-center px-2 py-1 gap-3 rounded-md uppercase'
									>
										Update
									</Link>
								)}
								<Link
									to={'/'}
									className='text-sm bg-slate-500 text-white text-center px-2 py-1 gap-3 mx-1 rounded-md uppercase'
								>
									Home
								</Link>
								{userId && (
									<Link
										to={'/profile'}
										className='text-sm bg-slate-500 text-white text-center px-2 py-1 gap-3 mx-1 rounded-md uppercase'
									>
										My Account
									</Link>
								)}
								<button
									onClick={goBack}
									className='text-sm bg-slate-500 text-white text-center px-2 py-1 gap-3 mx-1 rounded-md uppercase'
								>
									Go Back
								</button>
							</div>
							<div className='flex  flex-col justify-center items-center mb-6 '>
								<img
									className='rounded-full size-1/4 mt-10'
									src={dog?.fromDb ? dog?.image[0] : dog?.image.url}
									alt={dog.name}
								/>
								<p className='text-3xl text-slate-800 font-semibold uppercase mt-7'>
									{dog.name}
								</p>
							</div>
							<div className='flex gap-2 mb-4 p-3'>
								{dog.origin && (
									<>
										<MdLocationOn className='text-green-700 text-2xl' />
										<span className='text-slate-800 font-semibold text-lg'>
											{dog.origin}
										</span>
									</>
								)}
							</div>
							<div className='p-1 m-3 text-slate-800 gap-4 my-4'>
								{dog && (
									<p className='pb-2'>
										<span className='font-bold'>Height:</span>{' '}
										{dog.height.metric || dog.height} cm.
									</p>
								)}
								{dog && (
									<p className='pb-2'>
										<span className='font-bold'>Weight:</span>{' '}
										{dog.weight.metric || dog.weight} kg.
									</p>
								)}
								{dog.bred_for && (
									<p className='pb-2'>
										<span className='font-bold'>Bred for:</span> {dog.bred_for}
									</p>
								)}
								{dog.breed_group && (
									<p className='pb-2'>
										<span className='font-bold'>Breed group:</span>{' '}
										{dog.breed_group}
									</p>
								)}
								{dog.life_span && (
									<p className='pb-2'>
										<span className='font-bold'>Life Span:</span>{' '}
										{dog.life_span}
									</p>
								)}
								{dog.fromDb ? (
									<p className='pb-2'>
										<span className='font-bold'>Temperaments:</span>{' '}
										{dog.temperament.join(', ')}
									</p>
								) : (
									<p className='pb-2'>
										<span className='font-bold'>Temperaments:</span>{' '}
										{dog.temperament}
									</p>
								)}
								{dog.origin && (
									<p className='pb-2'>
										<span className='font-bold'>Country of origin:</span>{' '}
										{dog.origin}
									</p>
								)}
								{dog.description && (
									<p className='pb-2'>
										<span className='font-bold'>Description:</span>{' '}
										{dog.description}
									</p>
								)}
							</div>
						</div>
					</div>
					<Swiper
						className='mt-5'
						modules={[Navigation]}
						navigation
						spaceBetween={0}
						slidesPerView={1}
					>
						{dog?.fromDb ? (
							dog.image.map(url => (
								<SwiperSlide key={url}>
									<div
										className='h-[900px]'
										style={{
											background: `url("${url}") center no-repeat`,
											backgroundSize: 'cover',
											boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
										}}
									></div>
								</SwiperSlide>
							))
						) : (
							<SwiperSlide>
								<div
									className='h-[900px]'
									style={{
										background: `url("${dog.image.url}") center no-repeat`,
										backgroundSize: 'cover',
										boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
									}}
								></div>
							</SwiperSlide>
						)}
					</Swiper>
					<div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-11 h-11 flex justify-center items-center bg-slate-300 cursor-pointer'>
						<FaShare
							className='text-slate-600'
							onClick={() => {
								navigator.clipboard.writeText(window.location.href);
								setCopied(true);
								setTimeout(() => {
									setCopied(false);
								}, 2000);
							}}
						/>
					</div>
					{copied && (
						<p className='fixed top-[23%] right-[5%] z-10 rounded-md p-2 text-slate-700 bg-slate-400'>
							Link copied!
						</p>
					)}
				</div>
			)}
		</main>
	);
};
