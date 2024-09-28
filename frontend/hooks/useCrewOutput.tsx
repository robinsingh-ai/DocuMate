"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { researchIdState } from "../atoms/atom";

export type EventType = {
  data: string;
  timestamp: string;
};

export type NamedUrl = {
  name: string;
  url: string;
};

export type BusinessareaInfo = {
  technology: string;
  businessarea: string;
  blog_articles_urls: string[];
  youtube_interview_urls: NamedUrl[];
};

export const useCrewOutput = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [businessareas, setBusinessareas] = useState<string[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [businessareaInfoList, setBusinessareaInfoList] = useState<BusinessareaInfo[]>([]);
  const [currentInputId, setCurrentInputId] = useState<string>("");
  const [researchId, setResearchId] = useRecoilState(researchIdState);


  useEffect(() => {
    let intervalId: number;
    console.log("currentInputId", currentInputId);

    const fetchOutputStatus = async () => {
      try {
        console.log("Fetching output status for:", currentInputId);
        const response = await axios.get<{
          status: string;
          result: { businessareas: BusinessareaInfo[] };
          events: EventType[];
        }>(`http://localhost:3001/api/multiagent/${currentInputId}`);
        const { status, events: fetchedEvents, result } = response.data;
        console.log("Received status:", status);
        console.log("Received events:", fetchedEvents);
        console.log("Received result:", result);
        setEvents(fetchedEvents);
        if (result) {
          console.log("Setting output businessareas:", result.businessareas);
          setBusinessareaInfoList(result.businessareas || []);
        }
        if (status === "COMPLETE") {
          if (intervalId) {
            clearInterval(intervalId);
          }
          setRunning(false);
          toast.success(`Output ${status.toLowerCase()}.`);
          setResearchId(currentInputId); // Save the ID in Recoil state
        } else if (status === "ERROR") {
          if (intervalId) {
            clearInterval(intervalId);
          }
          setRunning(false);
          toast.error(`Output ${status.toLowerCase()}.`);
        }
      } catch (error) {
        console.error("Error fetching output status:", error);
        if (intervalId) {
          clearInterval(intervalId);
        }
        setRunning(false);
        toast.error("Failed to get output status.");
      }
    };

    if (currentInputId !== "") {
      intervalId = setInterval(fetchOutputStatus, 1000) as unknown as number;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentInputId, setResearchId]);

  const startOutput = async () => {
    console.log("Starting output with:", { technologies, businessareas });
    setEvents([]);
    setBusinessareaInfoList([]);
    setRunning(true);

    try {
      const response = await axios.post<{ input_id: string }>(
        "http://localhost:3001/api/multiagent",
        {
          technologies,
          businessareas,
        }
      );

      toast.success("Output started");

      console.log("Received input_id:", response.data.input_id);
      setCurrentInputId(response.data.input_id);
    } catch (error) {
      console.error("Failed to start output:", error);
      toast.error("Failed to start output");
      setCurrentInputId("");
    }
  };

  return {
    running,
    events,
    setEvents,
    businessareaInfoList,
    setBusinessareaInfoList,
    currentInputId,
    setCurrentInputId,
    technologies,
    setTechnologies,
    businessareas,
    setBusinessareas,
    startOutput,
  };
};