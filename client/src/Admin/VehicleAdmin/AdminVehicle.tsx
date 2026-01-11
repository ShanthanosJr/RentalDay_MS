import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './AdminVehicle.css';

interface Vehicle {
    id: string;
    vehicleId: string;
    make: string;
    model: string;
    manufacturedYear: number;
    registrationYear: number;
    specifications: string;
    mileage: number;
    engine: string;
    fuelType: string;
    gear: string;
    options: string;
    price: number;
    description: string;
    imageUrl: string;
}

interface NewVehicle {
    vehicleId: string;
    make: string;
    model: string;
    manufacturedYear: string;
    registrationYear: string;
    specifications: string;
    mileage: string;
    engine: string;
    fuelType: string;
    gear: string;
    options: string;
    price: string;
    description: string;
    imageUrl: string;
}

interface EditVehicleForm extends NewVehicle {
    id: string;
}

type TabKey = 'overview' | 'cards' | 'grid';

const generateVehicleId = () =>
    `VEH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const AdminVehicle: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    const [search, setSearch] = useState('');
    const [fuelFilter, setFuelFilter] = useState<'all' | string>('all');
    const [yearFilter, setYearFilter] = useState<'all' | string>('all');

    const [cardsSearch, setCardsSearch] = useState('');
    const [cardsFuelFilter, setCardsFuelFilter] = useState<'all' | string>('all');

    const [gridSearch, setGridSearch] = useState('');
    const [gridFuelFilter, setGridFuelFilter] = useState<'all' | string>('all');
    const [gridYearFilter, setGridYearFilter] = useState<'all' | string>('all');

    const [carouselIndex, setCarouselIndex] = useState(0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [newVehicle, setNewVehicle] = useState<NewVehicle>({
        vehicleId: generateVehicleId(),
        make: '',
        model: '',
        manufacturedYear: '',
        registrationYear: '',
        specifications: '',
        mileage: '',
        engine: '',
        fuelType: '',
        gear: '',
        options: '',
        price: '',
        description: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [editVehicle, setEditVehicle] = useState<EditVehicleForm | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);

    // ===== Fetch vehicles (same endpoint style as AdminDashboard) =====
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const res = await axios.get<Vehicle[]>('/api/vehicles');
            setVehicles(res.data);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // ===== Overview filters =====
    const filteredOverviewVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const term = search.toLowerCase();
            const matchesSearch =
                v.make.toLowerCase().includes(term) ||
                v.model.toLowerCase().includes(term) ||
                v.vehicleId.toLowerCase().includes(term);

            const matchesFuel =
                fuelFilter === 'all' ? true : v.fuelType.toLowerCase() === fuelFilter.toLowerCase();

            const matchesYear =
                yearFilter === 'all'
                    ? true
                    : String(v.manufacturedYear) === String(yearFilter);

            return matchesSearch && matchesFuel && matchesYear;
        });
    }, [vehicles, search, fuelFilter, yearFilter]);

    // ===== Cards view filters =====
    const filteredCardsVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const term = cardsSearch.toLowerCase();
            const matchesSearch =
                v.make.toLowerCase().includes(term) ||
                v.model.toLowerCase().includes(term) ||
                v.vehicleId.toLowerCase().includes(term);

            const matchesFuel =
                cardsFuelFilter === 'all'
                    ? true
                    : v.fuelType.toLowerCase() === cardsFuelFilter.toLowerCase();

            return matchesSearch && matchesFuel;
        });
    }, [vehicles, cardsSearch, cardsFuelFilter]);

    useEffect(() => {
        if (filteredCardsVehicles.length === 0) {
            setCarouselIndex(0);
        } else if (carouselIndex >= filteredCardsVehicles.length) {
            setCarouselIndex(filteredCardsVehicles.length - 1);
        }
    }, [filteredCardsVehicles, carouselIndex]);

    // ===== Grid filters =====
    const filteredGridVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const term = gridSearch.toLowerCase();
            const matchesSearch =
                v.make.toLowerCase().includes(term) ||
                v.model.toLowerCase().includes(term) ||
                v.vehicleId.toLowerCase().includes(term);

            const matchesFuel =
                gridFuelFilter === 'all'
                    ? true
                    : v.fuelType.toLowerCase() === gridFuelFilter.toLowerCase();

            const matchesYear =
                gridYearFilter === 'all'
                    ? true
                    : String(v.manufacturedYear) === String(gridYearFilter);

            return matchesSearch && matchesFuel && matchesYear;
        });
    }, [vehicles, gridSearch, gridFuelFilter, gridYearFilter]);

    // ===== Stats =====
    const totalVehicles = vehicles.length;
    const avgPrice =
        vehicles.length > 0
            ? vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length
            : 0;
    const avgMileage =
        vehicles.length > 0
            ? vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length
            : 0;

    const fuelCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        vehicles.forEach(v => {
            const key = v.fuelType || 'Unknown';
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }, [vehicles]);

    const yearCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        vehicles.forEach(v => {
            counts[v.manufacturedYear] = (counts[v.manufacturedYear] || 0) + 1;
        });
        return counts;
    }, [vehicles]);

    const trendData = useMemo(() => {
        return Object.entries(yearCounts)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([year, count]) => ({ year: Number(year), count }));
    }, [yearCounts]);

    const maxYearCount =
        trendData.length > 0 ? Math.max(...trendData.map(d => d.count)) : 1;

    const maxFuelCount =
        Object.keys(fuelCounts).length > 0
            ? Math.max(...Object.values(fuelCounts))
            : 1;

    // ===== Forms =====
    const handleNewInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewVehicle(prev => ({ ...prev, [name]: value }));
    };

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setNewVehicle(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
        }
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEditVehicle(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editVehicle) {
            setEditImageFile(file);
            setEditVehicle(prev =>
                prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : prev
            );
        }
    };

    // ===== CRUD =====
    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(newVehicle).forEach(([k, v]) => formData.append(k, v));
            if (imageFile) formData.append('image', imageFile);

            const res = await axios.post('/api/vehicles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.status === 201) {
                await fetchVehicles();
                setShowAddModal(false);
                setNewVehicle({
                    vehicleId: generateVehicleId(),
                    make: '',
                    model: '',
                    manufacturedYear: '',
                    registrationYear: '',
                    specifications: '',
                    mileage: '',
                    engine: '',
                    fuelType: '',
                    gear: '',
                    options: '',
                    price: '',
                    description: '',
                    imageUrl: ''
                });
                setImageFile(null);
            }
        } catch (err) {
            console.error('Error adding vehicle:', err);
        }
    };

    const openEditModal = (v: Vehicle) => {
        setEditVehicle({
            id: v.id,
            vehicleId: v.vehicleId,
            make: v.make,
            model: v.model,
            manufacturedYear: String(v.manufacturedYear),
            registrationYear: String(v.registrationYear),
            specifications: v.specifications,
            mileage: String(v.mileage),
            engine: v.engine,
            fuelType: v.fuelType,
            gear: v.gear,
            options: v.options,
            price: String(v.price),
            description: v.description,
            imageUrl: v.imageUrl
        });
        setEditImageFile(null);
        setShowEditModal(true);
    };

    const handleUpdateVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editVehicle) return;
        try {
            const formData = new FormData();
            formData.append('vehicleId', editVehicle.vehicleId);
            formData.append('make', editVehicle.make);
            formData.append('model', editVehicle.model);
            formData.append('manufacturedYear', editVehicle.manufacturedYear);
            formData.append('registrationYear', editVehicle.registrationYear);
            formData.append('specifications', editVehicle.specifications);
            formData.append('mileage', editVehicle.mileage);
            formData.append('engine', editVehicle.engine);
            formData.append('fuelType', editVehicle.fuelType);
            formData.append('gear', editVehicle.gear);
            formData.append('options', editVehicle.options);
            formData.append('price', editVehicle.price);
            formData.append('description', editVehicle.description);
            if (editImageFile) formData.append('image', editImageFile);

            const res = await axios.put(`/api/vehicles/${editVehicle.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.status === 200) {
                await fetchVehicles();
                setShowEditModal(false);
                setEditVehicle(null);
                setEditImageFile(null);
            }
        } catch (err) {
            console.error('Error updating vehicle:', err);
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await axios.delete(`/api/vehicles/${id}`);
            await fetchVehicles();
        } catch (err) {
            console.error('Error deleting vehicle:', err);
        }
    };

    // ===== Cards carousel =====
    const goPrev = () => {
        if (filteredCardsVehicles.length === 0) return;
        setCarouselIndex(prev =>
            prev === 0 ? filteredCardsVehicles.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        if (filteredCardsVehicles.length === 0) return;
        setCarouselIndex(prev =>
            prev === filteredCardsVehicles.length - 1 ? 0 : prev + 1
        );
    };

    const currentCarouselVehicle =
        filteredCardsVehicles.length > 0
            ? filteredCardsVehicles[carouselIndex]
            : null;

    // ===== Render =====
    return (
        <main className="dagestan-vehicle-admin">
            {/* Top title bar */}
            <section className="dagestan-section dagestan-vehicle-top">
                <div className="dagestan-section-inner">
                    <div className="dagestan-section-header">
                        <span className="dagestan-section-label">Admin · Vehicles</span>
                        <div>
                            <h2 className="dagestan-section-title">RentalDay fleet control</h2>
                            <h3 className="dagestan-section-subtitle">
                                a premium overview of every engine and journey
                            </h3>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="admin-vehicle-tabs">
                        <button
                            className={
                                'admin-vehicle-tab ' +
                                (activeTab === 'overview' ? 'active' : '')
                            }
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={
                                'admin-vehicle-tab ' + (activeTab === 'cards' ? 'active' : '')
                            }
                            onClick={() => setActiveTab('cards')}
                        >
                            Cards view
                        </button>
                        <button
                            className={
                                'admin-vehicle-tab ' + (activeTab === 'grid' ? 'active' : '')
                            }
                            onClick={() => setActiveTab('grid')}
                        >
                            Grid view
                        </button>
                    </div>
                </div>
            </section>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <>
                    <section className="dagestan-section">
                        <div className="dagestan-section-inner">
                            <p className="admin-vehicle-intro">
                                Use the overview to understand your fleet’s composition, trends, and
                                daily rates before diving into individual vehicles. This space mirrors
                                the calm structure of Dagestan’s valleys: clear, layered, and easy to
                                navigate.
                            </p>

                            {/* Stats + charts */}
                            <div className="admin-vehicle-grid">
                                <div className="admin-vehicle-stats">
                                    <div className="admin-vehicle-card">
                                        <span className="admin-vehicle-card-label">
                                            Total vehicles
                                        </span>
                                        <strong className="admin-vehicle-card-value">
                                            {loading ? '...' : totalVehicles}
                                        </strong>
                                        <span className="admin-vehicle-card-hint">
                                            Active items in your fleet
                                        </span>
                                    </div>
                                    <div className="admin-vehicle-card">
                                        <span className="admin-vehicle-card-label">
                                            Average price / day
                                        </span>
                                        <strong className="admin-vehicle-card-value">
                                            {loading ? '...' : `$${avgPrice.toFixed(0)}`}
                                        </strong>
                                        <span className="admin-vehicle-card-hint">
                                            Across all available vehicles
                                        </span>
                                    </div>
                                    <div className="admin-vehicle-card">
                                        <span className="admin-vehicle-card-label">
                                            Average mileage
                                        </span>
                                        <strong className="admin-vehicle-card-value">
                                            {loading ? '...' : `${avgMileage.toFixed(0)} km`}
                                        </strong>
                                        <span className="admin-vehicle-card-hint">
                                            Total distance travelled on average
                                        </span>
                                    </div>
                                </div>

                                {/* Bar chart */}
                                <div className="admin-vehicle-chart admin-vehicle-chart-bar">
                                    <div className="chart-header">
                                        <span className="dagestan-section-label">Timeline</span>
                                        <h4 className="chart-title">Fleet by year</h4>
                                    </div>
                                    {trendData.length === 0 ? (
                                        <p className="chart-empty">No data yet</p>
                                    ) : (
                                        <div className="bar-chart">
                                            {trendData.map(d => (
                                                <div key={d.year} className="bar-item">
                                                    <div
                                                        className="bar-inner"
                                                        style={{
                                                            height: `${(d.count / maxYearCount) * 100 || 10}%`
                                                        }}
                                                    >
                                                        <span className="bar-value">{d.count}</span>
                                                    </div>
                                                    <span className="bar-label">{d.year}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Pie chart */}
                                <div className="admin-vehicle-chart admin-vehicle-chart-pie">
                                    <div className="chart-header">
                                        <span className="dagestan-section-label">Fuel mix</span>
                                        <h4 className="chart-title">By fuel type</h4>
                                    </div>
                                    {Object.keys(fuelCounts).length === 0 ? (
                                        <p className="chart-empty">No data yet</p>
                                    ) : (
                                        <div className="pie-chart-wrapper">
                                            <svg viewBox="0 0 32 32" className="pie-chart">
                                                {(() => {
                                                    const total = Object.values(fuelCounts).reduce(
                                                        (sum, v) => sum + v,
                                                        0
                                                    );
                                                    let cumulative = 0;
                                                    const colors = [
                                                        '#1f2933',
                                                        '#3b4252',
                                                        '#4c566a',
                                                        '#6b7280',
                                                        '#9ca3af'
                                                    ];
                                                    return Object.entries(fuelCounts).map(
                                                        ([fuel, count], i) => {
                                                            const value = count / total;
                                                            const [startX, startY] = [
                                                                Math.cos(2 * Math.PI * cumulative),
                                                                Math.sin(2 * Math.PI * cumulative)
                                                            ];
                                                            cumulative += value;
                                                            const [endX, endY] = [
                                                                Math.cos(2 * Math.PI * cumulative),
                                                                Math.sin(2 * Math.PI * cumulative)
                                                            ];
                                                            const largeArc = value > 0.5 ? 1 : 0;
                                                            const pathData = `
                                M 16 16
                                L ${16 + startX * 16} ${16 + startY * 16}
                                A 16 16 0 ${largeArc} 1 ${16 + endX * 16} ${16 + endY * 16
                                                                }
                                Z
                              `;
                                                            return (
                                                                <path
                                                                    key={fuel}
                                                                    d={pathData}
                                                                    fill={colors[i % colors.length]}
                                                                />
                                                            );
                                                        }
                                                    );
                                                })()}
                                            </svg>
                                            <div className="pie-legend">
                                                {Object.entries(fuelCounts).map(([fuel, count]) => (
                                                    <div key={fuel} className="pie-legend-item">
                                                        <span className="pie-dot" />
                                                        <span className="pie-label">
                                                            {fuel} · {count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Trend chart */}
                                <div className="admin-vehicle-chart admin-vehicle-chart-trend">
                                    <div className="chart-header">
                                        <span className="dagestan-section-label">Pricing</span>
                                        <h4 className="chart-title">Price trend by year</h4>
                                    </div>
                                    {trendData.length === 0 ? (
                                        <p className="chart-empty">No data yet</p>
                                    ) : (
                                        <div className="trend-chart">
                                            <svg viewBox="0 0 100 40" className="trend-svg">
                                                {(() => {
                                                    const minYear = Math.min(
                                                        ...trendData.map(d => d.year)
                                                    );
                                                    const maxYear = Math.max(
                                                        ...trendData.map(d => d.year)
                                                    );
                                                    const span = maxYear - minYear || 1;
                                                    const maxCountLocal = maxYearCount || 1;

                                                    const points = trendData.map(d => {
                                                        const x =
                                                            ((d.year - minYear) / span) * 100;
                                                        const y =
                                                            40 - (d.count / maxCountLocal) * 35 - 2;
                                                        return `${x},${y}`;
                                                    });

                                                    return (
                                                        <>
                                                            <polyline
                                                                fill="none"
                                                                stroke="hsl(var(--foreground))"
                                                                strokeWidth="1.5"
                                                                points={points.join(' ')}
                                                            />
                                                            {trendData.map(d => {
                                                                const x =
                                                                    ((d.year - minYear) / span) * 100;
                                                                const y =
                                                                    40 -
                                                                    (d.count / maxCountLocal) * 35 -
                                                                    2;
                                                                return (
                                                                    <circle
                                                                        key={d.year}
                                                                        cx={x}
                                                                        cy={y}
                                                                        r={1.5}
                                                                        fill="hsl(var(--primary))"
                                                                    />
                                                                );
                                                            })}
                                                        </>
                                                    );
                                                })()}
                                            </svg>
                                            <div className="trend-legend">
                                                {trendData.map(d => (
                                                    <span key={d.year}>
                                                        {d.year} · {d.count}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Overview filters + Add section */}
                    {/*<section className="dagestan-section dagestan-vehicle-filters">
            <div className="dagestan-section-inner">
              <div className="filters-row">
                <div className="filters-search">
                  <label className="filters-label">Search overview</label>
                  <div className="filters-input-wrapper">
                    <i className="bi bi-search" />
                    <input
                      type="text"
                      placeholder="Search fleet by make, model or ID"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filters-select">
                  <label className="filters-label">Fuel type</label>
                  <select
                    value={fuelFilter}
                    onChange={e => setFuelFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    {Object.keys(fuelCounts).map(f => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filters-select">
                  <label className="filters-label">Year</label>
                  <select
                    value={yearFilter}
                    onChange={e => setYearFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    {Object.keys(yearCounts)
                      .sort()
                      .map(y => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="filters-add">
                  <button
                    className="dagestan-pricing-btn"
                    onClick={() => {
                      setNewVehicle(prev => ({
                        ...prev,
                        vehicleId: generateVehicleId()
                      }));
                      setImageFile(null);
                      setShowAddModal(true);
                    }}
                  >
                    Add new vehicle
                  </button>
                </div>
              </div>
            </div>
          </section>*/}
                </>
            )}

            {/* CARDS VIEW TAB */}
            {activeTab === 'cards' && (
                <section className="dagestan-section admin-vehicle-cards">
                    <div className="dagestan-section-inner">
                        <div className="dagestan-section-header">
                            <span className="dagestan-section-label">Cards view</span>
                            <div>
                                <h2 className="dagestan-section-title">
                                    Visual fleet carousel
                                </h2>
                                <h3 className="dagestan-section-subtitle">
                                    swipe between vehicles like peaks on the horizon
                                </h3>
                            </div>
                        </div>

                        {/* Cards filters */}
                        <div className="filters-row cards-filters">
                            <div className="filters-search">
                                <label className="filters-label">Search cards</label>
                                <div className="filters-input-wrapper">
                                    <i className="bi bi-search" />
                                    <input
                                        type="text"
                                        placeholder="Filter by make, model or ID"
                                        value={cardsSearch}
                                        onChange={e => setCardsSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filters-select">
                                <label className="filters-label">Fuel</label>
                                <select
                                    value={cardsFuelFilter}
                                    onChange={e => setCardsFuelFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    {Object.keys(fuelCounts).map(f => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Carousel */}
                        <div className="dagestan-carousel admin-vehicle-carousel">
                            <div className="dagestan-carousel-container">
                                <div className="dagestan-carousel-bg-text">
                                    <span>FLEET</span>
                                </div>

                                <div className="dagestan-carousel-cards admin-vehicle-carousel-cards">
                                    {currentCarouselVehicle ? (
                                        <div className="dagestan-carousel-card admin-vehicle-carousel-card">
                                            <img
                                                src={
                                                    currentCarouselVehicle.imageUrl ||
                                                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&fit=crop'
                                                }
                                                alt={`${currentCarouselVehicle.make} ${currentCarouselVehicle.model}`}
                                            />
                                            <div className="admin-vehicle-carousel-info">
                                                <h4>
                                                    {currentCarouselVehicle.make}{' '}
                                                    {currentCarouselVehicle.model}
                                                </h4>
                                                <p>
                                                    {currentCarouselVehicle.description ||
                                                        'No description specified for this vehicle.'}
                                                </p>
                                                <div className="admin-vehicle-carousel-meta">
                                                    <span>
                                                        {currentCarouselVehicle.manufacturedYear} ·{' '}
                                                        {currentCarouselVehicle.fuelType}
                                                    </span>
                                                    <span>
                                                        {currentCarouselVehicle.mileage} km ·{' '}
                                                        {currentCarouselVehicle.gear}
                                                    </span>
                                                </div>
                                                <div className="admin-vehicle-carousel-footer">
                                                    <div className="admin-vehicle-carousel-price">
                                                        <span>from</span>
                                                        <strong>
                                                            ${currentCarouselVehicle.price}
                                                        </strong>
                                                        <span>/day</span>
                                                    </div>
                                                    <div className="admin-vehicle-carousel-actions">
                                                        <button
                                                            className="dagestan-tour-btn"
                                                            onClick={() =>
                                                                openEditModal(currentCarouselVehicle)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="dagestan-tour-btn admin-vehicle-delete"
                                                            onClick={() =>
                                                                handleDeleteVehicle(
                                                                    currentCarouselVehicle.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="chart-empty">
                                            No vehicles match your cards filters.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={goPrev}
                                    className="dagestan-carousel-arrow left"
                                    aria-label="Previous vehicle"
                                >
                                    <i className="bi bi-chevron-left" style={{ fontSize: 24 }} />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="dagestan-carousel-arrow right"
                                    aria-label="Next vehicle"
                                >
                                    <i className="bi bi-chevron-right" style={{ fontSize: 24 }} />
                                </button>
                            </div>

                            <div className="dagestan-carousel-dots">
                                {filteredCardsVehicles.map((v, idx) => (
                                    <button
                                        key={v.id}
                                        className={
                                            'dagestan-carousel-dot ' +
                                            (idx === carouselIndex ? 'active' : '')
                                        }
                                        onClick={() => setCarouselIndex(idx)}
                                        aria-label={`Go to vehicle ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* GRID VIEW TAB */}
            {activeTab === 'grid' && (
                <section className="dagestan-section admin-vehicle-grid-view">
                    <div className="dagestan-section-inner">
                        <div className="dagestan-section-header">
                            <span className="dagestan-section-label">Grid view</span>
                            <div>
                                <h2 className="dagestan-section-title">
                                    Detailed table of vehicles
                                </h2>
                                <h3 className="dagestan-section-subtitle">
                                    precise control in a structured valley of rows
                                </h3>
                            </div>
                        </div>

                        {/* Grid filters */}
                        <div className="filters-row grid-filters">
                            <div className="filters-search">
                                <label className="filters-label">Search grid</label>
                                <div className="filters-input-wrapper">
                                    <i className="bi bi-search" />
                                    <input
                                        type="text"
                                        placeholder="Search by make, model, ID"
                                        value={gridSearch}
                                        onChange={e => setGridSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filters-select">
                                <label className="filters-label">Fuel type</label>
                                <select
                                    value={gridFuelFilter}
                                    onChange={e => setGridFuelFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    {Object.keys(fuelCounts).map(f => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filters-select">
                                <label className="filters-label">Year</label>
                                <select
                                    value={gridYearFilter}
                                    onChange={e => setGridYearFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    {Object.keys(yearCounts)
                                        .sort()
                                        .map(y => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="admin-vehicle-table-wrapper">
                            {filteredGridVehicles.length === 0 ? (
                                <p className="chart-empty">
                                    No vehicles match your advanced grid filters.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-vehicle-table">
                                        <thead>
                                            <tr>
                                                <th>Vehicle</th>
                                                <th>Years</th>
                                                <th>Specs</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredGridVehicles.map(v => (
                                                <tr key={v.id}>
                                                    <td>
                                                        <div className="admin-vehicle-table-vehicle">
                                                            {v.imageUrl && (
                                                                <img
                                                                    src={v.imageUrl}
                                                                    alt={v.make}
                                                                    className="admin-vehicle-table-img"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="admin-vehicle-table-name">
                                                                    {v.make} {v.model}
                                                                </div>
                                                                <div className="admin-vehicle-table-id">
                                                                    {v.vehicleId}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="admin-vehicle-table-years">
                                                            <span>{v.manufacturedYear}</span>
                                                            <small>{v.registrationYear}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="admin-vehicle-table-specs">
                                                            <span>{v.fuelType}</span>
                                                            <span>{v.gear}</span>
                                                            <span>{v.mileage} km</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="admin-vehicle-table-price">
                                                            ${v.price}/day
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-vehicle-table-actions">
                                                            <button
                                                                className="dagestan-tour-btn"
                                                                onClick={() => openEditModal(v)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="dagestan-tour-btn admin-vehicle-delete"
                                                                onClick={() => handleDeleteVehicle(v.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="dagestan-modal-overlay">
                    <div className="dagestan-modal-container">
                        <div className="dagestan-modal-content">
                            <div className="dagestan-modal-header">
                                <div className="dagestan-modal-title-wrapper">
                                    <span className="dagestan-section-label">Add vehicle</span>
                                    <h2 className="dagestan-modal-title">New fleet member</h2>
                                    <h3 className="dagestan-modal-subtitle">
                                        describe it like a mountain trail
                                    </h3>
                                </div>
                                <button
                                    className="dagestan-modal-close"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    <i className="bi bi-x" />
                                </button>
                            </div>
                            <form onSubmit={handleAddVehicle} className="dagestan-modal-body">
                                <div className="modal-form-grid">
                                    <div className="modal-form-section">
                                        <h4 className="modal-form-title">Basic information</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Vehicle ID</label>
                                                <input
                                                    name="vehicleId"
                                                    value={newVehicle.vehicleId}
                                                    onChange={handleNewInputChange}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Make</label>
                                                <input
                                                    name="make"
                                                    value={newVehicle.make}
                                                    onChange={handleNewInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Model</label>
                                                <input
                                                    name="model"
                                                    value={newVehicle.model}
                                                    onChange={handleNewInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Manufactured year</label>
                                                <input
                                                    type="number"
                                                    name="manufacturedYear"
                                                    value={newVehicle.manufacturedYear}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Registration year</label>
                                                <input
                                                    type="number"
                                                    name="registrationYear"
                                                    value={newVehicle.registrationYear}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-form-section">
                                        <h4 className="modal-form-title">Specs & pricing</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Fuel type</label>
                                                <input
                                                    name="fuelType"
                                                    value={newVehicle.fuelType}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Gear</label>
                                                <input
                                                    name="gear"
                                                    value={newVehicle.gear}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Mileage (km)</label>
                                                <input
                                                    type="number"
                                                    name="mileage"
                                                    value={newVehicle.mileage}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price per day ($)</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={newVehicle.price}
                                                    onChange={handleNewInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Options</label>
                                                <input
                                                    name="options"
                                                    value={newVehicle.options}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-form-section modal-form-section-wide">
                                        <h4 className="modal-form-title">Description & image</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    value={newVehicle.description}
                                                    onChange={handleNewInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Vehicle image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleNewImageChange}
                                                />
                                                {newVehicle.imageUrl && (
                                                    <img
                                                        src={newVehicle.imageUrl}
                                                        alt="Preview"
                                                        className="modal-image-preview"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dagestan-modal-footer">
                                    <button
                                        type="button"
                                        className="dagestan-btn-secondary"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="dagestan-btn-primary">
                                        Create vehicle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editVehicle && (
                <div className="dagestan-modal-overlay">
                    <div className="dagestan-modal-container">
                        <div className="dagestan-modal-content">
                            <div className="dagestan-modal-header">
                                <div className="dagestan-modal-title-wrapper">
                                    <span className="dagestan-section-label">Edit vehicle</span>
                                    <h2 className="dagestan-modal-title">
                                        {editVehicle.make} {editVehicle.model}
                                    </h2>
                                    <h3 className="dagestan-modal-subtitle">
                                        adjust details without losing the mountain view
                                    </h3>
                                </div>
                                <button
                                    className="dagestan-modal-close"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditVehicle(null);
                                        setEditImageFile(null);
                                    }}
                                >
                                    <i className="bi bi-x" />
                                </button>
                            </div>
                            <form
                                onSubmit={handleUpdateVehicle}
                                className="dagestan-modal-body"
                            >
                                <div className="modal-form-grid">
                                    <div className="modal-form-section">
                                        <h4 className="modal-form-title">Basic information</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Vehicle ID</label>
                                                <input
                                                    name="vehicleId"
                                                    value={editVehicle.vehicleId}
                                                    onChange={handleEditInputChange}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Make</label>
                                                <input
                                                    name="make"
                                                    value={editVehicle.make}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Model</label>
                                                <input
                                                    name="model"
                                                    value={editVehicle.model}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Manufactured year</label>
                                                <input
                                                    type="number"
                                                    name="manufacturedYear"
                                                    value={editVehicle.manufacturedYear}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Registration year</label>
                                                <input
                                                    type="number"
                                                    name="registrationYear"
                                                    value={editVehicle.registrationYear}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-form-section">
                                        <h4 className="modal-form-title">Specs & pricing</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Fuel type</label>
                                                <input
                                                    name="fuelType"
                                                    value={editVehicle.fuelType}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Gear</label>
                                                <input
                                                    name="gear"
                                                    value={editVehicle.gear}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Mileage (km)</label>
                                                <input
                                                    type="number"
                                                    name="mileage"
                                                    value={editVehicle.mileage}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price per day ($)</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={editVehicle.price}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Options</label>
                                                <input
                                                    name="options"
                                                    value={editVehicle.options}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-form-section modal-form-section-wide">
                                        <h4 className="modal-form-title">Description & image</h4>
                                        <div className="modal-form-fields">
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    value={editVehicle.description}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Vehicle image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleEditImageChange}
                                                />
                                                {editVehicle.imageUrl && (
                                                    <img
                                                        src={editVehicle.imageUrl}
                                                        alt="Preview"
                                                        className="modal-image-preview"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dagestan-modal-footer">
                                    <button
                                        type="button"
                                        className="dagestan-btn-secondary"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditVehicle(null);
                                            setEditImageFile(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="dagestan-btn-primary">
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminVehicle;
