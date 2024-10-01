"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { researchIdState } from "../atoms/atom";

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
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Research Results</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blog Articles</h3>
          {businessareaInfoList.map((businessarea, index) => (
            <div key={index} className="mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {businessarea.technology} - {businessarea.businessarea}
              </h4>
              <ul className="list-disc pl-5">
                {businessarea.blog_articles_urls.length > 0 ? (
                  businessarea.blog_articles_urls.map((url, urlIndex) => (
                    <li key={urlIndex}>
                      {url === "MISSING" ? (
                        <span className="text-red-500">Article {urlIndex + 1}: Missing</span>
                      ) : (
                        
                          <a
                              href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} hover:underline`}
                        >
                          Article {urlIndex + 1}
                        </a>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-red-500">No articles found</li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>YouTube Videos</h3>
          {businessareaInfoList.map((businessarea, index) => (
            <div key={index} className="mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {businessarea.technology} - {businessarea.businessarea}
              </h4>
              <ul className="list-disc pl-5">
                {businessarea.youtube_videos_urls.length > 0 ? (
                  businessarea.youtube_videos_urls.map((video, videoIndex) => (
                    <li key={videoIndex}>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} hover:underline`}
                      >
                        {video.name}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-red-500">No videos found</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchResults;