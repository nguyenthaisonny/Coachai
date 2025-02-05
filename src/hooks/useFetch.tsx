import { useState } from 'react';
import { toast } from 'sonner';

const useFetch = <I, T>(cb: any) => {
  const [data, setData] = useState<T | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fn = async (args: I) => {
    setLoading(true);
    try {
      const res = await cb(args);
      setData(res);
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fn, setData };
};
export default useFetch;
