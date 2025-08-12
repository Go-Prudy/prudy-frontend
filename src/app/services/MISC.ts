import api from '@/app/utils/axiosInstance';

export const getAllCurrenciesApi = async (token: string): Promise<any> => {
  try {
    const response = await api.get(`misc/currencies`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    // console.log(response.data);

    return response.data.data; // Assuming the profile data is under `data`
  } catch (error: any) {
    console.log('Error fetching Currencies:', error);
  }
};
