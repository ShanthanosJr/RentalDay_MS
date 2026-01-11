import React, { Dispatch, SetStateAction } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/InfoDagestan.css';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images?: string[];
}

interface Rental {
  _id: string;
  user: User;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  createdAt: string;
}

interface InfoTabProps {
  vehicleCount: number;
  userCount: number;
  rentals: Rental[]; // Added prop for rentals data
  setActiveTab: Dispatch<SetStateAction<'info' | 'vehicles' | 'users' | 'rentals'>>;
}

// Helper function to get last 12 months in 'YYYY-MM' format
const getLast12Months = () => {
  const months = [];
  const today = new Date(2025, 11, 28); // December is 11 in JS
  for (let i = 0; i < 12; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`);
  }
  return months.reverse(); // Oldest to newest
};

const InfoTab: React.FC<InfoTabProps> = ({ vehicleCount, userCount, rentals, setActiveTab }) => {
  // Photobooth data with descriptions
  const marqueeItems = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Dagestan Mountains', desc: 'Breathtaking peaks and valleys' },
    { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Caspian Shores', desc: 'Serene lakeside views' },
    { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Mountain Villages', desc: 'Charming alpine settlements' },
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Forest Trails', desc: 'Lush greenery and paths' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Highland Landscapes', desc: 'Majestic high-altitude scenery' },
    { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Coastal Retreats', desc: 'Peaceful seaside escapes' },
    // Duplicates for seamless scroll
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Dagestan Mountains', desc: 'Breathtaking peaks and valleys' },
    { src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Caspian Shores', desc: 'Serene lakeside views' },
  ];

  // Video URL
  const heroVideoUrl = 'https://www.pexels.com/download/video/1851190/';

  // Compute chart data from rentals
  const last12Months = getLast12Months();

  // Rental Status Pie Data
  const statusCounts = rentals.reduce((acc, rental) => {
    acc[rental.status] = (acc[rental.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(45, 90, 39, 0.8)',
        'rgba(139, 115, 85, 0.8)',
        'rgba(212, 175, 55, 0.8)',
        'rgba(245, 245, 220, 0.8)',
        'rgba(26, 58, 26, 0.8)',
        'rgba(139, 115, 85, 0.8)'
      ],
      borderColor: [
        'rgba(45, 90, 39, 1)',
        'rgba(139, 115, 85, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(245, 245, 220, 1)',
        'rgba(26, 58, 26, 1)',
        'rgba(139, 115, 85, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00c853',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}`;
          }
        }
      }
    },
    cutout: '60%', // Makes it a donut chart
    animation: {
      animateRotate: true,
      animateScale: false
    }
  };

  // Revenue Trend Bar Data
  const monthlyRevenue = last12Months.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as Record<string, number>);
  rentals.forEach(rental => {
    const createdMonth = new Date(rental.createdAt).toISOString().slice(0, 7);
    if (monthlyRevenue[createdMonth] !== undefined) {
      monthlyRevenue[createdMonth] += rental.totalCost;
    }
  });
  const revenueChartData = {
    labels: last12Months,
    datasets: [{
      label: 'Monthly Revenue ($)',
      data: last12Months.map(month => monthlyRevenue[month] || 0),
      backgroundColor: [
        'rgba(45, 90, 39, 0.6)',
        'rgba(139, 115, 85, 0.6)',
        'rgba(212, 175, 55, 0.6)',
        'rgba(245, 245, 220, 0.6)',
        'rgba(26, 58, 26, 0.6)',
        'rgba(139, 115, 85, 0.6)'
      ],
      borderColor: [
        'rgba(45, 90, 39, 1)',
        'rgba(139, 115, 85, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(245, 245, 220, 1)',
        'rgba(26, 58, 26, 1)',
        'rgba(139, 115, 85, 1)'
      ],
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#00c853',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4, // Creates smooth curves
      fill: true
    }]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          },
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00c853',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057',
          callback: function(value: any) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#495057',
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    }
  };

  // Top Vehicles Bar Data (most rented)
  const vehicleRentCounts = rentals.reduce((acc, rental) => {
    const key = `${rental.vehicle.make} ${rental.vehicle.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedVehicles = Object.entries(vehicleRentCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5); // Top 5
  const topVehiclesChartData = {
    labels: sortedVehicles.map(([key]) => key),
    datasets: [{
      label: 'Rental Count',
      data: sortedVehicles.map(([, value]) => value),
      backgroundColor: [
        'rgba(45, 90, 39, 0.7)',
        'rgba(139, 115, 85, 0.7)',
        'rgba(212, 175, 55, 0.7)',
        'rgba(245, 245, 220, 0.7)',
        'rgba(26, 58, 26, 0.7)'
      ],
      borderColor: [
        'rgba(45, 90, 39, 1)',
        'rgba(139, 115, 85, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(245, 245, 220, 1)',
        'rgba(26, 58, 26, 1)'
      ],
      borderWidth: 1,
      borderSkipped: false,
      borderRadius: 6,
      borderAlign: 'inner'
    }]
  };

  const topVehiclesChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00c853',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#495057',
          font: {
            size: 11
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    }
  };

  // User Trend: Mock since no createdAt in users, assume uniform or skip; here mock line
  const userGrowthData = {
    labels: last12Months,
    datasets: [{
      label: 'New Users',
      data: last12Months.map((_, i) => Math.floor(userCount / 12) * (i + 1)), // Cumulative mock
      borderColor: 'rgba(45, 90, 39, 1)',
      backgroundColor: 'rgba(45, 90, 39, 0.3)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(45, 90, 39, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 3
    }]
  };

  const userGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          },
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00c853',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#495057'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    }
  };

  // Vehicle Availability Pie: Mock rented vs available
  const rentedVehicles = new Set(rentals.filter(r => r.status === 'Ongoing' || r.status === 'Approved').map(r => r.vehicle._id)).size;
  const availableVehicles = vehicleCount - rentedVehicles;
  const vehicleAvailChartData = {
    labels: ['Available', 'Rented'],
    datasets: [{
      data: [availableVehicles, rentedVehicles],
      backgroundColor: [
        'rgba(45, 90, 39, 0.8)',
        'rgba(139, 115, 85, 0.8)',
        'rgba(212, 175, 55, 0.8)',
        'rgba(245, 245, 220, 0.8)'
      ],
      borderColor: [
        'rgba(45, 90, 39, 1)',
        'rgba(139, 115, 85, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(245, 245, 220, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const vehicleAvailOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#00c853',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: false
    }
  };

  return (
    <div className="container-fluid container-lg mt-4 px-4">
      {/* PHOTOBOOTH: ADVANCED MARQUEE WITH OVERLAY TEXT */}
      <div className="marquee-container mb-5 py-4 bg-dark">
        <div className="marquee-track">
          {marqueeItems.map((item, index) => (
            <div key={index} className="marquee-item position-relative d-inline-block mx-2 overflow-hidden" style={{ width: '300px', height: '200px' }}>
              <img src={item.src} alt={item.title} className="w-100 h-100 object-fit-cover" />
              <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient-to-t from-black to-transparent text-white">
                <h6 className="mb-0 text-truncate">{item.title}</h6>
                <small className="text-muted">{item.desc}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero-section position-relative overflow-hidden mb-5" style={{ height: '60vh' }}>
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)' }}></div>
        <div className="hero-content glass-panel position-absolute top-50 end-0 translate-middle-y me-5 p-4" style={{ maxWidth: '500px' }}>
          <h6 className="text-success fw-bold mb-2">DISCOVER RentalDay</h6>
          <h1 className="display-3 fw-bold mb-3 text-white">RentalDay <span className="text-success">Adventures</span></h1>
          <p className="lead text-light mb-4">
            Embark on unforgettable journeys through the majestic mountains and serene landscapes of RentalDay with our premium vehicle rentals.
          </p>
          <div className="d-flex gap-4 justify-content-center">
            <div className="text-center">
              <i className="fas fa-mountain fa-2x text-success mb-2"></i>
              <span className="d-block small fw-bold text-white">Mountain Trails</span>
            </div>
            <div className="text-center">
              <i className="fas fa-water fa-2x text-success mb-2"></i>
              <span className="d-block small fw-bold text-white">Coastal Drives</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="dagestan-card h-100 p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-car-side fa-4x text-success me-3"></i>
              <h3 className="dagestan-title mb-0">Explore Our <span className="text-success">Fleet</span></h3>
            </div>
            <p className="dagestan-subtitle mb-4">Discover vehicles perfect for your RentalDay adventures.</p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2"><i className="fas fa-route text-success me-2"></i>Mountain Routes</li>
              <li className="mb-2"><i className="fas fa-dollar-sign text-success me-2"></i>Affordable Pricing</li>
              <li className="mb-2"><i className="fas fa-shield-alt text-success me-2"></i>Safe Journeys</li>
            </ul>
            <div className="my-4">
              <h6 className="small fw-bold text-muted mb-2">VEHICLE AVAILABILITY</h6>
              <div className="chart-container">
                <Pie data={vehicleAvailChartData} options={vehicleAvailOptions} />
              </div>
            </div>
            <button className="dagestan-btn w-100" onClick={() => setActiveTab('vehicles')}>
              Explore Fleet ({vehicleCount} Vehicles)
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dagestan-card h-100 p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-users fa-4x text-success me-3"></i>
              <h3 className="dagestan-title mb-0">Meet Our <span className="text-success">Travelers</span></h3>
            </div>
            <p className="dagestan-subtitle mb-4">Connect with fellow adventurers exploring RentalDay.</p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2"><i className="fas fa-user-check text-success me-2"></i>Verified Travelers</li>
              <li className="mb-2"><i className="fas fa-shield-alt text-success me-2"></i>Safe Community</li>
              <li className="mb-2"><i className="fas fa-comments text-success me-2"></i>Travel Stories</li>
            </ul>
            <div className="my-4">
              <h6 className="small fw-bold text-muted mb-2">TRAVELER GROWTH</h6>
              <div className="chart-container">
                <Line data={userGrowthData} options={userGrowthOptions} />
              </div>
            </div>
            <button className="dagestan-btn w-100" onClick={() => setActiveTab('users')}>
              Meet Travelers ({userCount} Active)
            </button>
          </div>
        </div>
      </div>

      {/* JOURNEY BOOKINGS */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="dagestan-card p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-calendar-check fa-4x text-success me-3"></i>
              <h3 className="dagestan-title mb-0">Journey <span className="text-success">Bookings</span></h3>
            </div>
            <p className="dagestan-subtitle mb-4">Plan and manage your adventures across RentalDay.</p>
            <ul className="list-unstyled text-muted">
              <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Confirmed Reservations</li>
              <li className="mb-2"><i className="fas fa-sync-alt text-success me-2"></i>Journey Tracking</li>
              <li className="mb-2"><i className="fas fa-chart-bar text-success me-2"></i>Adventure Insights</li>
            </ul>
            <div className="row">
              <div className="col-md-6 my-4">
                <h6 className="small fw-bold text-muted mb-2">BOOKING STATUS</h6>
                <div className="chart-container">
                  <Pie data={statusChartData} options={statusChartOptions} />
                </div>
              </div>
              <div className="col-md-6 my-4">
                <h6 className="small fw-bold text-muted mb-2">POPULAR VEHICLES</h6>
                <div className="chart-container">
                  <Bar data={topVehiclesChartData} options={topVehiclesChartOptions} />
                </div>
              </div>
            </div>
            <button className="dagestan-btn w-100" onClick={() => setActiveTab('rentals')}>
              Manage Journeys ({rentals.length} Bookings)
            </button>
          </div>
        </div>
      </div>

      {/* ADVENTURE EARNINGS */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="dagestan-card p-4">
            <h3 className="dagestan-title mb-4">RentalDay Earnings</h3>
            <div className="chart-xl">
              <Bar data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT JOURNEYS */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="dagestan-card p-4">
            <h3 className="dagestan-title mb-4">RentalDay Journeys</h3>
            <div className="table-responsive">
              <table className="dagestan-table">
                <thead>
                  <tr>
                    <th>RentalDay ID</th>
                    <th>Traveler</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.slice(0, 5).map(rental => (
                    <tr key={rental._id}>
                      <td>{rental._id.slice(-6)}</td>
                      <td>{rental.user.username}</td>
                      <td>{rental.vehicle.make} {rental.vehicle.model}</td>
                      <td><span className={`badge bg-${rental.status.toLowerCase()}`}>{rental.status}</span></td>
                      <td>{new Date(rental.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM HEALTH */}
      <div className="row g-4">
        <div className="col-12">
          <div className="dagestan-card p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-chart-line fa-4x text-success me-3"></i>
              <h3 className="dagestan-title mb-0">Platform <span className="text-success">Health</span></h3>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold">Booking Load</span>
                  <span className="small fw-bold text-success">12%</span>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '12%'}}></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold">Journey Storage</span>
                  <span className="small fw-bold text-success">45%</span>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '45%'}}></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold">Fleet Capacity</span>
                  <span className="small fw-bold text-success">85%</span>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold">Adventure Ready</span>
                  <span className="small fw-bold text-success">95%</span>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="small fw-bold text-muted mb-2">ADVENTURE TRENDS</h6>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Dagestan Adventure Trends" 
                className="w-100 rounded shadow" 
                style={{ height: '250px', objectFit: 'cover' }}
              />
            </div>
            <div className="alert alert-success mt-4 mb-0 text-center fw-bold">
              ALL ADVENTURES READY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;