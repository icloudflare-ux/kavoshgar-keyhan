
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { Profile } from '../../types';
import { useTalehData } from '../../data/talehSaadNahsData';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import Spinner from './Spinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export const useProfiles = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: profiles = [], isLoading } = useQuery<Profile[]>({
        queryKey: ['profiles', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching profiles:', error.message);
                throw new Error(error.message);
            }
            return data.map(p => ({
                id: p.id,
                name: p.full_name,
                lastName: p.last_name,
                motherName: p.mother_name,
                birthDate: p.birth_date,
                birthTime: p.birth_hour,
                birthCity: p.birth_city,
                birthDayOfWeek: p.birth_day_of_week,
            }));
        },
        enabled: !!user,
    });

    // Real-time subscription for profile changes
    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel(`profiles-user-${user.id}`)
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'profiles', 
                    filter: `user_id=eq.${user.id}` 
                }, 
                (payload) => {
                    const mapDbToProfile = (p: any): Profile => ({
                        id: p.id,
                        name: p.full_name,
                        lastName: p.last_name,
                        motherName: p.mother_name,
                        birthDate: p.birth_date,
                        birthTime: p.birth_hour,
                        birthCity: p.birth_city,
                        birthDayOfWeek: p.birth_day_of_week,
                    });

                    queryClient.setQueryData(['profiles', user.id], (oldData: Profile[] | undefined) => {
                        const currentProfiles = oldData ?? [];
                        
                        if (payload.eventType === 'INSERT') {
                            const newProfile = mapDbToProfile(payload.new);
                            // Avoid duplicates
                            if (currentProfiles.some(p => p.id === newProfile.id)) {
                                return currentProfiles;
                            }
                            return [...currentProfiles, newProfile];
                        }
                        
                        if (payload.eventType === 'UPDATE') {
                            const updatedProfile = mapDbToProfile(payload.new);
                            return currentProfiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
                        }

                        if (payload.eventType === 'DELETE') {
                            return currentProfiles.filter(p => p.id !== payload.old.id);
                        }

                        return currentProfiles;
                    });
                }
            )
            .subscribe();

        // Cleanup function to remove the channel subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);


    const saveMutation = useMutation({
        mutationFn: async ({ profileData, id }: { profileData: Omit<Profile, 'id'>, id?: string }): Promise<Profile> => {
            if (!user) throw new Error("User not authenticated");
            
            const profileForDb: { [key: string]: any } = {
                user_id: user.id,
                full_name: profileData.name,
                last_name: profileData.lastName,
                mother_name: profileData.motherName,
                birth_date: profileData.birthDate,
                birth_hour: profileData.birthTime,
                birth_city: profileData.birthCity,
                birth_day_of_week: profileData.birthDayOfWeek,
            };

            if (id) { 
                const originalProfile = profiles.find(p => p.id === id);
                if (originalProfile) {
                    const sensitiveFieldsChanged = 
                        originalProfile.name !== profileData.name ||
                        originalProfile.motherName !== profileData.motherName ||
                        originalProfile.birthDate !== profileData.birthDate;

                    if (sensitiveFieldsChanged) {
                        profileForDb.ai_analysis_cache = {}; // Use empty object instead of null
                    }
                }
            } else {
                // For new profiles, provide a default empty object to satisfy not-null constraint.
                profileForDb.ai_analysis_cache = {};
            }

            const { data, error } = await supabase
                .from('profiles')
                .upsert({ ...profileForDb, id: id })
                .select()
                .single();

            if (error) {
                console.error('Supabase upsert error:', error);
                throw error;
            }

            return {
                id: data.id,
                name: data.full_name,
                lastName: data.last_name,
                motherName: data.mother_name,
                birthDate: data.birth_date,
                birthTime: data.birth_hour,
                birthCity: data.birth_city,
                birthDayOfWeek: data.birth_day_of_week,
            };
        },
        // onSuccess is now less critical for UI updates due to real-time,
        // but it's good for immediate optimistic feedback.
        onSuccess: (savedProfile) => {
            queryClient.setQueryData(['profiles', user?.id], (oldData: Profile[] | undefined) => {
                const profiles = oldData ?? [];
                const existingIndex = profiles.findIndex(p => p.id === savedProfile.id);

                if (existingIndex !== -1) {
                    const updatedProfiles = [...profiles];
                    updatedProfiles[existingIndex] = savedProfile;
                    return updatedProfiles;
                } else {
                    return [...profiles, savedProfile];
                }
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            return id; // Return deleted ID for optimistic update
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData(['profiles', user?.id], (oldData: Profile[] | undefined) => {
                if (!oldData) return [];
                return oldData.filter(profile => profile.id !== deletedId);
            });
        },
    });

    return { 
        profiles, 
        saveProfile: saveMutation.mutateAsync, 
        deleteProfile: async (id: string): Promise<void> => {
            await deleteMutation.mutateAsync(id);
        }, 
        isLoading,
        isSaving: saveMutation.isPending,
    };
};

interface ProfileManagerProps {
  onProfileChange: (profile: Profile | null) => void;
  profiles: Profile[];
  saveProfile: (args: { profileData: Omit<Profile, 'id'>, id?: string }) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ onProfileChange, profiles, saveProfile, deleteProfile, isLoading, isSaving }) => {
    const { dayOfBirthData } = useTalehData();
    const [selectedId, setSelectedId] = useState<string>('new');
    const [formData, setFormData] = useState<Omit<Profile, 'id'>>({
        name: '', lastName: '', motherName: '', birthDate: '', birthTime: '', birthCity: '', birthDayOfWeek: ''
    });
    const [formError, setFormError] = useState<string | null>(null);
    
    useEffect(() => {
        const selectedProfile = profiles.find(p => p.id === selectedId);
        if (selectedProfile) {
            setFormData(selectedProfile);
            onProfileChange(selectedProfile);
        } else {
            const newProfileData = { name: '', lastName: '', motherName: '', birthDate: '', birthTime: '', birthCity: '', birthDayOfWeek: '' };
            setFormData(newProfileData);
            onProfileChange(null);
        }
    }, [selectedId, profiles, onProfileChange]);

    useEffect(() => {
        if (profiles.length === 0 && selectedId !== 'new') {
            setSelectedId('new');
        }
    }, [profiles, selectedId]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.lastName || !formData.motherName) {
            setFormError('نام، نام خانوادگی و نام مادر الزامی است.');
            return;
        }
        setFormError(null);
        try {
            const savedProfile = await saveProfile({profileData: formData, id: selectedId !== 'new' ? selectedId : undefined});
            setSelectedId(savedProfile.id);
        } catch (error: any) {
            console.error("Failed to save profile:", error.message);
            const message = error.details || error.message || "خطا در ذخیره پروفایل. لطفاً اتصال خود را بررسی کنید.";
            setFormError(message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('آیا از حذف این پروفایل مطمئن هستید؟')) {
            try {
                await deleteProfile(id);
                if (selectedId === id) setSelectedId('new');
            } catch (error: any) {
                console.error("Failed to delete profile:", error.message);
                setFormError("خطا در حذف پروفایل. لطفاً اتصال خود را بررسی کنید.");
            }
        }
    };

    const isFormDirty = () => {
        if (selectedId === 'new') return Object.values(formData).some(val => val !== '');
        const selectedProfile = profiles.find(p => p.id === selectedId);
        if (!selectedProfile) return false;
        
        const comparableProfile = {
            name: selectedProfile.name, lastName: selectedProfile.lastName, motherName: selectedProfile.motherName,
            birthDate: selectedProfile.birthDate, birthTime: selectedProfile.birthTime,
            birthCity: selectedProfile.birthCity, birthDayOfWeek: selectedProfile.birthDayOfWeek || ''
        };
        return JSON.stringify(formData) !== JSON.stringify(comparableProfile);
    };

    const inputClasses = "w-full bg-slate-800/50 border border-slate-700/80 rounded-lg p-3 transition-all duration-300 focus:bg-slate-900/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none";

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Card className="!bg-slate-900/30 backdrop-blur-xl !border-purple-500/20 relative">
                {(isLoading || isSaving) && (
                    <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center z-10 rounded-2xl">
                        <Spinner />
                        <p className="mt-3 text-gray-300 font-tanha">{"در حال همگام‌سازی..."}</p>
                    </div>
                )}
                <h4 className="text-2xl font-lalezar text-center text-indigo-300 mb-4">{"مدیریت پروفایل"}</h4>
                <p className="font-tanha text-gray-400 text-center mb-6">{"اطلاعات خود را برای دسترسی سریع‌تر به محاسبات ذخیره کنید."}</p>
                <div className="space-y-4">
                    <div className="space-y-2 mb-6 border-b border-slate-700/50 pb-4 min-h-[100px]">
                        <label className="block text-lg font-tanha text-gray-300 mb-3">{"پروفایل‌های ذخیره شده:"}</label>
                        {profiles.map((p) => (
                            <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${selectedId === p.id ? 'bg-indigo-500/30 ring-2 ring-indigo-500/50' : 'bg-slate-800/50 hover:bg-slate-800/80'}`}>
                                <div onClick={() => setSelectedId(p.id)} className="flex-grow cursor-pointer">
                                    <span className="font-semibold text-white">{p.name} {p.lastName}</span>
                                    <span className="text-sm text-gray-400"> ({"فرزند"} {p.motherName})</span>
                                </div>
                                <button onClick={() => handleDelete(p.id)} aria-label={`حذف پروفایل ${p.name}`} className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                        <button onClick={() => setSelectedId('new')} className={`w-full p-3 rounded-lg text-center transition-colors duration-200 ${selectedId === 'new' ? 'bg-indigo-500/30 font-bold text-white ring-2 ring-indigo-500/50' : 'bg-slate-800/50 hover:bg-slate-800/80 text-gray-300'}`}>
                            + ایجاد پروفایل جدید
                        </button>
                    </div>

                    <h5 className="font-lalezar text-xl text-center text-indigo-300 pt-2">{selectedId === 'new' ? "فرم پروفایل جدید" : `ویرایش پروفایل ${formData.name} ${formData.lastName}`}</h5>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={"نام"} className={inputClasses} />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={"نام خانوادگی"} className={inputClasses} />
                    </div>
                     <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder={"نام مادر"} className={inputClasses} />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="birthDate" value={formData.birthDate} onChange={handleInputChange} placeholder={"تاریخ تولد (مثال: ۱۳۷۰/۰۵/۲۴)"} className={inputClasses} />
                        <select name="birthDayOfWeek" value={formData.birthDayOfWeek || ''} onChange={handleInputChange} className={inputClasses}>
                            <option value="">{"روز هفته تولد (اختیاری)"}</option>
                            {dayOfBirthData.map((day, index) => <option key={day.key} value={index}>{day.day}</option>)}
                        </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="birthTime" value={formData.birthTime} onChange={handleInputChange} placeholder={"ساعت تولد (مثال: ۱۸:۴۵)"} className={inputClasses} />
                        <input type="text" name="birthCity" value={formData.birthCity} onChange={handleInputChange} placeholder={"شهر محل تولد"} className={inputClasses} />
                    </div>
                    <div className="flex pt-2">
                        <button
                            onClick={handleSave}
                            disabled={!formData.name || !formData.lastName || !formData.motherName || !isFormDirty()}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600/50 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
                        >
                            {selectedId === 'new' ? "ذخیره پروفایل" : "به‌روزرسانی پروفایل"}
                        </button>
                    </div>
                    {formError && <p className="text-red-400 text-center font-tanha">{formError}</p>}
                </div>
            </Card>
        </motion.div>
    );
};

export default ProfileManager;
