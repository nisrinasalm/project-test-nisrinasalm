import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import clsx from "clsx";

import Navbar from "@/components/Navbar";
import { buildPaginationControl } from "@/lib/pagination";
import { PaginatedApiResponse } from "@/types/api";
import { IdeaData } from "@/types/ideas";

export default function IdeasPage() {
  const router = useRouter();
  const { query } = router;

  const [page, setPage] = useState(Number(query.page) || 1);
  const [size, setSize] = useState(Number(query.size) || 10);
  const [sort, setSort] = useState((query.sort as string) || "-published_at");

  useEffect(() => {
    router.replace(
      {
        pathname: "/ideas",
        query: { page, size, sort },
      },
      undefined,
      { shallow: true }
    );
  }, [page, size, sort, router]);

  const fetchIdeas = async (
    page: number,
    size: number,
    sort: string
  ): Promise<PaginatedApiResponse<IdeaData[]>> => {
    const res = await fetch(
      `/api/ideas?page[number]=${page}&page[size]=${size}&sort=${sort}&append[]=small_image&append[]=medium_image`,
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
    ideas?.meta?.current_page,
    ideas?.meta?.last_page,
    1
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-semibold mb-6">Ideas</h1>

      <div className="mb-4 flex items-center justify-between gap-4">
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
            onChange={(e) => setSize(Number(e.target.value))}
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
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ideasData.map((idea: IdeaData) => (
            <div key={idea.id} className="border rounded overflow-hidden">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={idea.small_image?.url}
                  alt={idea.title ?? "Idea Image"}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold line-clamp-3">
                  {idea.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
              "flex min-w-[38px] justify-center rounded-lg text-black drop-shadow-sm border border-typo-outline !p-2 !font-semibold hover:bg-slate-100",
              pageItem === page &&
                "text-white bg-[#ff6600] hover:bg-typo-primary"
            )}
            onClick={() => typeof page === "number" && setPage(pageItem)}
            disabled={pageItem === "..." || isLoading}
          >
            {pageItem}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => p + 1)}
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
