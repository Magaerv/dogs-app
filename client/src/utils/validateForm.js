const validateName = name => {
	const namePattern = /^(?=.*[a-zA-ZñÑ])[\wñÑ\s]{3,}$/;
	if (name && !name.match(namePattern)) {
		return 'Name must contain only letters, and be at least 3 characters long';
	}
	return null;
};

const validateTextField = value => {
	const textPattern = /^[a-zA-Z\s]+$/;
	if (value && !value.match(textPattern)) {
		return 'Field must contain only letters and spaces';
	}
	return null;
};

const validateHeight = (heightMin, heightMax) => {
	const min = parseInt(heightMin);
	const max = parseInt(heightMax);
	if (isNaN(min) || isNaN(max) || min < 1 || max > 300 || min >= max) {
		return 'Height must be a number between 1 and 300 cm, with the minimum value being less than the maximum value';
	}
	return null;
};

const validateWeight = (weightMin, weightMax) => {
	const min = parseInt(weightMin);
	const max = parseInt(weightMax);
	if (isNaN(min) || isNaN(max) || min < 1 || max > 200 || min >= max) {
		return 'Weight must be a number between 1 and 200 kg, with the minimum value being less than the maximum value';
	}
	return null;
};

const validateImages = images => {
	if (images?.length < 1) {
		return 'You must upload at least 1 image';
	}
	if (images?.length > 3) {
		return 'You can only upload 3 images per dog';
	}
	return null;
};

const validateLifeSpan = lifeSpan => {
	if (!lifeSpan) return null;
	const lifeSpanPattern = /^(\d{1,2})\s*-\s*(\d{1,2})\s*(year|years)$/;
	const match = lifeSpan.match(lifeSpanPattern);
	if (!match) {
		return 'Life span must be in the format "min - max years"';
	}
	const minLifeSpan = parseInt(match[1]);
	const maxLifeSpan = parseInt(match[2]);
	if (minLifeSpan > maxLifeSpan) {
		return 'Minimum life span cannot be greater than maximum life span';
	}
	return null;
};

const validateTemperaments = temperaments => {
	if (!Array.isArray(temperaments) || temperaments.length < 1) {
		return 'You must select at least one temperament';
	}
	return null;
};

export const validateForm = (formData, selectedTemperaments) => {
	const errors = {};

	const nameError = validateName(formData.name);
	if (nameError) {
		errors.name = nameError;
	}

	const textFields = ['bred_for', 'breed_group', 'origin'];
	textFields.forEach(field => {
		const error = validateTextField(formData[field]);
		if (error) {
			errors[field] = error;
		}
	});

	const heightError = validateHeight(formData.heightMin, formData.heightMax);
	if (heightError) errors.height = heightError;

	const weightError = validateWeight(formData.weightMin, formData.weightMax);
	if (weightError) errors.weight = weightError;

	const imageError = validateImages(formData.image);
	if (imageError) errors.image = imageError;

	const lifeSpanError = validateLifeSpan(formData.life_span);
	if (lifeSpanError) errors.life_span = lifeSpanError;

	const temperamentError = validateTemperaments(selectedTemperaments);
	if (temperamentError) {
		errors.temperaments = temperamentError;
	}

	if (!formData.image || formData.image.length < 1) {
		errors.image = 'You must upload at least one image';
	}

	const bredError = validateTextField(formData.bred_for);
	if (bredError) errors.bred_for = bredError;

	const breedGroupError = validateTextField(formData.breed_group);
	if (breedGroupError) errors.breed_group = breedGroupError;

	return errors;
};
