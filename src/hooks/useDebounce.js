import { useState } from "react";

export default function useDebounce(rate = 1000) {
  const [timeoutId, setTimeoutId] = useState(null);

  function debounce(callback) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const _timeoutId = setTimeout(callback, rate);

    setTimeoutId(_timeoutId);
  }

  return debounce;
}
