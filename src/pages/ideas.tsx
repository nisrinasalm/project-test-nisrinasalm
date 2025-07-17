import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import clsx from "clsx";

import Navbar from "@/components/Navbar";
import { formatDate } from "@/lib/date";
import { buildPaginationControl } from "@/lib/pagination";
import { PaginatedApiResponse } from "@/types/api";
import { IdeaData } from "@/types/ideas";
import Banner from "@/components/Banner";

export default function IdeasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const sort = searchParams.get("sort") || "-published_at";

  const handleChange = (newParams: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const newPage = newParams.page ?? page;
    const newSize = newParams.size ?? size;
    const newSort = newParams.sort ?? sort;

    router.push(
      `/ideas?page=${newPage}&size=${newSize}&sort=${newSort}`,
      undefined,
      { shallow: true }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchIdeas = async (
    page: number,
    size: number,
    sort: string
  ): Promise<PaginatedApiResponse<IdeaData[]>> => {
    const res = await fetch(
      `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${size}&sort=${sort}&append[]=small_image&append[]=medium_image`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch ideas");
    return res.json();
  };

  const { data: ideas, isLoading } = useQuery<PaginatedApiResponse<IdeaData[]>>(
    {
      queryKey: ["ideas", page, size, sort],
      queryFn: () => fetchIdeas(page, size, sort),
    }
  );

  const ideasData = ideas?.data || [];
  const paginationControl = buildPaginationControl(
    ideas?.meta?.current_page || 1,
    ideas?.meta?.last_page || 1,
    1
  );

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <Banner img_src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" />
      <div className="mb-4 flex items-center justify-between gap-4 px-20 pt-16">
        <div>
          <div className="text-sm">
            Showing {ideas?.meta?.from} - {ideas?.meta?.to} of{" "}
            {ideas?.meta?.total}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <label htmlFor="size" className="text-sm">
            Show per page:
          </label>
          <select
            id="size"
            value={size}
            onChange={(e) =>
              handleChange({ size: Number(e.target.value), page: 1 })
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <label htmlFor="sort" className="text-sm">
            Sort By:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleChange({ sort: e.target.value, page: 1 })}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border rounded overflow-hidden animate-pulse"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded" />
                <div className="h-5 w-full bg-gray-300 rounded" />
                <div className="h-5 w-5/6 bg-gray-300 rounded" />
                <div className="h-5 w-2/3 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20">
          {ideasData.map((idea: IdeaData) => (
            <div key={idea.id} className="border rounded overflow-hidden">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={idea.small_image?.[0]?.url}
                  alt={idea.title ?? "Idea Image"}
                  fill
                  unoptimized
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="text-gray-500 font-normal">
                  {formatDate(idea.published_at)}
                </div>
                <div className="text-lg font-semibold line-clamp-3">
                  {idea.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => handleChange({ page: page - 1 })}
          disabled={page === 1}
          className={clsx(
            "flex min-w-[38px] justify-center items-center rounded-lg drop-shadow-sm border !p-2 !font-semibold hover:bg-slate-100",
            "bg-white text-black"
          )}
        >
          <HiChevronLeft />
        </button>
        {paginationControl.map((pageItem, index) => (
          <button
            key={index}
            className={clsx(
              "flex min-w-[38px] justify-center rounded-lg text-black drop-shadow-sm border !p-2 !font-semibold hover:bg-slate-100",
              pageItem === page && "text-white bg-[#ff6600] hover:text-black"
            )}
            onClick={() =>
              typeof pageItem === "number" && handleChange({ page: pageItem })
            }
            disabled={pageItem === "..." || isLoading}
          >
            {pageItem}
          </button>
        ))}
        <button
          onClick={() => handleChange({ page: page + 1 })}
          className={clsx(
            "flex min-w-[38px] justify-center items-center rounded-lg drop-shadow-sm border !p-2 !font-semibold hover:bg-slate-100",
            "bg-white text-black"
          )}
        >
          <HiChevronRight />
        </button>
      </div>
    </div>
  );
}
