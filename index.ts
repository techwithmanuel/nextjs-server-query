const cache = new Map();

export const serverQuery = async <T>({
  url,
  params,
  cacheData = true,
  cacheInterval = 20 * 60 * 1000,
  external = false,
}: {
  url: RequestInfo | URL;
  params?: RequestInit;
  cacheData?: boolean;
  cacheInterval?: number;
  external?: boolean;
}): Promise<{
  isLoading: boolean;
  error: boolean;
  data: T | undefined;
}> => {
  const cacheKey = url;

  const fetchURL = external ? url : `${process.env.URL}${url}`;

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
    const createFetch = await fetch(fetchURL, params);

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
      const createFetch = await fetch(fetchURL, params);

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

export const streamSeverQueryResponse = async <T>({
  url,
  params,
  external = false,
}: {
  url: RequestInfo | URL;
  params: RequestInit;
  external?: boolean;
}): Promise<{ isLoading: boolean; error: boolean; data: T | undefined }> => {
  const options = {
    isLoading: true,
    error: false,
    data: undefined as T | undefined,
  };

  const fetchURL = external ? url : `${process.env.URL}${url}`;

  try {
    const createFetch: Response = await fetch(fetchURL, params);

    if (createFetch.ok) {
      const reader = createFetch.body!.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        if (value) {
          chunks.push(value);

          
        }
      }

      const result = new TextDecoder("utf-8").decode(
        chunks.reduce(
          (acc, chunk) => new Uint8Array([...acc, ...Array.from(chunk)]),
          new Uint8Array(0)
        )
      );

      options.isLoading = false;
      options.data = JSON.parse(result);
    } else {
      options.error = true;
      options.isLoading = false;
    }
  } catch (error) {
    options.error = true;
    console.log(error);
  }

  options.isLoading = false;
  return options;
};
