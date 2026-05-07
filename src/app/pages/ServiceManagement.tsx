import { useState, useMemo, useRef, ChangeEvent, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Users,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  UserCheck,
  Calendar,
} from "lucide-react";
import { Modal } from "../components/Modal";

type Language = "EN" | "FR";

interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  is_active: boolean;
  serviceCount: number;
}

interface Service {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  priceMin: number;
  priceMax: number;
  completionTime: string;
  priority: "Normal" | "Urgent";
  description: string;
  icon: string;
  coverImage: string;
  is_active: boolean;
  assignedArtisans: number;
  activeBookings: number;
  estimatedDuration: string;
}

// Generate more categories for pagination demo with proper image URLs
const CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=80&h=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=80&h=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=80&h=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=80&h=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=80&h=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=80&h=80&fit=crop&auto=format",
];

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=40&h=40&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=40&h=40&fit=crop&auto=format",
];

const MOCK_CATEGORIES: Category[] = Array.from({ length: 20 }, (_, i) => ({
  id: `cat${i + 1}`,
  name: i === 0 ? "Plumbing Services" : i === 1 ? "Electrical" : i === 2 ? "Carpentry" : i === 3 ? "Painting Services" : i === 4 ? "HVAC Services" : i === 5 ? "Cleaning Services" : `Service Category ${i + 1}`,
  icon: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length],
  order: i + 1,
  is_active: Math.random() > 0.2,
  serviceCount: Math.floor(Math.random() * 20) + 1,
}));

// Generate more services for pagination demo with proper image URLs
const MOCK_SERVICES: Service[] = Array.from({ length: 25 }, (_, i) => ({
  id: `s${i + 1}`,
  name: i === 0 ? "Pipe Repair" : i === 1 ? "Electrical Wiring" : i === 2 ? "Kitchen Cabinet" : i === 3 ? "Wall Painting" : i === 4 ? "AC Installation" : `Service ${i + 1}`,
  category: `cat${(i % 6) + 1}`,
  categoryName: i % 6 === 0 ? "Plumbing" : i % 6 === 1 ? "Electrical" : i % 6 === 2 ? "Carpentry" : i % 6 === 3 ? "Painting" : i % 6 === 4 ? "HVAC" : "Cleaning",
  priceMin: 40 + (i % 5) * 10,
  priceMax: 80 + (i % 5) * 20,
  completionTime: `${1 + (i % 4)} hour${i % 4 > 0 ? 's' : ''}`,
  priority: i % 2 === 0 ? "Urgent" : "Normal",
  description: "Professional service with experienced technicians",
  icon: SERVICE_IMAGES[i % SERVICE_IMAGES.length],
  coverImage: SERVICE_IMAGES[i % SERVICE_IMAGES.length],
  is_active: Math.random() > 0.3,
  assignedArtisans: Math.floor(Math.random() * 15) + 3,
  activeBookings: Math.floor(Math.random() * 30) + 5,
  estimatedDuration: `${1 + (i % 4)} hour${i % 4 > 0 ? 's' : ''}`,
}));

function StatusBadge({ status }: { status: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>
      {status ? "Active" : "Inactive"}
    </span>
  );
}

export default function ServiceManagement({ lang }: { lang: Language }) {
  const [activeTab, setActiveTab] = useState<"categories" | "services">("services");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [search, setSearch] = useState("");

  // Pagination for categories
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryPageSize, setCategoryPageSize] = useState(8);

  // Pagination for services
  const [servicePage, setServicePage] = useState(1);
  const [servicePageSize, setServicePageSize] = useState(8);

  const t = {
    title: lang === "EN" ? "Service Management" : "Gestion des services",
    subtitle: lang === "EN" ? "Manage all service categories and individual services" : "Gérer toutes les catégories de services",
    allCategories: lang === "EN" ? "All Categories" : "Toutes les catégories",
    allService: lang === "EN" ? "All Service" : "Tous les services",
    addNewService: lang === "EN" ? "Add New Service" : "Ajouter un service",
    addNewCategory: lang === "EN" ? "Add New Category" : "Ajouter une catégorie",
    search: lang === "EN" ? "Search" : "Rechercher",
    serviceName: lang === "EN" ? "SERVICE NAME" : "NOM DU SERVICE",
    categoryName: lang === "EN" ? "CATEGORY NAME" : "NOM DE CATÉGORIE",
    priceRange: lang === "EN" ? "PRICE RANGE" : "FOURCHETTE DE PRIX",
    status: lang === "EN" ? "STATUS" : "STATUT",
    actions: lang === "EN" ? "ACTIONS" : "ACTIONS",
    totalServices: lang === "EN" ? "Total Services" : "Services totaux",
    activeServices: lang === "EN" ? "Active Services" : "Services actifs",
    totalCategories: lang === "EN" ? "Total Categories" : "Catégories totales",
    showResult: lang === "EN" ? "Show result:" : "Résultats :",
    confirmDelete: lang === "EN" ? "Are you sure you want to delete this?" : "Êtes-vous sûr de vouloir supprimer?",
    delete: lang === "EN" ? "Delete" : "Supprimer",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
  };

  // Filter and paginate categories
  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CATEGORIES.filter(c => !q || c.name.toLowerCase().includes(q));
  }, [search]);

  const totalCategoryPages = Math.max(1, Math.ceil(filteredCategories.length / categoryPageSize));
  const paginatedCategories = filteredCategories.slice(
    (categoryPage - 1) * categoryPageSize,
    categoryPage * categoryPageSize
  );

  const categoryPageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalCategoryPages <= 6) {
      for (let i = 1; i <= totalCategoryPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (categoryPage > 3) pages.push("…");
      for (let i = Math.max(2, categoryPage - 1); i <= Math.min(totalCategoryPages - 1, categoryPage + 1); i++) pages.push(i);
      if (categoryPage < totalCategoryPages - 2) pages.push("…");
      pages.push(totalCategoryPages);
    }
    return pages;
  }, [categoryPage, totalCategoryPages]);

  // Filter and paginate services
  const filteredServices = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_SERVICES.filter(s => !q || s.name.toLowerCase().includes(q) || s.categoryName.toLowerCase().includes(q));
  }, [search]);

  const totalServicePages = Math.max(1, Math.ceil(filteredServices.length / servicePageSize));
  const paginatedServices = filteredServices.slice(
    (servicePage - 1) * servicePageSize,
    servicePage * servicePageSize
  );

  const servicePageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalServicePages <= 6) {
      for (let i = 1; i <= totalServicePages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (servicePage > 3) pages.push("…");
      for (let i = Math.max(2, servicePage - 1); i <= Math.min(totalServicePages - 1, servicePage + 1); i++) pages.push(i);
      if (servicePage < totalServicePages - 2) pages.push("…");
      pages.push(totalServicePages);
    }
    return pages;
  }, [servicePage, totalServicePages]);

  const handleDeleteCategory = (id: string) => {
    setSelectedItem(id);
    setShowDeleteModal(true);
  };

  const handleEditCategory = (id: string) => {
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (category) {
      setEditingCategory(category);
      setShowAddCategory(true);
    }
  };

  const handleDeleteService = (id: string) => {
    setSelectedItem(id);
    setShowDeleteModal(true);
  };

  const handleEditService = (id: string) => {
    const service = MOCK_SERVICES.find(s => s.id === id);
    if (service) {
      setEditingService(service);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_SERVICES.length}</p>
              <p className="text-xs text-muted-foreground">{t.totalServices}</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_SERVICES.filter(s => s.is_active).length}</p>
              <p className="text-xs text-muted-foreground">{t.activeServices}</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_CATEGORIES.length}</p>
              <p className="text-xs text-muted-foreground">{t.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Tabs */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "categories" ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
                  style={activeTab === "categories" ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                >
                  {t.allCategories}
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "services" ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
                  style={activeTab === "services" ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                >
                  {t.allService}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.search}
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setCategoryPage(1);
                      setServicePage(1);
                    }}
                    className="pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground w-48"
                  />
                </div>
                {activeTab === "categories" && (
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:opacity-90"
                    style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
                  >
                    <Plus size={16} />
                    {t.addNewCategory}
                  </button>
                )}
              </div>
            </div>

            {/* Categories Grid */}
            {activeTab === "categories" && (
              <>
                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedCategories.map((cat) => (
                      <div key={cat.id} className="bg-muted/30 rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm">
                            <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-center w-full">
                            <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{cat.serviceCount} services</p>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditCategory(cat.id)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Pagination */}
                {filteredCategories.length > 0 && (
                  <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{t.showResult}</span>
                      <select
                        value={categoryPageSize}
                        onChange={(e) => {
                          setCategoryPageSize(Number(e.target.value));
                          setCategoryPage(1);
                        }}
                        className="px-2.5 py-1 border border-border rounded-lg text-sm font-medium text-foreground bg-card"
                      >
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCategoryPage(p => Math.max(1, p - 1))}
                        disabled={categoryPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {categoryPageNumbers.map((pn, i) =>
                        pn === "…" ? (
                          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                        ) : (
                          <button
                            key={pn}
                            onClick={() => setCategoryPage(pn as number)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${categoryPage === pn ? "text-white shadow-sm" : "border border-border text-muted-foreground hover:bg-muted"}`}
                            style={categoryPage === pn ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                          >
                            {pn}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setCategoryPage(p => Math.min(totalCategoryPages, p + 1))}
                        disabled={categoryPage === totalCategoryPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Services Table */}
            {activeTab === "services" && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.serviceName}</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.categoryName}</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.priceRange}</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.status}</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedServices.map((service) => (
                        <tr
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={service.icon} alt={service.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                              <span className="font-medium text-foreground">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{service.categoryName}</td>
                          <td className="px-5 py-3.5 text-foreground font-medium">${service.priceMin}-${service.priceMax}</td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={service.is_active} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditService(service.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteService(service.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Service Pagination */}
                {filteredServices.length > 0 && (
                  <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{t.showResult}</span>
                      <select
                        value={servicePageSize}
                        onChange={(e) => {
                          setServicePageSize(Number(e.target.value));
                          setServicePage(1);
                        }}
                        className="px-2.5 py-1 border border-border rounded-lg text-sm font-medium text-foreground bg-card"
                      >
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setServicePage(p => Math.max(1, p - 1))}
                        disabled={servicePage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {servicePageNumbers.map((pn, i) =>
                        pn === "…" ? (
                          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                        ) : (
                          <button
                            key={pn}
                            onClick={() => setServicePage(pn as number)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${servicePage === pn ? "text-white shadow-sm" : "border border-border text-muted-foreground hover:bg-muted"}`}
                            style={servicePage === pn ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                          >
                            {pn}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setServicePage(p => Math.min(totalServicePages, p + 1))}
                        disabled={servicePage === totalServicePages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Add New Service (only visible on services tab) */}
          {activeTab === "services" && (
            <AddServiceForm
              lang={lang}
              editingService={editingService}
              onSaveComplete={() => setEditingService(null)}
            />
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <AddCategoryModal
          lang={lang}
          editingCategory={editingCategory}
          onClose={() => {
            setShowAddCategory(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t.confirmDelete}</h3>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  console.log("Deleting:", selectedItem);
                  setShowDeleteModal(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={lang === "EN" ? "Service Details" : "Détails du service"}
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            {/* Service Header */}
            <div className="flex items-start gap-4">
              <img
                src={selectedService.coverImage}
                alt={selectedService.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-border"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">{selectedService.name}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {lang === "EN" ? "Category" : "Catégorie"}: {selectedService.categoryName}
                  </span>
                  <StatusBadge status={selectedService.is_active} />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">
                    {lang === "EN" ? "Price Range" : "Fourchette"}
                  </p>
                </div>
                <p className="text-lg font-bold text-blue-700">
                  ${selectedService.priceMin}-${selectedService.priceMax}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">
                    {lang === "EN" ? "Artisans" : "Artisans"}
                  </p>
                </div>
                <p className="text-lg font-bold text-green-700">{selectedService.assignedArtisans}</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-orange-600 font-medium">
                    {lang === "EN" ? "Bookings" : "Réservations"}
                  </p>
                </div>
                <p className="text-lg font-bold text-orange-700">{selectedService.activeBookings}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-purple-600 font-medium">
                    {lang === "EN" ? "Duration" : "Durée"}
                  </p>
                </div>
                <p className="text-lg font-bold text-purple-700">{selectedService.estimatedDuration}</p>
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Service Description" : "Description du service"}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {lang === "EN" ? "Priority Level" : "Niveau de priorité"}
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedService.priority === "Urgent"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {selectedService.priority}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {lang === "EN" ? "Completion Time" : "Temps d'achèvement"}
                  </p>
                  <p className="text-sm font-medium text-foreground">{selectedService.completionTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

function AddServiceForm({ lang, editingService, onSaveComplete }: { lang: Language; editingService: Service | null; onSaveComplete: () => void }) {
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [priority, setPriority] = useState<"Normal" | "Urgent">("Normal");
  const [isActive, setIsActive] = useState(true);
  const [priceMin, setPriceMin] = useState(40);
  const [priceMax, setPriceMax] = useState(200);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [serviceIcon, setServiceIcon] = useState<string | null>(null);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const MAX_PRICE = 500;

  // Initialize form with editing data
  useEffect(() => {
    if (editingService) {
      setServiceName(editingService.name);
      setCategory(editingService.category);
      setDescription(editingService.description);
      setCompletionTime(editingService.completionTime);
      setPriority(editingService.priority);
      setIsActive(editingService.is_active);
      setPriceMin(editingService.priceMin);
      setPriceMax(editingService.priceMax);
      setCoverImage(editingService.coverImage);
      setServiceIcon(editingService.icon);
    } else {
      // Reset to defaults when not editing
      setServiceName("");
      setCategory("");
      setDescription("");
      setCompletionTime("");
      setPriority("Normal");
      setIsActive(true);
      setPriceMin(40);
      setPriceMax(200);
      setCoverImage(null);
      setServiceIcon(null);
    }
  }, [editingService]);

  const t = {
    addNewService: editingService ? (lang === "EN" ? "Edit Service" : "Modifier le service") : (lang === "EN" ? "Add New Service" : "Ajouter un service"),
    serviceCategoryName: lang === "EN" ? "Service Category Name" : "Nom de la catégorie",
    coverImage: lang === "EN" ? "Cover Image" : "Image de couverture",
    serviceIcon: lang === "EN" ? "Service Icon" : "Icône du service",
    shortDescription: lang === "EN" ? "Short Description" : "Description courte",
    priceRange: lang === "EN" ? "Price Range" : "Fourchette de prix",
    completionTime: lang === "EN" ? "Completion Time" : "Temps de réalisation",
    priority: lang === "EN" ? "Priority" : "Priorité",
    active: lang === "EN" ? "Active" : "Actif",
    saveService: lang === "EN" ? "Save Service" : "Enregistrer le service",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    clickToUpload: lang === "EN" ? "Click to upload image" : "Cliquer pour télécharger",
    imageFormat: lang === "EN" ? "JPG, PNG, SVG • Max 2MB" : "JPG, PNG, SVG • Max 2Mo",
    descPlaceholder: lang === "EN" ? "Describe this service category..." : "Décrire cette catégorie...",
    characters: lang === "EN" ? "characters" : "caractères",
    timePlaceholder: lang === "EN" ? "e.g. 2 hour" : "ex: 2 heures",
    categoryPlaceholder: lang === "EN" ? "e.g. Repair & Maintenance" : "ex: Réparation & Maintenance",
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'min') setIsDraggingMin(true);
    else setIsDraggingMax(true);
  };

  // Set up mouse event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin && !isDraggingMax) return;
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const value = Math.round(percentage * MAX_PRICE);

      if (isDraggingMin) {
        setPriceMin(Math.min(value, priceMax - 10));
      } else if (isDraggingMax) {
        setPriceMax(Math.max(value, priceMin + 10));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingMin, isDraggingMax, priceMin, priceMax]);

  const handleSave = () => {
    console.log(editingService ? "Updating service:" : "Creating service:", {
      id: editingService?.id,
      serviceName,
      category,
      description,
      completionTime,
      priority,
      isActive,
      priceMin,
      priceMax,
      coverImage,
      serviceIcon,
    });
    onSaveComplete();
  };

  const minPosition = (priceMin / MAX_PRICE) * 100;
  const maxPosition = (priceMax / MAX_PRICE) * 100;

  return (
    <div className="w-full lg:w-[386px] bg-card rounded-2xl shadow-sm border border-[#f3f4f6] p-5 space-y-6 lg:sticky lg:top-4 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-[#101828] font-['Inter',sans-serif]">{t.addNewService}</h3>

      {/* Service Category Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.serviceCategoryName}
        </label>
        <input
          type="text"
          placeholder={t.categoryPlaceholder}
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-[#d1d5dc] rounded-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-base text-[rgba(10,10,10,0.5)] font-['Inter',sans-serif]"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.coverImage}
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className="relative h-[166px] border border-dashed border-[#d1d5dc] rounded-[14px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
        >
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover rounded-[14px]" />
          ) : (
            <>
              <div className="w-12 h-12 mb-2">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48">
                  <path d="M40 24C40 18.7 38.8 16 36 16C33.2 16 32 18.7 32 24C32 29.3 33.2 32 36 32C38.8 32 40 29.3 40 24Z" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 24C16 29.3 14.8 32 12 32C9.2 32 8 29.3 8 24C8 18.7 9.2 16 12 16C14.8 16 16 18.7 16 24Z" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 6V30" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-[#4a5565] font-['Inter',sans-serif] mb-1">{t.clickToUpload}</p>
              <p className="text-xs text-[#6a7282] font-['Inter',sans-serif]">{t.imageFormat}</p>
            </>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="hidden"
        />
      </div>

      {/* Service Icon */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.serviceIcon}
        </label>
        <div
          onClick={() => iconInputRef.current?.click()}
          className="relative h-[166px] border border-dashed border-[#d1d5dc] rounded-[14px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
        >
          {serviceIcon ? (
            <img src={serviceIcon} alt="Icon" className="w-full h-full object-cover rounded-[14px]" />
          ) : (
            <>
              <div className="w-12 h-12 mb-2">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48">
                  <path d="M40 24C40 18.7 38.8 16 36 16C33.2 16 32 18.7 32 24C32 29.3 33.2 32 36 32C38.8 32 40 29.3 40 24Z" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 24C16 29.3 14.8 32 12 32C9.2 32 8 29.3 8 24C8 18.7 9.2 16 12 16C14.8 16 16 18.7 16 24Z" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 6V30" stroke="#99A1AF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-[#4a5565] font-['Inter',sans-serif] mb-1">{t.clickToUpload}</p>
              <p className="text-xs text-[#6a7282] font-['Inter',sans-serif]">{t.imageFormat}</p>
            </>
          )}
        </div>
        <input
          ref={iconInputRef}
          type="file"
          accept="image/*"
          onChange={handleServiceIconChange}
          className="hidden"
        />
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.shortDescription}
        </label>
        <textarea
          rows={4}
          placeholder={t.descPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          className="w-full px-4 py-2.5 bg-white border border-[#d1d5dc] rounded-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-base text-[rgba(10,10,10,0.5)] font-['Inter',sans-serif] resize-none"
        />
        <p className="text-xs text-[#6a7282] text-right font-['Inter',sans-serif]">
          {description.length}/200 {t.characters}
        </p>
      </div>

      {/* Price Range with Dual Slider */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.priceRange}
        </label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#0a131f] font-['Inter',sans-serif]">${priceMin}</span>
            <span className="text-sm font-medium text-[#0a131f] font-['Inter',sans-serif]">${priceMax}</span>
          </div>
          <div ref={sliderRef} className="relative h-4 py-1.5 cursor-pointer" style={{ userSelect: 'none' }}>
            {/* Background track */}
            <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full bg-[#0A131F] rounded-full" />
            {/* Active track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#1B457C] rounded-full pointer-events-none"
              style={{
                left: `${minPosition}%`,
                width: `${maxPosition - minPosition}%`,
              }}
            />
            {/* Min handle */}
            <div
              className="absolute top-1/2 w-3.5 h-3.5 bg-[#A3B4C9] rounded-full cursor-grab active:cursor-grabbing z-10 transition-shadow hover:shadow-md hover:scale-110"
              style={{
                left: `${minPosition}%`,
                transform: 'translate(-50%, -50%)',
                cursor: isDraggingMin ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown('min')}
            />
            {/* Max handle */}
            <div
              className="absolute top-1/2 w-3.5 h-3.5 bg-[#A3B4C9] rounded-full cursor-grab active:cursor-grabbing z-10 transition-shadow hover:shadow-md hover:scale-110"
              style={{
                left: `${maxPosition}%`,
                transform: 'translate(-50%, -50%)',
                cursor: isDraggingMax ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown('max')}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#6a7282]">
            <span>$0</span>
            <span>$500</span>
          </div>
        </div>
      </div>

      {/* Completion Time */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.completionTime}
        </label>
        <input
          type="text"
          placeholder={t.timePlaceholder}
          value={completionTime}
          onChange={(e) => setCompletionTime(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-[#d1d5dc] rounded-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-base text-[rgba(10,10,10,0.5)] font-['Inter',sans-serif]"
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#364153] font-['Inter',sans-serif]">
          {t.priority}
        </label>
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "Normal" | "Urgent")}
            className="w-full px-4 py-2.5 bg-white border border-[#d1d5dc] rounded-[14px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-base text-[#6c7a92] font-['Inter',sans-serif] appearance-none"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6c7a92] pointer-events-none" />
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-[#364153] font-['Inter',sans-serif]">{t.active}</span>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isActive ? 'bg-[#1b457c]' : 'bg-gray-300'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#1a3a6b] text-white rounded-[14px] text-base font-medium hover:opacity-90 transition-colors font-['Inter',sans-serif]"
        >
          {t.saveService}
        </button>
        <button
          onClick={() => {
            setServiceName("");
            setCategory("");
            setDescription("");
            setCompletionTime("");
            setPriority("Normal");
            setIsActive(true);
            setPriceMin(40);
            setPriceMax(200);
            setCoverImage(null);
            setServiceIcon(null);
            onSaveComplete();
          }}
          className="w-full py-3 border border-[#d1d5dc] rounded-[14px] text-base font-medium text-[#364153] hover:bg-muted transition-colors font-['Inter',sans-serif]"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

function AddCategoryModal({ lang, editingCategory, onClose }: { lang: Language; editingCategory: Category | null; onClose: () => void }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null);
  const [order, setOrder] = useState(MOCK_CATEGORIES.length + 1);
  const [isActive, setIsActive] = useState(true);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with editing data
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setCategoryIcon(editingCategory.icon);
      setOrder(editingCategory.order);
      setIsActive(editingCategory.is_active);
    } else {
      setCategoryName("");
      setCategoryIcon(null);
      setOrder(MOCK_CATEGORIES.length + 1);
      setIsActive(true);
    }
  }, [editingCategory]);

  const t = {
    title: editingCategory ? (lang === "EN" ? "Edit Category" : "Modifier la catégorie") : (lang === "EN" ? "Add New Category" : "Ajouter une catégorie"),
    categoryName: lang === "EN" ? "Category Name" : "Nom de la catégorie",
    icon: lang === "EN" ? "Category Icon" : "Icône",
    order: lang === "EN" ? "Display Order" : "Ordre d'affichage",
    active: lang === "EN" ? "Active" : "Actif",
    save: lang === "EN" ? "Save Category" : "Enregistrer",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    dragDrop: lang === "EN" ? "Click to select icon" : "Cliquer pour sélectionner",
    maxSize: lang === "EN" ? "PNG, JPG, SVG, max 1 MB" : "PNG, JPG, SVG, max 1 Mo",
    orderHelper: lang === "EN" ? "Lower numbers appear first" : "Les petits numéros apparaissent en premier",
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log(editingCategory ? "Updating category:" : "Creating category:", {
      id: editingCategory?.id,
      categoryName,
      categoryIcon,
      order,
      isActive
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.categoryName}</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.icon}</label>
            <div
              onClick={() => iconInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {categoryIcon ? (
                <img src={categoryIcon} alt="Category icon" className="w-20 h-20 mx-auto rounded-lg object-cover" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-foreground mb-1">{t.dragDrop}</p>
                  <p className="text-xs text-muted-foreground">{t.maxSize}</p>
                </>
              )}
            </div>
            <input
              ref={iconInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.order}</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">{t.orderHelper}</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground">{t.active}</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:opacity-90"
            style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
