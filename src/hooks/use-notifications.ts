import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR(`/api/notifications`, fetcher);


  return {
    notifications: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  };
};
