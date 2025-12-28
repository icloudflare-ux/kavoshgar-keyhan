
import { useState, useEffect } from 'react';

interface Location {
    latitude: number;
    longitude: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface LocationState {
    location: Location | null;
    error: string | null;
    status: Status;
}

export const usePreciseLocation = (): LocationState => {
    const [state, setState] = useState<LocationState>({
        location: null,
        error: null,
        status: 'idle',
    });

    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setState({
                location: { latitude: 35.6892, longitude: 51.3890 }, // Tehran
                error: 'موقعیت‌یابی جغرافیایی پشتیبانی نمی‌شود. از موقعیت پیش‌فرض (تهران) استفاده می‌شود.',
                status: 'success',
            });
            return;
        }

        setState(prev => ({ ...prev, status: 'loading' }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    error: null,
                    status: 'success',
                });
            },
            (error) => {
                const tehranCoords = { latitude: 35.6892, longitude: 51.3890 };
                let errorMessage: string;
                
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        errorMessage = 'دسترسی به موقعیت مکانی رد شد. از موقعیت پیش‌فرض (تهران) برای محاسبات استفاده می‌شود.';
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMessage = 'اطلاعات موقعیت مکانی در دسترس نیست. از موقعیت پیش‌فرض (تهران) استفاده می‌شود.';
                        break;
                    case 3: // TIMEOUT
                        errorMessage = 'درخواست برای دریافت موقعیت مکانی با پایان زمان مواجه شد. از موقعیت پیش‌فرض (تهران) استفاده می‌شود.';
                        break;
                    default: // UNKNOWN_ERROR
                        errorMessage = 'خطای ناشناخته در دریافت موقعیت. از موقعیت پیش‌فرض (تهران) استفاده می‌شود.';
                        break;
                }
                setState({
                    location: tehranCoords,
                    error: errorMessage, // This is now a warning message
                    status: 'success', // Set status to success to allow components to use the fallback location
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Reduced timeout to 10s
        );
    }, []); // Runs only once on mount

    return state;
};