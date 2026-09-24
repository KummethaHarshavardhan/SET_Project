import api, { getBaseURL } from "./api";

export const getRecordings = async () => {
  const response = await api.get("/recordings");
  return response.data.recordings || [];
};

export const uploadRecording = async (formData) => {
  const response = await api.post("/recordings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteRecording = async (id) => {
  const response = await api.delete(`/recordings/${id}`);
  return response.data;
};

export const getAudioStreamUrl = (id) => {
  const baseURL = getBaseURL();
  const token = localStorage.getItem("token");
  return `${baseURL}/recordings/${id}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
};
