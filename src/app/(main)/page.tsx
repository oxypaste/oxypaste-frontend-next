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
} from "@fortawesome/free-solid-svg-icons";
import { APP_CONFIG } from "../../../app.config";

interface PasteMeta {
  id: string;
  title?: string;
  createdBy: string | null;
  createdAt: string;
  content?: string;
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
    id: item.id,
    title: item.title,
    createdBy: item.createdBy,
    createdAt: item.createdAt,
  }));
}

async function fetchRootPastes(): Promise<PasteMeta[]> {
  const res = await fetch("/api/pastes/list/root");
  if (!res.ok) return [];

  const data = await res.json();
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    createdBy: item.createdBy,
    createdAt: item.createdAt,
    content: item.content,
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
      <WelcomeSection />
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
function WelcomeSection() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-gray-600 bg-gray-900/70 backdrop-blur-sm shadow-md mb-8 px-4 py-12 sm:py-16 text-center">
      {/* Subtle ambient background orbs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500 opacity-10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-600 opacity-10 rounded-full pointer-events-none" />

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
        Welcome to OxyPaste
      </h1>

      {/* Subheading */}
      <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6">
        {APP_CONFIG.HOME_PAGE_HEADING}
      </p>

      {/* Call to Action */}
      <Link
        href="/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out"
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
  showAdvanced,
}: {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onToggleAdvanced: () => void;
  showAdvanced: boolean;
}) {
  return (
    <div className="relative mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="relative flex-grow">
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

      <button
        onClick={onSearch}
        className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <FontAwesomeIcon icon={faSearch} />
        Search
      </button>

      <button
        onClick={onToggleAdvanced}
        className="cursor-pointer inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white underline underline-offset-4 transition"
      >
        <FontAwesomeIcon icon={faSlidersH} />
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-8">
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
      <div className="flex flex-col">
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
  return (
    <Link
      href={`/${paste.id}`}
      className={`group relative block ${
        isRoot ? "p-6 rounded-xl shadow-md" : "p-5 rounded-lg"
      } bg-gray-800 border border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all duration-300`}
    >
      {isRoot && (
        <div className="absolute top-3 right-3 text-gray-400">
          <FontAwesomeIcon
            icon={faThumbtack}
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold truncate text-white group-hover:text-blue-400 pr-8">
        {paste.title || "Untitled"}
      </h3>

      {/* Content preview if root */}
      {isRoot && paste.content && (
        <p className="text-gray-300 text-sm line-clamp-4 mt-2">
          {paste.content}
        </p>
      )}

      {/* Metadata */}
      <div className="mt-3 text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
        <span className="flex items-center gap-1 truncate">
          <FontAwesomeIcon icon={faUser} />
          <span className="truncate max-w-[200px]">
            {paste.createdBy || "anonymous"}
          </span>
        </span>

        <span className="flex items-center gap-1 text-nowrap">
          <FontAwesomeIcon icon={faClock} />
          {new Date(paste.createdAt).toLocaleString()}
        </span>
      </div>
    </Link>
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
    <section>
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <FontAwesomeIcon
          icon={searchActive ? faSearch : faClock}
          className="text-blue-400"
        />
        {searchActive ? "Search Results" : "Recent Public Pastes"}
      </h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {!loading && pastes.length === 0 && (
        <p className="text-gray-400">No pastes found.</p>
      )}

      {!loading &&
        pastes.map((paste) => <PasteCard key={paste.id} paste={paste} />)}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Load More
        </button>
      )}
    </section>
  );
}
