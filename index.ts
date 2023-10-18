const cache = new Map();

export const serverQuery = async <T>({
  url,
  params,
  cacheData = true,
  cacheInterval = 20 * 60 * 1000,
}: {
  url: RequestInfo | URL;
  params?: RequestInit;
  cacheData?: boolean;
  cacheInterval?: number;
}): Promise<{
  isLoading: boolean;
  error: boolean;
  data: T | undefined;
}> => {
  const cacheKey = url;

  if (cache.has(cacheKey) && cacheData) {
    const cachedData = cache.get(cacheKey);
    const currentTime = Date.now();

    if (currentTime - cachedData.timestamp < cacheInterval) {
      return {
        isLoading: false,
        error: false,
        data: cachedData.data,
      };
    } else {
      await revalidate();
    }
  }

  let options = {
    isLoading: false,
    error: false,
    data: undefined as T | undefined,
  };

  options.isLoading = true;
  try {
    const createFetch = await fetch(`${process.env.URL}${url}`, params);

    if (createFetch.ok) {
      const result: T = await createFetch.json();
      options.isLoading = false;
      options.data = result;

      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    } else {
      options.error = true;
      options.isLoading = false;
    }
  } catch (error) {
    options.error = true;
    options.isLoading = false;
    console.log(error);
  }

  async function revalidate() {
    options.isLoading = true;
    try {
      const createFetch = await fetch(url, params);

      if (createFetch.ok) {
        const result: T = await createFetch.json();
        options.isLoading = false;
        options.data = result;

        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      } else {
        options.error = true;
      }
    } catch (error) {
      options.error = true;
      console.log(error);
    }
  }

  options.isLoading = false;

  return {
    isLoading: options.isLoading,
    error: options.error,
    data: options.data,
  };
};

export const externalServerQuery = async <T>({
  url,
  params,
  cacheData = true,
  cacheInterval = 20 * 60 * 1000,
}: {
  url: RequestInfo | URL;
  params?: RequestInit;
  cacheData?: boolean;
  cacheInterval?: number;
}): Promise<{
  isLoading: boolean;
  error: boolean;
  data: T | undefined;
}> => {
  const cacheKey = url;

  if (cache.has(cacheKey) && cacheData) {
    const cachedData = cache.get(cacheKey);
    const currentTime = Date.now();

    if (currentTime - cachedData.timestamp < cacheInterval) {
      return {
        isLoading: false,
        error: false,
        data: cachedData.data,
      };
    } else {
      await revalidate();
    }
  }

  let options = {
    isLoading: false,
    error: false,
    data: undefined as T | undefined,
  };

  options.isLoading = true;
  try {
    const createFetch = await fetch(url, params);

    if (createFetch.ok) {
      const result: T = await createFetch.json();
      options.isLoading = false;
      options.data = result;

      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    } else {
      options.error = true;
      options.isLoading = false;
    }
  } catch (error) {
    options.error = true;
    options.isLoading = false;
    console.log(error);
  }

  async function revalidate() {
    options.isLoading = true;
    try {
      const createFetch = await fetch(url, params);

      if (createFetch.ok) {
        const result: T = await createFetch.json();
        options.isLoading = false;
        options.data = result;

        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      } else {
        options.error = true;
      }
    } catch (error) {
      options.error = true;
      console.log(error);
    }
  }

  options.isLoading = false;

  return {
    isLoading: options.isLoading,
    error: options.error,
    data: options.data,
  };
};
