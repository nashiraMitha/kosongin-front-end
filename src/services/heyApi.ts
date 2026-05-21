import api from "@/services/api";

export interface LoginPayload {
  email?: string;
  nickname?: string;
  password: string;
}

export interface LoginResponse<T = any> {
  data: T;
  status: number;
}

const heyApi = {
  adminLogin: async (payload: LoginPayload): Promise<LoginResponse> => {
    // returns axios response; caller handles token/storage
    const res = await api.post(`/api/auth/login`, payload);
    return { data: res.data, status: res.status };
  },

  // generic helpers for a hypothetical /hey endpoint
  sendHey: (payload: any) => api.post("/hey", payload),
  getHeyStatus: () => api.get("/hey/status"),
};

export default heyApi;
