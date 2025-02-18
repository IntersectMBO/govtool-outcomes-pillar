import { useEffect, useState } from "react";
import { getGovActionMetadata } from "../services/requests/getGovActionMetadata";
import { GovActionMetadata } from "../types/api";

type UseMetadataOptions = {
  skipConditionCheck?: boolean;
};

export function useMetadata(action: any, options: UseMetadataOptions = {}) {
  const [metadata, setMetadata] = useState<any>(null);
  const [metadataValid, setMetadataValid] = useState<boolean>(true);
  const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      const shouldFetch =
        options.skipConditionCheck ||
        ((action?.title === null || action?.abstract === null) && action?.url);

      if (shouldFetch && action?.url) {
        setIsMetadataLoading(true);

        try {
          const fetchedMetadata = await getGovActionMetadata(action.url);
          if (!isMounted) return;

          const isValid =
            (fetchedMetadata?.body?.title !== "" &&
              fetchedMetadata?.body?.title != null) ||
            (fetchedMetadata?.body?.abstract !== "" &&
              fetchedMetadata?.body?.abstract != null);

          setMetadataValid(isValid);
          setMetadata(fetchedMetadata);
        } catch (error) {
          if (!isMounted) return;
          console.error("Error fetching metadata:", error);
          setMetadataValid(false);
          setMetadata(null);
        } finally {
          if (!isMounted) return;
          setIsMetadataLoading(false);
        }
      } else {
        setMetadata(null);
        setMetadataValid(true);
      }
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [action, options.skipConditionCheck]);

  return { metadata: metadata as GovActionMetadata, metadataValid, isMetadataLoading };
}
