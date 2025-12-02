import http from './http';

export const api = {
    // User authentication
    register: async (payload: any) => {
        const {data} = await http.post('/users/registration', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
    login: async (payload: any) => {
        console.log('=== API LOGIN CALL ===');
        console.log('Payload:', {phone: payload.phone, password: '[HIDDEN]'});
        console.log('Payload keys:', Object.keys(payload));
        
        const response = await http.post('/users/login', payload);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        return response.data;
    },
    logout: async () => {
        const {data} = await http.get('/users/logout');
        return data;
    },

    postPaymentsCreate: async (payload: any) => {
        const {data} = await http.post('/payments/create', payload);
        return data;
    },

    getUserInfo: async () => {
        const {data} = await http.get('/users/findMe');
        return data;
    },
    getUserFullProfile: async () => {
        const {data} = await http.get('/users/profile');
        return data;
    },
    updateUserData: async (payload: any) => {
        const {data} = await http.put('/users/update', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    // Content endpoints
    getAllCarouselItems: async () => {
        const {data} = await http.get('/carousel');
        return data;
    },
    getSingleCarouselItem: async (id: string) => {
        const {data} = await http.get(`/carousel/${id}`);
        return data;
    },
    getAllNewsItems: async () => {
        const {data} = await http.get('/news');
        return data;
    },
    getSingleNewsItem: async (id: string | string[]) => {
        const {data} = await http.get(`/news/${id}`);
        return data;
    },
    getAllAttractions: async () => {
        const {data} = await http.get('/attractions');
        return data;
    },
    getSingleAttraction: async (id: string) => {
        const {data} = await http.get(`/attractions/${id}`);
        return data;
    },
    getCities: async () => {
        const {data} = await http.get('/cities');
        return data;
    },
    getServicesByCity: async (cityId: string) => {
        const {data} = await http.get(`/services/city/${cityId}`);
        return data;
    },
    getObjectsByService: async (serviceId: number) => {
        const {data} = await http.get(`/objects/service/${serviceId}`);
        return data;
    },

    // Tours Endpoints
    getToursUmra: async (body: any) => {
        const {data} = await http.get('/tours/umra', {
            params: body
        });
        return data;
    },

    // Medical Card Endpoints
    getMedicalCard: async () => {
        const {data} = await http.get('/medical-cards');
        return data;
    },

    createMedicalCard: async (payload: FormData) => {
        const {data} = await http.post('/medical-cards', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    updateMedicalCard: async (payload: FormData) => {
        const {data} = await http.put('/medical-cards', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
    getBalance: async () => {
        const {data} = await http.get('/balance');
        return data;
    },
    getBalanceHistory: async (params: any) => {
        const {data} = await http.get('/balance/history', {
            params: params
        });
        return data;
    },
    getChecklist: async (params?: any) => {
        const {data} = await http.get('/checklist', {
            params: params
        });
        return data;
    },
    patchChecklistItemToggle: async (id: string | number) => {
        const {data} = await http.patch(`/checklist/${id}/toggle`);
        return data;
    },
    getAllCompanions: async () => {
        const {data} = await http.get(`/companions`);
        return data;
    },
    createCompanions: async (formData: FormData | any) => {
        const {data} = await http.post(`/companions`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    },
    updateCompanions: async (id: number, formData: FormData | any) => {
        const {data} = await http.patch(`/companions/${id}`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    },
    deleteCompanions: async (id: number) => {
        const {data} = await http.delete(`/companions/${id}`);
        return data;
    },


    prepareMedicalCardFormData: (cardData: {
        id?: number;
        bloodGroup?: string | null;
        bloodPressure?: string | null;
        asthma?: boolean;
        bronchialDisease?: boolean;
        pulmonaryHeartDisorder?: boolean;
        otherChronicDiseases?: string;
        hadCovidBefore?: 'Да' | 'Нет';
        meningitisVaccines?: File;
        fluVaccines?: File;
        covidVaccines?: File;
        covidTestResults?: File;
        deletedFiles?: string[];
    }): FormData => {
        const formData = new FormData();

        if (cardData.id) formData.append('id', cardData.id.toString());
        if (cardData.bloodGroup) formData.append('bloodGroup', cardData.bloodGroup);
        if (cardData.bloodPressure) formData.append('bloodPressure', cardData.bloodPressure);
        formData.append('asthma', cardData.asthma?.toString() || 'false');
        formData.append('bronchialDisease', cardData.bronchialDisease?.toString() || 'false');
        formData.append('pulmonaryHeartDisorder', cardData.pulmonaryHeartDisorder?.toString() || 'false');
        formData.append('otherChronicDiseases', cardData.otherChronicDiseases || 'Нет');
        formData.append('hadCovidBefore', cardData.hadCovidBefore || 'Нет');

        if (cardData.meningitisVaccines) formData.append('meningitisVaccines', cardData.meningitisVaccines);
        if (cardData.fluVaccines) formData.append('fluVaccines', cardData.fluVaccines);
        if (cardData.covidVaccines) formData.append('covidVaccines', cardData.covidVaccines);
        if (cardData.covidTestResults) formData.append('covidTestResults', cardData.covidTestResults);

        if (cardData.deletedFiles) {
            cardData.deletedFiles.forEach(file => {
                formData.append('deletedFiles[]', file);
            });
        }

        return formData;
    },

    // Guide Categories
    getGuideCategories: async () => {
        const {data} = await http.get('/guide-categories');
        return data;
    },
    getGuideSubcategories: async (categoryId?: number) => {
        const url = categoryId 
            ? `/guide-subcategories?categoryId=${categoryId}` 
            : '/guide-subcategories';
        const {data} = await http.get(url);
        return data;
    },

};
