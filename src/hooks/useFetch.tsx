import { useState } from 'react';
import { toast } from 'sonner';
interface DataResult<T> {
  success: boolean;
  data: T;
}
const useFetch = <I,>(cb: (args: I) => Promise<any>) => {
  const [data, setData] = useState<DataResult<I>>();
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
