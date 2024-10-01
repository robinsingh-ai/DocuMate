"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { researchIdState } from "../atoms/atom";
import { ExternalLink, FileText, Youtube } from 'lucide-react';

export type NamedUrl = {
  name: string;
  url: string;
};

export type BusinessareaInfo = {
  technology: string;
  businessarea: string;
  blog_articles_urls: string[];
  youtube_videos_urls: NamedUrl[];
};

interface ResearchResultsProps {
  darkMode: boolean;
}

const ResearchResults: React.FC<ResearchResultsProps> = ({ darkMode }) => {
  const [businessareaInfoList, setBusinessareaInfoList] = useState<BusinessareaInfo[]>([]);
  const researchId = useRecoilValue(researchIdState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{
          result: {
            json_dict: {
              businessareas: BusinessareaInfo[];
            };
          };
        }>(`http://localhost:3001/api/multiagent/${researchId}`);

        const { result } = response.data;
        setBusinessareaInfoList(result.json_dict.businessareas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [researchId]);

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded p-2 text-sm`}>
      <h2 className={`text-base font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Research Results</h2>
      <div className="max-h-64 overflow-y-auto">
        {businessareaInfoList.map((businessarea, index) => (
          <div key={index} className="mb-3">
            <h3 className={`text-xs font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {businessarea.technology} - {businessarea.businessarea}
            </h3>
            <div className="space-y-1">
              <div>
                <h4 className={`flex items-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FileText className="mr-1" size={10} />
                  Blog Articles
                </h4>
                <ul className="text-xs space-y-0.5 ml-3">
                  {businessarea.blog_articles_urls.length > 0 ? (
                    businessarea.blog_articles_urls.map((url, urlIndex) => (
                      <li key={urlIndex} className="flex items-center">
                        {url === "MISSING" ? (
                          <span className="text-red-500 text-xs">Article {urlIndex + 1}: Missing</span>
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} hover:underline`}
                          >
                            <ExternalLink className="mr-1" size={8} />
                            Article {urlIndex + 1}
                          </a>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-red-500 text-xs">No articles found</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className={`flex items-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Youtube className="mr-1" size={10} />
                  YouTube Videos
                </h4>
                <ul className="text-xs space-y-0.5 ml-3">
                  {businessarea.youtube_videos_urls.length > 0 ? (
                    businessarea.youtube_videos_urls.map((video, videoIndex) => (
                      <li key={videoIndex} className="flex items-center">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} hover:underline`}
                        >
                          <ExternalLink className="mr-1" size={8} />
                          {video.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-red-500 text-xs">No videos found</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchResults;