import Image from "next/image";

export default function Banner({ img_src }: { img_src: string }) {
  return (
    <div className="relative w-screen h-[300px] lg:h-[500px] overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-75 will-change-transform">
        <Image
          src={img_src}
          alt="Ideas Banner"
          fill
          unoptimized
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-75 z-10">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg text-center px-4">
          Ideas
        </h1>
        <div className="text-white text-lg font-semibold text-center">
          Where all our great things begin
        </div>
      </div>

      <div className="absolute bottom-0 w-full overflow-hidden leading-[0] z-20">
        <svg
          className="relative block w-full h-[150px] lg:h-[250px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon fill="white" points="0,100 100,30 100,100" />
        </svg>
      </div>
    </div>
  );
}
