import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

// Interfaces para el tipado de la API
interface GalleryImage {
  id: number;
  galleryImgUrl: string;
}

interface GalleryAlbum {
  id: number;
  name: string;
  galeryPhotosImgs: GalleryImage[];
}

const GalleriaFotos = () => {
  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const url = `${API}/accessStudent/gallery`;
    axios
      .get(url)
      .then((res) => {
        setGallery(res.data?.galeryPhotos || []);
      })
      .catch((err) => console.error("Error cargando galería:", err));
  }, []);

  const openModal = (album: GalleryAlbum, index: number) => {
    setSelectedAlbum(album);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden"; // Prevenir scroll al abrir
  };

  const closeModal = () => {
    setSelectedAlbum(null);
    document.body.style.overflow = "auto";
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedAlbum) return;
    setCurrentIndex(
      (prev) => (prev + 1) % selectedAlbum.galeryPhotosImgs.length,
    );
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedAlbum) return;
    setCurrentIndex(
      (prev) =>
        (prev - 1 + selectedAlbum.galeryPhotosImgs.length) %
        selectedAlbum.galeryPhotosImgs.length,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Nuestra <span className="text-red-600">Galería</span>
        </h2>
        <div className="h-1 w-20 bg-yellow-500 mx-auto mt-2"></div>
      </header>

      <div className="max-w-7xl mx-auto space-y-16">
        {gallery.map((album) => (
          <section key={album.id} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-800 uppercase border-l-4 border-red-600 pl-4">
                {album.name}
              </h3>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Grid Estilo Mosaico */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
              {album.galeryPhotosImgs.map((img, index) => (
                <div
                  key={img.id}
                  onClick={() => openModal(album, index)}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group shadow-md transition-all hover:shadow-xl ${
                    index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={img.galleryImgUrl}
                    alt={album.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* MODAL VISUALIZADOR (LightBox) */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-100 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-red-500 transition-colors"
            onClick={closeModal}
          >
            <i className="bx bx-x"></i>
          </button>

          <div className="relative w-full max-w-5xl flex items-center justify-center">
            {/* Controles */}
            <button
              className="absolute left-0 md:-left-16 text-white text-5xl hover:text-yellow-500 transition-colors p-2"
              onClick={prevImg}
            >
              <i className="bx bx-chevron-left"></i>
            </button>

            <img
              src={selectedAlbum.galeryPhotosImgs[currentIndex].galleryImgUrl}
              alt="Preview"
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-0 md:-right-16 text-white text-5xl hover:text-yellow-500 transition-colors p-2"
              onClick={nextImg}
            >
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>

          {/* Indicador de posición */}
          <div className="absolute bottom-10 text-white font-medium bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {selectedAlbum.galeryPhotosImgs.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleriaFotos;
