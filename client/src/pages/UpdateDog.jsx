import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
	deleteObject,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { app } from '../firebase';
import { validateForm } from '../utils/validateForm';

export const UpdateDog = () => {
	const { currentUser } = useSelector(state => state.user);

	const params = useParams();

	const [files, setFiles] = useState([]);
	const [temperaments, setTemperaments] = useState([]);
	const [selectedTemperaments, setSelectedTemperaments] = useState([]);
	const [formData, setFormData] = useState({
		name: '',
		image: [],
		heightMin: '',
		heightMax: '',
		weightMin: '',
		weightMax: '',
		bred_for: '',
		breed_group: '',
		life_span: '',
		origin: '',
		description: '',
	});
	const [imageError, setImageError] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});

	useEffect(() => {
		const fetchDog = async () => {
			try {
				setLoading(true);

				const res = await fetch(`/api/dog/get/${params.dogId}`);
				const data = await res.json();
				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				} else {
					const [heightMin, heightMax] = data.height.metric
						.split(' - ')
						.map(h => h.replace(' cm', ''));
					const [weightMin, weightMax] = data.weight.metric
						.split(' - ')
						.map(w => w.replace(' kg', ''));

					setFormData({
						name: data.name,
						image: data.image,
						heightMin,
						heightMax,
						weightMin,
						weightMax,
						bred_for: data.bred_for,
						breed_group: data.breed_group,
						life_span: data.life_span,
						origin: data.origin,
						description: data.description,
						temperament: data.temperament,
					});
				}
				setSelectedTemperaments(data.temperament || []);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};
		fetchDog();
	}, [params.dogId]);

	useEffect(() => {
		const getTemperaments = async () => {
			const tempData = await fetch('/api/temperament/all');
			const data = await tempData.json();
			setTemperaments(data);
		};
		getTemperaments();
	}, []);

	const handleImageSubmit = () => {
		if (files.length > 0 && files.length + formData.image.length < 4) {
			setUploading(true);
			setImageError(false);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}

			Promise.all(promises)
				.then(urls => {
					setFormData(prevFormData => ({
						...prevFormData,
						image: [...prevFormData.image, ...urls],
					}));
					setImageError(false);
					setUploading(false);
				})
				.catch(error => {
					setImageError('Image upload failed');
					throw new Error({ error: error.message });
				});
		} else {
			setImageError('You can only upload 3 images per dog');
			setUploading(false);
		}
	};

	const storeImage = async file => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${Math.round(progress)}% done.`);
				},
				error => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const deleteImage = async url => {
		const storage = getStorage(app);
		const imageRef = ref(
			storage,
			decodeURIComponent(url).split('/o/')[1].split('?')[0]
		);

		try {
			await deleteObject(imageRef);
			setFormData(prevFormData => ({
				...prevFormData,
				image: prevFormData.image.filter(imageUrl => imageUrl !== url),
			}));
		} catch (error) {
			setImageError('Failed to delete image');
			console.error(error);
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		const errors = validateForm(formData, selectedTemperaments);

		setValidationErrors(errors);
	};

	const handleTemperamentChange = e => {
		const { options } = e.target;
		const selected = [];
		for (const option of options) {
			if (option.selected) {
				selected.push(option.value);
			}
		}
		setSelectedTemperaments(selected);
		const errors = validateForm(formData, selected);
		setValidationErrors(prevErrors => ({
			...prevErrors,
			temperaments: errors.temperaments,
		}));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const errors = validateForm(formData, selectedTemperaments);
		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}
		try {
			if (formData.image.length < 1)
				return setError('You must upload at least 1 image');
			setUpdateSuccess(false);

			const formattedHeight = `${formData.heightMin} - ${formData.heightMax}`;
			const formattedWeight = `${formData.weightMin} - ${formData.weightMax}`;

			const hw = {
				height: { metric: formattedHeight },
				weight: { metric: formattedWeight },
			};

			const dogData = {
				...formData,
				...hw,
				temperament:
					selectedTemperaments.length > 0
						? selectedTemperaments
						: formData.temperament,
			};

			setLoading(true);
			setError(false);
			const res = await fetch(`/api/dog/update/${params.dogId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...dogData,
					userRef: currentUser._id,
				}),
			});
			const data = await res.json();

			if (data.success === false) {
				setError(data.message);
			} else {
				setUpdateSuccess(true);
			}
			setUpdateSuccess(true);
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	return (
		<main className='p-3 max-w-4xl mx-auto my-auto'>
			<h1 className='text-3xl font-semibold text-center my-9'>
				Update your dog info
			</h1>
			<form
				onSubmit={handleSubmit}
				className='grid grid-cols-1 sm:grid-cols-2 gap-4'
			>
				<div className='flex flex-col gap-2'>
					<label htmlFor='name' className='font-semibold text-slate-600'>
						Name: <span className='font-normal text-slate-500'></span>
					</label>
					<input
						type='text'
						placeholder='e.g.: American Dogui'
						className='border p-3 mb-4 rounded-lg'
						name='name'
						minLength='3'
						required
						onChange={handleChange}
						value={formData?.name}
					/>
					{validationErrors.name && (
						<p className='text-red-500'>{validationErrors.name}</p>
					)}
					<label htmlFor='heightMin' className='font-semibold text-slate-600'>
						Min Height (cm):
					</label>
					<input
						type='number'
						placeholder='e.g.: 50'
						className='border p-3 mb-4 rounded-lg'
						name='heightMin'
						onChange={handleChange}
						value={formData?.heightMin}
					/>
					<label htmlFor='heightMax' className='font-semibold text-slate-600'>
						Max Height (cm):
					</label>
					<input
						type='number'
						placeholder='e.g.: 100'
						className='border p-3 mb-4 rounded-lg'
						name='heightMax'
						onChange={handleChange}
						value={formData?.heightMax}
					/>
					{validationErrors.height && (
						<p className='text-red-500'>{validationErrors.height}</p>
					)}
					<label htmlFor='weightMin' className='font-semibold text-slate-600'>
						Min Weight (kg):
					</label>
					<input
						type='number'
						placeholder='e.g.: 5'
						className='border p-3 mb-4 rounded-lg'
						name='weightMin'
						onChange={handleChange}
						value={formData?.weightMin}
					/>
					<label htmlFor='weightMax' className='font-semibold text-slate-600'>
						Max Weight (kg):
					</label>
					<input
						type='number'
						placeholder='e.g.: 20'
						className='border p-3 mb-4 rounded-lg'
						name='weightMax'
						onChange={handleChange}
						value={formData?.weightMax}
					/>
					{validationErrors.weight && (
						<p className='text-red-500'>{validationErrors.weight}</p>
					)}
					<label htmlFor='bred_for' className='font-semibold text-slate-600'>
						Bred for: <span className='font-normal text-slate-500'></span>
					</label>
					<input
						type='text'
						placeholder='e.g.: Family companion dog'
						className='border p-3 mb-4 rounded-lg'
						name='bred_for'
						onChange={handleChange}
						value={formData?.bred_for}
					/>
					{validationErrors.bred_for && (
						<p className='text-red-500'>{validationErrors.bred_for}</p>
					)}
					<label htmlFor='breed_group' className='font-semibold text-slate-600'>
						Breed group: <span className='font-normal text-slate-500'></span>
					</label>
					<input
						type='text'
						placeholder='e.g.: Herding'
						className='border p-3 mb-4 rounded-lg'
						name='breed_group'
						onChange={handleChange}
						value={formData?.breed_group}
					/>
					{validationErrors.breed_group && (
						<p className='text-red-500'>{validationErrors.breed_group}</p>
					)}
					<label htmlFor='life_span' className='font-semibold text-slate-600'>
						Life span (yr/yrs):{' '}
						<span className='font-normal text-slate-500'>
							(e.g.: Enter average life span or range (min-max))
						</span>
					</label>
					<input
						type='text'
						placeholder='e.g.: 5 - 12 years'
						className='border p-3 mb-4 rounded-lg'
						name='life_span'
						maxLength='62'
						onChange={handleChange}
						value={formData?.life_span}
					/>
					{validationErrors.life_span && (
						<p className='text-red-500'>{validationErrors.life_span}</p>
					)}
					<label htmlFor='origin' className='font-semibold text-slate-600'>
						Country of origin:{' '}
						<span className='font-normal text-slate-500'></span>
					</label>
					<input
						type='text'
						placeholder='e.g.: Spain and Portugal'
						className='border p-3 mb-4 rounded-lg'
						name='origin'
						onChange={handleChange}
						value={formData?.origin}
					/>
					{validationErrors.origin && (
						<p className='text-red-500'>{validationErrors.origin}</p>
					)}
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='description' className='font-semibold text-slate-600'>
						Description: <span className='font-normal text-slate-500 '></span>
					</label>
					<textarea
						type='text'
						placeholder='e.g.: The dewclaws are never removed and the feet are cat-like.'
						className='border p-3 mb-4 rounded-lg'
						name='description'
						onChange={handleChange}
						value={formData?.description}
					/>
					<label htmlFor='temperament' className='font-semibold text-slate-600'>
						Select 1 or more temperaments:{' '}
						<span className='font-normal text-slate-500'>
							(CTRL + click to select more than one option)
						</span>
					</label>
					<select
						multiple
						className='text-slate-600 mb-4'
						onChange={handleTemperamentChange}
					>
						{temperaments?.map(temp => (
							<option key={temp.name} value={temp.name}>
								{temp.name}
							</option>
						))}
					</select>
					{formData?.temperament ? (
						<p className='font-semibold text-slate-600 '>
							{formData?.temperament ? 'Temperaments:' : ''}{' '}
							<span className='font-normal text-slate-500'>
								{formData?.temperament.join(', ')}
							</span>
						</p>
					) : (
						''
					)}
					{selectedTemperaments.length > 0 ? (
						<p className='font-semibold text-green-700 '>
							{selectedTemperaments?.length > 0
								? 'Temperaments Replaced: '
								: ''}{' '}
							<span className='font-normal text-green-600'>
								{selectedTemperaments?.join(', ')}
							</span>
						</p>
					) : (
						''
					)}
					<div className='flex flex-col gap-3 flex-1 md:mt-0'>
						<label htmlFor='images' className='font-semibold text-slate-600'>
							Upload 1 o more images:{' '}
							<span className='font-normal text-slate-500'>
								The first image will be the cover (max 3)
							</span>
						</label>
						<div className='flex'>
							<input
								onChange={e => setFiles(e.target.files)}
								className='p-2 text-slate-500 rounded w-full'
								type='file'
								id='images'
								accept='image/*'
								multiple
							/>
							<button
								type='button'
								onClick={handleImageSubmit}
								className='text-slate-600 border border-slate-600 px-2 my-1 rounded-md uppercase hover:shadow-lg hover:text-slate-800 disabled:opacity-80'
							>
								{uploading ? 'Uploading...' : 'Upload'}
							</button>
						</div>
						<p className='text-red-500 text-sm'>{imageError && imageError}</p>
						{validationErrors.image && (
							<p className='text-red-500'>{validationErrors.image}</p>
						)}
						{formData?.image.length > 0 &&
							formData?.image?.map(url => {
								return (
									<div
										key={url}
										className='flex justify-between p-1 border items-center'
									>
										<img
											src={url}
											alt='dog image'
											className='w-20 h-20 object-cover rounded-lg'
										/>
										<button
											onClick={() => {
												deleteImage(url);
											}}
											className='text-red-500 p-1 rounded-lg uppercase hover:opacity-80'
										>
											Delete
										</button>
									</div>
								);
							})}
					</div>
				</div>
				<button
					disabled={loading || uploading}
					className='col-span-2 bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'
				>
					{loading ? 'Loading...' : 'Update Dog'}
				</button>
				{error && (
					<p className='col-span-2 mt-3 text-red-500 text-sm flex justify-center'>
						{error}
					</p>
				)}
				<p className='col-span-2 text-green-800 mt-5 flex justify-center '>
					{updateSuccess ? 'Dog updated successfully!' : ''}
				</p>
				<ul className='col-span-2 flex justify-center gap-4'>
					<li className='bg-slate-500 text-white rounded-lg p-2 hover:opacity-95'>
						<Link to={'/profile'}>Go to Profile</Link>
					</li>
					<li className='bg-slate-500 text-white rounded-lg p-2 hover:opacity-95'>
						<Link to={`/dog/${params.dogId}`}>View Details</Link>
					</li>
				</ul>
			</form>
		</main>
	);
};
