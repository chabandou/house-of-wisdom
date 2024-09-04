"use client";



import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type SwiperType from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  urls: string[];
}

export default function ImageSlider({ urls }: ImageSliderProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slidrConfig, setSlidrConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlidrConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  const activeStyle =
    "active:scale-[0.97] hover:scale-105 aspect-square grid opacity-100 absolute top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white place-items-center border-2 border-zinc-300 z-50";
  const inactiveStyle = "hidden text-gray-400";
  return (
    <div className="group relative w-full bg-zinc-100 rounded-xl aspect-square overflow-hidden">
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyle, "right-3 transition", {
            [inactiveStyle]: slidrConfig.isEnd,
            "hover:bg-primary-300 text-primary-300 opacity-100":
              !slidrConfig.isEnd,
          })}
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 text-zinc-700" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyle, "left-3 transition", {
            [inactiveStyle]: slidrConfig.isBeginning,
            "hover:bg-primary-300 text-primary-300 opacity-100":
              !slidrConfig.isBeginning,
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        modules={[Pagination]}
        pagination={{
          renderBullet: function (_, className) {
            return `<span class="${className} rounded-full transition"></span>`;
          }
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="relative -z-10 w-full h-full">
            <Image
              loading="eager"
              src={url}
              alt="Product image"
              fill
              className="-z-10 w-full h-full object-cover object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
