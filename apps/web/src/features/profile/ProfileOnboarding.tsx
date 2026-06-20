import React, { useState, useEffect } from 'react';
import type { CarbonProfile } from '@carboncoach/shared';
import { defaultProfile } from './profileDefaults';
import type { ProfileErrors } from './profileValidation';
import { validateProfile } from './profileValidation';
import { ProfileSuccessView } from './ProfileSuccessView';
import { ProfileForm } from './ProfileForm';

interface ProfileOnboardingProps {
  savedProfile: CarbonProfile | null;
  onSaveProfile: (profile: CarbonProfile) => void;
  onNavigateToFootprint?: () => void;
  onNavigateToPrivacy?: () => void;
}

export const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({
  savedProfile,
  onSaveProfile,
  onNavigateToFootprint,
  onNavigateToPrivacy,
}) => {
  const [formData, setFormData] = useState<Partial<CarbonProfile>>(
    () => savedProfile || { ...defaultProfile },
  );
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedProfile);

  // Sync state if savedProfile changes
  useEffect(() => {
    if (savedProfile) {
      setFormData(savedProfile);
      setIsSubmitted(true);
    } else {
      setFormData({ ...defaultProfile });
      setIsSubmitted(false);
    }
    setErrors({});
  }, [savedProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for field on change
    if (errors[name as keyof ProfileErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfile(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus the first error element if possible
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    onSaveProfile(formData as CarbonProfile);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ ...defaultProfile });
    setErrors({});
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted && savedProfile) {
    return (
      <ProfileSuccessView
        savedProfile={savedProfile}
        onEdit={handleEdit}
        onNavigateToFootprint={onNavigateToFootprint}
        onNavigateToPrivacy={onNavigateToPrivacy}
      />
    );
  }

  return (
    <ProfileForm
      formData={formData}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      savedProfile={savedProfile}
      onNavigateToPrivacy={onNavigateToPrivacy}
    />
  );
};
