"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faClock,
  faThumbtack,
  faPlus,
  faSlidersH,
  faFileAlt,
  faRedo,
  faFile,
  faFileText,
} from "@fortawesome/free-solid-svg-icons";
import { APP_CONFIG } from "../../../app.config";
import { getIcon, toLanguageEnum } from "@/utils/editor-commons";
import { Language } from "@/lib/models/paste.model";

interface PasteMeta {
  id: string;
  title?: string;
  createdBy: string | null;
  createdAt: string;
  content?: string;
  language?: Language;
}

const PAGE_SIZE = 10;

async function fetchPastes({
  query,
  page,
  user,
  createdAfter,
  createdBefore,
  searchField,
}: {
  query?: string;
  page: number;
  user?: string;
  createdAfter?: string;
  createdBefore?: string;
  searchField?: string;
}): Promise<PasteMeta[]> {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (user) params.append("user", user);
  if (createdAfter) params.append("createdAfter", createdAfter);
  if (createdBefore) params.append("createdBefore", createdBefore);
  if (searchField) params.append("searchField", searchField);
  params.append("page", page.toString());
  params.append("size", PAGE_SIZE.toString());
  params.append("sort", "createdAt,desc");

  const url =
    query?.trim() || user || createdAfter || createdBefore
      ? `/api/pastes/search?${params.toString()}`
      : `/api/pastes/list/public?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch pastes");

  const data = await res.json();
  return data.map((item: any) => ({
    ...item,
    language: toLanguageEnum(item.language),
  }));
}

async function fetchRootPastes(): Promise<PasteMeta[]> {
  const res = await fetch("/api/pastes/list/root");
  if (!res.ok) return [];

  const data = await res.json();
  return data.map((item: any) => ({
    ...item,
  }));
}

export default function HomePage() {
  const [pastes, setPastes] = useState<PasteMeta[]>([]);
  const [rootPastes, setRootPastes] = useState<PasteMeta[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFiltersState] = useState({
    createdBy: "",
    titleOnly: false,
    createdAfter: "",
    createdBefore: "",
  });

  const setFilters = (field: keyof typeof filters, value: string | boolean) => {
    setFiltersState((prev) => ({ ...prev, [field]: value }));
  };

  const loadMore = () => {
    setLoading(true);
    fetchPastes({
      query: search.trim(),
      page: page + 1,
      user: filters.createdBy || undefined,
      createdAfter: filters.createdAfter || undefined,
      createdBefore: filters.createdBefore || undefined,
      searchField: filters.titleOnly ? "title" : undefined,
    })
      .then((data) => {
        setPastes((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
        setHasMore(data.length === PAGE_SIZE);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRootPastes().then((data) => setRootPastes(data));
  }, []);

  useEffect(() => {
    setPastes([]);
    setPage(0);
    setHasMore(true);

    fetchPastes({
      query: searchQuery.trim(),
      page: 0,
      user: filters.createdBy || undefined,
      createdAfter: filters.createdAfter || undefined,
      createdBefore: filters.createdBefore || undefined,
      searchField: filters.titleOnly ? "title" : undefined,
    }).then((data) => {
      setPastes(data);
      setHasMore(data.length === PAGE_SIZE);
    });
  }, [searchQuery, filters]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-white">
      <HeroSection />
      <RootSection pastes={rootPastes} />
      <SearchInput
        value={search}
        onChange={setSearch}
        onSearch={() => setSearchQuery(search)}
        onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
        showAdvanced={showAdvanced}
      />
      {showAdvanced && (
        <AdvancedSearch filters={filters} setFilters={setFilters} />
      )}
      <PasteList
        pastes={pastes}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        searchActive={searchQuery.trim() !== ""}
      />
    </main>
  );
}

// Components below...
function HeroSection() {
  const [stats, setStats] = useState<{ users: number; pastes: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ICON_CLASS = "text-lg sm:text-xl md:text-2xl";

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError((err as Error).message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-gray-600 bg-gray-900/70 backdrop-blur-sm shadow-md mb-8 px-4 sm:px-6 py-14 sm:py-20 text-center"
      aria-live="polite"
      aria-busy={loading}
    >
      {/* Decorative Background Orbs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500 opacity-10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-600 opacity-10 rounded-full pointer-events-none" />

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
        Welcome to OxyPaste
      </h1>

      {/* Subheading */}
      <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10">
        {APP_CONFIG.HOME_PAGE_HEADING}
      </p>

      {/* Stats Display */}
      <div className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 flex justify-center gap-x-10 gap-y-6 flex-wrap items-center text-center">
        {loading && (
          <p
            className="animate-pulse text-gray-400"
            aria-live="assertive"
            aria-label="Loading statistics"
          >
            Loading statistics...
          </p>
        )}

        {error && (
          <div role="alert" className="flex flex-col items-center gap-4">
            <p className="text-red-500 font-semibold">Error: {error}</p>
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-white rounded-md transition"
            >
              <FontAwesomeIcon icon={faRedo} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUser}
                className={`${ICON_CLASS} text-blue-400`}
                aria-hidden="true"
              />
              <span>
                Total Users: <strong>{stats.users.toLocaleString()}</strong>
              </span>
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faFileAlt}
                className={`${ICON_CLASS} text-purple-400`}
                aria-hidden="true"
              />
              <span>
                Total Pastes: <strong>{stats.pastes.toLocaleString()}</strong>
              </span>
            </span>
          </>
        )}
      </div>

      {/* Call to Action Button */}
      <Link
        href="/new"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
        aria-label="Create a new paste"
      >
        <FontAwesomeIcon icon={faPlus} />
        New Paste
      </Link>
    </section>
  );
}

function SearchInput({
  value,
  onChange,
  onSearch,
  onToggleAdvanced,
}: {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onToggleAdvanced: () => void;
  showAdvanced: boolean;
}) {
  return (
    <div className="relative mb-4 flex flex-wrap gap-2 sm:gap-3 items-stretch">
      {/* Input Field */}
      <div className="relative flex-grow min-w-[200px]">
        <input
          type="text"
          placeholder="Search pastes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <FontAwesomeIcon icon={faSearch} />
        <span className="hidden sm:inline">Search</span>
      </button>

      {/* Advanced Toggle Button */}
      <button
        onClick={onToggleAdvanced}
        className="cursor-pointer flex items-center gap-1 px-3 py-3 text-sm text-gray-300 hover:text-white underline underline-offset-4 transition"
      >
        <FontAwesomeIcon icon={faSlidersH} />
        <span className="hidden sm:inline">Advanced</span>
      </button>
    </div>
  );
}

function AdvancedSearch({
  filters,
  setFilters,
}: {
  filters: {
    createdBy: string;
    titleOnly: boolean;
    createdAfter: string;
    createdBefore: string;
  };
  setFilters: (field: keyof typeof filters, value: string | boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-8 w-full max-w-screen-xl px-4 mx-auto">
      {/* Created By */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Created By</label>
        <input
          type="text"
          value={filters.createdBy}
          onChange={(e) => setFilters("createdBy", e.target.value)}
          placeholder="Username"
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Created After */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Created After</label>
        <input
          type="date"
          value={filters.createdAfter}
          onChange={(e) => setFilters("createdAfter", e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
        />
      </div>

      {/* Created Before */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Created Before</label>
        <input
          type="date"
          value={filters.createdBefore}
          onChange={(e) => setFilters("createdBefore", e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
        />
      </div>

      {/* Search in Title Only */}
      <div className="flex flex-col sm:col-span-2 lg:col-span-1">
        <label className="text-sm text-gray-300 mb-1">Search Scope</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.titleOnly}
            onChange={() => setFilters("titleOnly", !filters.titleOnly)}
            className="form-checkbox text-blue-500"
            id="titleOnlyCheckbox"
          />
          <label htmlFor="titleOnlyCheckbox" className="text-sm text-gray-300">
            Search in title only
          </label>
        </div>
      </div>
    </div>
  );
}

function PasteCard({
  paste,
  isRoot = false,
}: {
  paste: PasteMeta;
  isRoot?: boolean;
}) {
  const LanguageIcon = getIcon(paste.language);

  return (
    <Link
      href={`/${paste.id}`}
      className={`group relative block transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:shadow-lg bg-gray-800 ${
        isRoot ? "p-6 rounded-xl" : "p-5 rounded-lg"
      }`}
    >
      {/* Pin icon for root pastes */}
      {isRoot && (
        <div className="absolute top-3 right-3 text-gray-400">
          <FontAwesomeIcon
            icon={faThumbtack}
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-white truncate pr-10 group-hover:text-blue-400">
        {paste.title || "Untitled"}
      </h3>

      {/* Content Preview (for root only) */}
      {isRoot && paste.content && (
        <p className="mt-2 text-sm text-gray-300 line-clamp-4">
          {paste.content}
        </p>
      )}

      {/* Metadata Section */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400">
        {/* Creator and Language */}
        <div className="flex flex-wrap items-center gap-2 overflow-hidden">
          <FontAwesomeIcon icon={faUser} aria-label="Creator" />

          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            {paste.createdBy || "anonymous"}
          </span>

          {LanguageIcon && paste.language && (
            <span
              className="flex items-center gap-1 ml-2 shrink-0 opacity-70"
              title={`Language: ${paste.language}`}
            >
              <LanguageIcon color="white" aria-hidden="true" />
              <span className="text-white text-xs capitalize">
                {paste.language}
              </span>
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <FontAwesomeIcon icon={faClock} aria-label="Timestamp" />
          <time dateTime={new Date(paste.createdAt).toISOString()}>
            {new Date(paste.createdAt).toLocaleString()}
          </time>
        </div>
      </div>
    </Link>
  );
}

function PasteList({
  pastes,
  loading,
  hasMore,
  loadMore,
  searchActive,
}: {
  pastes: PasteMeta[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  searchActive: boolean;
}) {
  return (
    <section className="space-y-6">
      {/* Section Heading */}
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <FontAwesomeIcon
          icon={searchActive ? faSearch : faClock}
          className="text-blue-400"
        />
        {searchActive ? "Search Results" : "Recent Public Pastes"}
      </h2>

      {/* Loading Skeleton */}
      {loading && (
        <div aria-live="polite" className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-700 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && pastes.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg">🕵️ No pastes found.</p>
          <p className="text-sm">
            Try refining your search or check back later.
          </p>
        </div>
      )}

      {/* Paste Cards (Responsive Vertical List) */}
      <div className="flex flex-col gap-4">
        {!loading &&
          pastes.map((paste) => (
            <div key={paste.id} className="w-full mx-auto">
              <PasteCard paste={paste} />
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}

function RootSection({ pastes }: { pastes: PasteMeta[] }) {
  if (pastes.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pastes.map((paste) => (
          <PasteCard key={paste.id} paste={paste} isRoot={true} />
        ))}
      </div>
    </section>
  );
}
