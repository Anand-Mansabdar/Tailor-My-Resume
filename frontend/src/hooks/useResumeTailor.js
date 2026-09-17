import { useCallback, useRef, useState } from "react";
import { tailorResume } from "../services/resumeApi";

export const STAGES = [
  "Reading resume",
  "Analyzing job description",
  "Matching relevant experience",
  "Generating tailored resume",
  "Preparing LaTeX",
];

export function useResumeTailor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const submit = useCallback(async (payload) => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setProcessingStage(0);

    const controller = new AbortController();
    abortRef.current = controller;

    const timers = STAGES.slice(1).map((_, index) =>
      setTimeout(() => setProcessingStage(index + 1), 900 * (index + 1))
    );

    try {
      const data = await tailorResume({ ...payload, signal: controller.signal });
      timers.forEach(clearTimeout);
      setProcessingStage(STAGES.length - 1);
      setResult(data);
      return data;
    } catch (err) {
      timers.forEach(clearTimeout);
      if (err.name !== "AbortError") setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
      abortRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setIsSubmitting(false);
    setProcessingStage(0);
    setResult(null);
    setError(null);
  }, []);

  return { isSubmitting, processingStage, result, error, submit, reset };
}