import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const YouTubeVideoLink = ({ videoId, linkText }:{videoId:string; linkText:string}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => setIsOpen(!isOpen);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e:any) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  // Render modal using React Portal
  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-3xl h-auto p-4">
        <button
          onClick={toggleModal}
          className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300"
        >
          &times;
        </button>
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleModal();
        }}
        className="text-blue-600 underline hover:text-blue-800"
      >
        {linkText || "Watch Video"}
      </a>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
};

export default YouTubeVideoLink;
