import { useMutation } from "react-query";
import axios from "axios";

const API = "http://localhost:30001/goods";

export function useGetData() {
  return useMutation(async (path) => {
    try {
      const res = await axios.get(API, path);
      return res.data;
    } catch {
      console.error("Error fetch", e);
      throw e;
    }
  });
}
