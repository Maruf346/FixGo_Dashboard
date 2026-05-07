import { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Star,
  Eye,
  UserX,
  Trash2,
  MapPin,
  Briefcase,
  Award,
} from "lucide-react";
import { Modal, ConfirmModal } from "../components/Modal";
import { ActionMenu } from "../components/ActionMenu";

type Language = "EN" | "FR";
type SortKey = "name" | "jobsCompleted" | "rating";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

interface Artisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobsCompleted: number;
  rating: number;
  lastActive: string;
  location: string;
  avatar: string;
  specialty: string;
}

const MOCK_ARTISANS: Artisan[] = [
  { id: "a1",  name: "Alex Smith",     email: "justinleo@gmail.com",      phone: "+1 887 839 8383", jobsCompleted: 30, rating: 5.0, lastActive: "1h ago",    location: "San Francisco, CA",  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", specialty: "Plumber" },
  { id: "a2",  name: "David Lee",      email: "david.lee@gmail.com",      phone: "+1 415 234 5678", jobsCompleted: 45, rating: 4.9, lastActive: "2h ago",    location: "Los Angeles, CA",    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", specialty: "Electrician" },
  { id: "a3",  name: "Emma Wilson",    email: "emma.wilson@gmail.com",    phone: "+1 213 456 7890", jobsCompleted: 52, rating: 5.0, lastActive: "30m ago",   location: "San Diego, CA",      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", specialty: "Cleaner" },
  { id: "a4",  name: "James Brown",    email: "james.brown@gmail.com",    phone: "+1 619 789 0123", jobsCompleted: 38, rating: 4.8, lastActive: "4h ago",    location: "Seattle, WA",        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&auto=format", specialty: "Carpenter" },
  { id: "a5",  name: "Sophia Garcia",  email: "sophia.garcia@gmail.com",  phone: "+1 206 012 3456", jobsCompleted: 41, rating: 4.9, lastActive: "1h ago",    location: "Portland, OR",       avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", specialty: "Painter" },
  { id: "a6",  name: "Michael Chen",   email: "michael.chen@gmail.com",   phone: "+1 503 345 6789", jobsCompleted: 35, rating: 4.7, lastActive: "5h ago",    location: "Austin, TX",         avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", specialty: "HVAC Tech" },
  { id: "a7",  name: "Olivia Martinez",email: "olivia.martinez@gmail.com",phone: "+1 512 678 9012", jobsCompleted: 48, rating: 5.0, lastActive: "20m ago",   location: "Houston, TX",        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", specialty: "Tiler" },
  { id: "a8",  name: "Noah Johnson",   email: "noah.johnson@gmail.com",   phone: "+1 713 901 2345", jobsCompleted: 33, rating: 4.6, lastActive: "3h ago",    location: "Dallas, TX",         avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", specialty: "Locksmith" },
  { id: "a9",  name: "Ava Anderson",   email: "ava.anderson@gmail.com",   phone: "+1 214 234 5678", jobsCompleted: 55, rating: 4.9, lastActive: "45m ago",   location: "Phoenix, AZ",        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", specialty: "Roofer" },
  { id: "a10", name: "Liam Thomas",    email: "liam.thomas@gmail.com",    phone: "+1 602 567 8901", jobsCompleted: 29, rating: 4.8, lastActive: "6h ago",    location: "Denver, CO",         avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", specialty: "Gardener" },
  { id: "a11", name: "Mia Rodriguez",  email: "mia.rodriguez@gmail.com",  phone: "+1 303 890 1234", jobsCompleted: 44, rating: 5.0, lastActive: "1h ago",    location: "Las Vegas, NV",      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&auto=format", specialty: "Plumber" },
  { id: "a12", name: "Benjamin White",  email: "ben.white@gmail.com",     phone: "+1 702 123 4567", jobsCompleted: 37, rating: 4.7, lastActive: "2h ago",    location: "Miami, FL",          avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&auto=format", specialty: "Electrician" },
  { id: "a13", name: "Charlotte Taylor",email: "charlotte.t@gmail.com",   phone: "+1 305 456 7890", jobsCompleted: 50, rating: 4.9, lastActive: "30m ago",   location: "Orlando, FL",        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format", specialty: "Cleaner" },
  { id: "a14", name: "Lucas Moore",    email: "lucas.moore@gmail.com",    phone: "+1 407 789 0123", jobsCompleted: 32, rating: 4.8, lastActive: "4h ago",    location: "Tampa, FL",          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&auto=format", specialty: "Carpenter" },
  { id: "a15", name: "Amelia Davis",   email: "amelia.davis@gmail.com",   phone: "+1 813 012 3456", jobsCompleted: 46, rating: 5.0, lastActive: "1h ago",    location: "Boston, MA",         avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format", specialty: "Painter" },
  { id: "a16", name: "Ethan Wilson",   email: "ethan.wilson@gmail.com",   phone: "+1 617 345 6789", jobsCompleted: 39, rating: 4.6, lastActive: "5h ago",    location: "Chicago, IL",        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", specialty: "HVAC Tech" },
  { id: "a17", name: "Isabella Garcia",email: "isabella.g@gmail.com",     phone: "+1 312 678 9012", jobsCompleted: 42, rating: 4.9, lastActive: "20m ago",   location: "Philadelphia, PA",   avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", specialty: "Tiler" },
  { id: "a18", name: "Mason Lee",      email: "mason.lee@gmail.com",      phone: "+1 215 901 2345", jobsCompleted: 36, rating: 4.7, lastActive: "3h ago",    location: "Atlanta, GA",        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", specialty: "Locksmith" },
  { id: "a19", name: "Harper Martin",  email: "harper.martin@gmail.com",  phone: "+1 404 234 5678", jobsCompleted: 49, rating: 5.0, lastActive: "45m ago",   location: "Nashville, TN",      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", specialty: "Roofer" },
  { id: "a20", name: "Logan Thompson", email: "logan.t@gmail.com",        phone: "+1 629 567 8901", jobsCompleted: 34, rating: 4.8, lastActive: "6h ago",    location: "Charlotte, NC",      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", specialty: "Gardener" },
];

function AvatarImg({ src, name }: { src: string; name: string }) {
  return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return <ArrowUpDown size={12} className={`inline ml-1 transition-colors ${active ? "text-primary" : "text-muted-foreground/50"}`} />;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="text-sm font-medium text-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function EmptyState({ lang }: { lang: Language }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox size={24} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground text-center">
          {lang === "EN" ? "No artisans found" : "Aucun artisan trouvé"}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {lang === "EN" ? "Try adjusting your search or check back later." : "Essayez d'affiner votre recherche."}
        </p>
      </div>
    </div>
  );
}

export default function ArtisanManagement({ lang }: { lang: Language }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [deactivateArtisan, setDeactivateArtisan] = useState<Artisan | null>(null);
  const [deleteArtisan, setDeleteArtisan] = useState<Artisan | null>(null);

  const t = {
    search:        lang === "EN" ? "Search artisans by name, email, location…" : "Rechercher par nom, email, localisation…",
    name:          lang === "EN" ? "Name" : "Nom",
    email:         lang === "EN" ? "Email" : "Email",
    phone:         lang === "EN" ? "Phone number" : "Téléphone",
    jobsCompleted: lang === "EN" ? "Jobs Completed" : "Emplois terminés",
    rating:        lang === "EN" ? "Rating" : "Note",
    lastActive:    lang === "EN" ? "Last Active" : "Dernière activité",
    location:      lang === "EN" ? "Location" : "Localisation",
    showResult:    lang === "EN" ? "Show result:" : "Résultats :",
    completed:     lang === "EN" ? "completed" : "terminés",
    actions:       lang === "EN" ? "Actions" : "Actions",
    viewDetails:   lang === "EN" ? "View Details" : "Voir détails",
    deactivate:    lang === "EN" ? "Deactivate" : "Désactiver",
    delete:        lang === "EN" ? "Delete" : "Supprimer",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_ARTISANS.filter(a =>
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.specialty.toLowerCase().includes(q)
    ).sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "jobsCompleted") cmp = a.jobsCompleted - b.jobsCompleted;
      else if (sortKey === "rating") cmp = a.rating - b.rating;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
                  {t.name}<SortIcon active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.email}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.phone}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("jobsCompleted")}>
                  {t.jobsCompleted}<SortIcon active={sortKey === "jobsCompleted"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("rating")}>
                  {t.rating}<SortIcon active={sortKey === "rating"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.lastActive}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.location}</th>
                <th className="px-3 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <EmptyState lang={lang} />
                  </td>
                </tr>
              ) : (
                paginated.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedArtisan(a)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <AvatarImg src={a.avatar} name={a.name} />
                        <div>
                          <p className="font-medium text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.specialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{a.phone}</td>
                    <td className="px-5 py-3.5 text-foreground">{a.jobsCompleted} {t.completed}</td>
                    <td className="px-5 py-3.5">
                      <RatingStars rating={a.rating} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{a.lastActive}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{a.location}</td>
                    <td className="px-3 py-3.5">
                      <ActionMenu
                        items={[
                          {
                            label: t.viewDetails,
                            icon: <Eye size={14} />,
                            onClick: () => setSelectedArtisan(a),
                          },
                          {
                            label: t.deactivate,
                            icon: <UserX size={14} />,
                            onClick: () => setDeactivateArtisan(a),
                            className: "text-orange-600",
                          },
                          {
                            label: t.delete,
                            icon: <Trash2 size={14} />,
                            onClick: () => setDeleteArtisan(a),
                            className: "text-red-600",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-border">
          {paginated.length === 0 ? (
            <div className="px-5 py-16 text-center"><EmptyState lang={lang} /></div>
          ) : (
            paginated.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedArtisan(a)}
                className="px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AvatarImg src={a.avatar} name={a.name} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.specialty}</p>
                    </div>
                  </div>
                  <RatingStars rating={a.rating} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.jobsCompleted}</p>
                    <p className="text-sm font-bold text-foreground">{a.jobsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.lastActive}</p>
                    <p className="text-xs text-foreground">{a.lastActive}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.location}</p>
                    <p className="text-xs text-foreground truncate">{a.location}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t.showResult}</span>
              <div className="relative">
                <button
                  onClick={() => setPageSizeOpen(!pageSizeOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {pageSize}
                  <ChevronDown size={12} className={`transition-transform ${pageSizeOpen ? "rotate-180" : ""}`} />
                </button>
                {pageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
                    {PAGE_SIZE_OPTIONS.map(s => (
                      <button key={s} onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${pageSize === s ? "text-primary font-semibold" : "text-foreground"}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map((pn, i) =>
                pn === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                ) : (
                  <button
                    key={pn}
                    onClick={() => setPage(pn as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === pn ? "text-white shadow-sm" : "border border-border text-muted-foreground hover:bg-muted"}`}
                    style={page === pn ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                  >
                    {pn}
                  </button>
                )
              )}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Artisan Details Modal */}
      {selectedArtisan && (
        <Modal
          isOpen={!!selectedArtisan}
          onClose={() => setSelectedArtisan(null)}
          title={lang === "EN" ? "Artisan Details" : "Détails de l'artisan"}
          size="lg"
        >
          <div className="space-y-6">
            {/* Artisan Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <img src={selectedArtisan.avatar} alt={selectedArtisan.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{selectedArtisan.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Briefcase size={14} />
                  {selectedArtisan.specialty}
                </p>
                <div className="mt-2">
                  <RatingStars rating={selectedArtisan.rating} />
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                  {lang === "EN" ? "Active" : "Actif"}
                </span>
                <p className="text-xs text-muted-foreground mt-2">{selectedArtisan.lastActive}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award size={16} className="text-blue-600" />
                  <p className="text-xs text-blue-700">
                    {lang === "EN" ? "Jobs Completed" : "Emplois terminés"}
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{selectedArtisan.jobsCompleted}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} className="text-yellow-600" />
                  <p className="text-xs text-yellow-700">
                    {lang === "EN" ? "Average Rating" : "Note moyenne"}
                  </p>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{selectedArtisan.rating.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={16} className="text-green-600" />
                  <p className="text-xs text-green-700">
                    {lang === "EN" ? "Earnings" : "Gains"}
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-600">${selectedArtisan.jobsCompleted * 75}</p>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Contact Information" : "Informations de contact"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Email" : "Email"}</p>
                    <p className="text-sm font-medium text-foreground">{selectedArtisan.email}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Phone" : "Téléphone"}</p>
                    <p className="text-sm font-medium text-foreground">{selectedArtisan.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Location" : "Emplacement"}
                </h4>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <MapPin size={16} className="text-muted-foreground" />
                  <p className="text-sm text-foreground">{selectedArtisan.location}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Verification Status" : "Statut de vérification"}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200">
                    {lang === "EN" ? "Verified" : "Vérifié"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                    {lang === "EN" ? "Background Check Passed" : "Vérification réussie"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Recent Activity" : "Activité récente"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {lang === "EN"
                    ? "Completed 3 jobs in the last 7 days. Excellent performance and customer satisfaction."
                    : "A terminé 3 emplois au cours des 7 derniers jours. Excellentes performances et satisfaction client."}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Deactivate Confirmation Modal */}
      {deactivateArtisan && (
        <ConfirmModal
          isOpen={!!deactivateArtisan}
          onClose={() => setDeactivateArtisan(null)}
          onConfirm={() => {
            console.log("Deactivating artisan:", deactivateArtisan.id);
          }}
          title={lang === "EN" ? "Deactivate Artisan" : "Désactiver l'artisan"}
          message={
            lang === "EN"
              ? `Are you sure you want to deactivate ${deactivateArtisan.name}? They will not be able to accept new jobs.`
              : `Êtes-vous sûr de vouloir désactiver ${deactivateArtisan.name}? Ils ne pourront plus accepter de nouveaux emplois.`
          }
          confirmText={lang === "EN" ? "Deactivate" : "Désactiver"}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type="warning"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteArtisan && (
        <ConfirmModal
          isOpen={!!deleteArtisan}
          onClose={() => setDeleteArtisan(null)}
          onConfirm={() => {
            console.log("Deleting artisan:", deleteArtisan.id);
          }}
          title={lang === "EN" ? "Delete Artisan" : "Supprimer l'artisan"}
          message={
            lang === "EN"
              ? `Are you sure you want to permanently delete ${deleteArtisan.name}? This action cannot be undone and all artisan data will be lost.`
              : `Êtes-vous sûr de vouloir supprimer définitivement ${deleteArtisan.name}? Cette action est irréversible et toutes les données de l'artisan seront perdues.`
          }
          confirmText={lang === "EN" ? "Delete Permanently" : "Supprimer définitivement"}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type="danger"
        />
      )}
    </main>
  );
}
