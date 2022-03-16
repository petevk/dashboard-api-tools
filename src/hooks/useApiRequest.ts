import { useState, useEffect } from "react";
import { apiRequest, isApiError, HTTPMethod, Options, ApiResponse } from "../index";

type ApiResponseMetadata<ResponseData> = [ApiResponse<ResponseData> | undefined, string[] | undefined, boolean]
type ApiRequestParams = {
  method: HTTPMethod;
  url: string;
  data?: Record<string, unknown> | undefined;
  options?: Options;
}

export const useApiRequest = <ResponseData>(apiRequestParams: ApiRequestParams, dependencies = []): ApiResponseMetadata<ResponseData> => {
  const {method, url, data, options} = apiRequestParams;

  const [response, setResponse] = useState<ApiResponse<ResponseData>>();
  const [errors, setErrors] = useState<string[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);

      try {
        const responseFromApi = await apiRequest<ResponseData>(method, url, data, options);
        setResponse(responseFromApi);
      } catch(badResponse) {
        if(isApiError(badResponse)) {
          setErrors(badResponse.errors);
        } else {
          setErrors(["Could not parse errors from response"]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, dependencies);

  return [response, errors, isLoading];
};