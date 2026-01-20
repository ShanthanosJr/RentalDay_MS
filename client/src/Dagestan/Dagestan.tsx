import { useState, useRef } from 'react';
import './Dagestan.css';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Images
const heroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop';
const tourFortress = 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg';
const tourHiking = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop';
const tourLake = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop';
const tourVillage = 'https://images.pexels.com/photos/1656442/pexels-photo-1656442.jpeg';
const galleryCouple = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop';
const galleryFriends = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop';
const galleryFreedom = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
const galleryCanyon = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
const galleryExplorer = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

// ============ DATA ============
const aboutItems = [
  {
    image: tourFortress,
    text: "Author's tour program, is a fascinating vacation full of impressions.",
    imagePosition: 'left',
  },
  {
    image: tourVillage,
    text: "Small groups of up to 10 people allow for a personalized experience.",
    imagePosition: 'right',
  },
  {
    image: galleryCouple,
    text: "Comfortable accommodation in hand-picked hotels and guesthouses.",
    imagePosition: 'left',
  },
  {
    image: tourHiking,
    text: "Experienced local guides who know every hidden gem of Dagestan.",
    imagePosition: 'right',
  },
  {
    image: tourLake,
    text: "Authentic cuisine experiences with traditional Dagestan hospitality.",
    imagePosition: 'left',
  },
];

const tours = [
  {
    title: 'Walking tour',
    duration: '3 days',
    description: 'An amazing opportunity to visit the most picturesque places in the region.',
    image: tourFortress,
  },
  {
    title: 'Mini walking tour',
    duration: '2 days',
    description: 'A brief tour for those who want to see the highlights in a short time.',
    image: tourHiking,
  },
  {
    title: 'Weekend tour',
    duration: '2 days',
    description: 'The perfect getaway to recharge and explore nature on the weekend.',
    image: tourLake,
  },
  {
    title: 'Village tour',
    duration: '4 days',
    description: 'Immerse yourself in the authentic culture and traditions of mountain villages.',
    image: tourVillage,
  },
];

const photos = [
  { src: galleryCouple, alt: 'Traveler overlooking mountains' },
  { src: galleryFriends, alt: 'Group of friends hiking' },
  { src: galleryFreedom, alt: 'Woman with arms spread on cliff' },
  { src: galleryCanyon, alt: 'Sulak Canyon view' },
  { src: galleryExplorer, alt: 'Explorer at ancient ruins' },
];

const faqs = [
  {
    question: 'What to take with you?',
    answer: 'We recommend bringing comfortable hiking shoes, weather-appropriate clothing, sunscreen, a camera, and personal essentials. A detailed packing list will be provided upon booking.',
  },
  {
    question: 'Are there any age restrictions?',
    answer: 'Most of our tours are suitable for participants aged 12 and above. Some challenging mountain treks may have higher age requirements. Family-friendly tours are available.',
  },
  {
    question: 'How does hotel check-in go?',
    answer: 'Our team will assist with all check-in procedures. Hotels are pre-booked and confirmed before your arrival. You will receive all accommodation details in your travel documents.',
  },
  {
    question: 'What is the physical workload of the tour?',
    answer: 'Physical requirements vary by tour. Walking tours involve 4-6 hours of moderate hiking daily. We provide difficulty ratings for each tour so you can choose accordingly.',
  },
];

const testimonials = [
  {
    name: 'Molly',
    text: 'This journey was absolutely incredible! The landscapes of Dagestan are breathtaking. Every moment felt like stepping into a dream. The guides were knowledgeable and friendly.',
    avatar: 'M',
  },
  {
    name: 'Stella',
    text: 'An unforgettable experience! The organization was perfect, and we discovered hidden gems that most tourists never see. I have already recommended this tour to all my friends.',
    avatar: 'S',
  },
  {
    name: 'Tim',
    text: 'The best tour I have ever taken. The combination of adventure, culture, and nature made this trip special. The local cuisine was a wonderful bonus that exceeded expectations.',
    avatar: 'T',
  },
  {
    name: 'Dan',
    text: 'Professional team, stunning views, and memories that will last a lifetime. Cannot wait to come back for another tour! This was truly a life-changing adventure.',
    avatar: 'D',
  },
];

const inclusions = [
  'Comfortable accommodation',
  'Transfer',
  'Attractions included',
  'Experienced guides',
  'Dinner',
  'Entrance fee',
];

// ============ NAVBAR ============
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="dagestan-nav">
      <div className="dagestan-nav-inner">
        <a href="/" className="dagestan-logo">TourDay</a>
        
        <div className="dagestan-nav-links">
          <a href="#about" className="dagestan-nav-link">Programm</a>
          <a href="#tours" className="dagestan-nav-link">Price</a>
          <a href="#testimonials" className="dagestan-nav-link">Reviews</a>
          <button className="dagestan-nav-btn">Book a tour</button>
        </div>

        <button className="dagestan-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`} style={{fontSize: '24px'}}></i>
        </button>
      </div>

      {isMenuOpen && (
        <div className="dagestan-mobile-menu">
          <a href="#about" className="dagestan-nav-link">Programm</a>
          <a href="#tours" className="dagestan-nav-link">Price</a>
          <a href="#testimonials" className="dagestan-nav-link">Reviews</a>
          <button className="dagestan-nav-btn">Book a tour</button>
        </div>
      )}
    </nav>
  );
};

// ============ HERO ============
const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useScrollAnimation(heroRef);
  const titleVisible = useScrollAnimation(titleRef, { threshold: 0.1 });
  const subtitleVisible = useScrollAnimation(subtitleRef, { threshold: 0.1 });

  return (
    <section ref={heroRef} className="dagestan-hero">
      <div className="dagestan-hero-bg">
        <img src={heroImage} alt="Dagestan mountain landscape" className="dagestan-hero-img" />
        <div className="dagestan-hero-overlay" />
      </div>

      <div className="dagestan-hero-content">
        <h1 
          ref={titleRef}
          className={`dagestan-hero-title scroll-animate hero-title ${titleVisible ? 'animate-in' : ''}`}
        >
          TourDay
        </h1>
        <p 
          ref={subtitleRef}
          className={`dagestan-hero-subtitle scroll-animate hero-subtitle ${subtitleVisible ? 'animate-in' : ''}`}
        >
          You will have an incredible experience – the beauty<br />
          of the surrounding nature will take your breath away.
        </p>
      </div>

      <div className="dagestan-scroll-indicator">
        <div className="dagestan-scroll-mouse">
          <div className="dagestan-scroll-dot" />
        </div>
      </div>
    </section>
  );
};

// ============ ABOUT SECTION (FIXED TIMELINE) ============
const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  
  // Create refs for timeline items
  const setTimelineRef = (index: number) => (el: HTMLDivElement | null) => {
    timelineRefs.current[index] = el;
  };
  
  const timelineVisible = aboutItems.map((_, index) => 
    useScrollAnimation({ current: timelineRefs.current[index] }, { threshold: 0.1 })
  );

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className={`dagestan-section dagestan-about scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-section-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <span className="dagestan-section-label">About us</span>
          <div>
            <h2 className="dagestan-section-title">Five Reasons Why It's Worth Going</h2>
            <h3 className="dagestan-section-subtitle">to journey with us</h3>
          </div>
        </div>

        <div className="dagestan-timeline">
          <div className="dagestan-timeline-line" />
          
          <div className="dagestan-timeline-items">
            {aboutItems.map((item, index) => (
              <div 
                key={index} 
                ref={setTimelineRef(index)}
                className={`dagestan-timeline-item scroll-animate timeline-item delay-${(index % 5) + 1} ${timelineVisible[index] ? 'animate-in' : ''}`}
              >
                {/* Left side */}
                <div className="dagestan-timeline-left">
                  {item.imagePosition === 'left' ? (
                    <img src={item.image} alt="Tour experience" className="dagestan-timeline-image" />
                  ) : (
                    <p className="dagestan-timeline-text">{item.text}</p>
                  )}
                </div>
                
                {/* Center dot */}
                <div className="dagestan-timeline-dot" />
                
                {/* Right side */}
                <div className="dagestan-timeline-right">
                  {item.imagePosition === 'right' ? (
                    <img src={item.image} alt="Tour experience" className="dagestan-timeline-image" />
                  ) : (
                    <p className="dagestan-timeline-text">{item.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ TOURS SECTION ============
const ToursSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tourCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  
  const setTourCardRef = (index: number) => (el: HTMLDivElement | null) => {
    tourCardRefs.current[index] = el;
  };
  
  const tourCardVisible = tours.map((_, index) => 
    useScrollAnimation({ current: tourCardRefs.current[index] }, { threshold: 0.1 })
  );

  return (
    <section 
      ref={sectionRef}
      id="tours" 
      className={`dagestan-section dagestan-tours scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-section-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <span className="dagestan-section-label">Tours</span>
          <div>
            <h2 className="dagestan-section-title">We will go to the heart of the earth</h2>
            <h3 className="dagestan-section-subtitle">among the mountains and waterfalls</h3>
          </div>
        </div>

        <div className="dagestan-tours-grid">
          {tours.map((tour, index) => (
            <div 
              key={index} 
              ref={setTourCardRef(index)}
              className={`dagestan-tour-card scroll-animate tour-card ${tourCardVisible[index] ? 'animate-in' : ''}`}
            >
              <div className="dagestan-tour-image-wrapper">
                <img src={tour.image} alt={tour.title} className="dagestan-tour-image" />
                <span className="dagestan-tour-badge">{tour.duration}</span>
              </div>
              <h4 className="dagestan-tour-title">{tour.title}</h4>
              <p className="dagestan-tour-desc">{tour.description}</p>
              <button className="dagestan-tour-btn">Learn more</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ PHOTO CAROUSEL ============
const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  const carouselVisible = useScrollAnimation(carouselRef, { threshold: 0.1 });

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + photos.length) % photos.length);
    const adjustedDiff = normalizedDiff > photos.length / 2 ? normalizedDiff - photos.length : normalizedDiff;

    if (adjustedDiff === 0) {
      return { transform: 'translateX(0) scale(1)', zIndex: 30, opacity: 1, filter: 'none' };
    } else if (adjustedDiff === 1 || adjustedDiff === -photos.length + 1) {
      return { transform: 'translateX(60%) scale(0.85) rotateY(-5deg)', zIndex: 20, opacity: 0.7, filter: 'grayscale(80%)' };
    } else if (adjustedDiff === -1 || adjustedDiff === photos.length - 1) {
      return { transform: 'translateX(-60%) scale(0.85) rotateY(5deg)', zIndex: 20, opacity: 0.7, filter: 'grayscale(80%)' };
    } else if (adjustedDiff === 2) {
      return { transform: 'translateX(100%) scale(0.7)', zIndex: 10, opacity: 0.4, filter: 'grayscale(100%)' };
    } else if (adjustedDiff === -2) {
      return { transform: 'translateX(-100%) scale(0.7)', zIndex: 10, opacity: 0.4, filter: 'grayscale(100%)' };
    }
    return { transform: 'translateX(0) scale(0.5)', zIndex: 0, opacity: 0, filter: 'grayscale(100%)' };
  };

  return (
    <section 
      ref={sectionRef}
      className={`dagestan-section dagestan-carousel scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-carousel-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <span className="dagestan-section-label">Gallery</span>
          <h2 className="dagestan-section-title">The best tour of Dagestan</h2>
          <h3 className="dagestan-section-subtitle">in customer photos</h3>
        </div>

        <div 
          ref={carouselRef}
          className={`dagestan-carousel-container scroll-animate carousel ${carouselVisible ? 'animate-in' : ''}`}
        >
          <div className="dagestan-carousel-bg-text">
            <span>EXPLORE</span>
          </div>

          <div className="dagestan-carousel-cards">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="dagestan-carousel-card"
                style={getCardStyle(index)}
                onClick={() => setCurrentIndex(index)}
              >
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>

          <button onClick={goToPrevious} className="dagestan-carousel-arrow left" aria-label="Previous photo">
            <i className="bi bi-chevron-left" style={{fontSize: '24px'}}></i>
          </button>
          <button onClick={goToNext} className="dagestan-carousel-arrow right" aria-label="Next photo">
            <i className="bi bi-chevron-right" style={{fontSize: '24px'}}></i>
          </button>
        </div>

        <div className="dagestan-carousel-dots">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`dagestan-carousel-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>

        <div className="dagestan-carousel-caption">
          <div className="dagestan-carousel-caption-inner">
            <div className="dagestan-carousel-caption-line" />
            <p>{photos[currentIndex].alt}</p>
            <div className="dagestan-carousel-caption-line" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ FAQ SECTION ============
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  
  const setFaqItemRef = (index: number) => (el: HTMLDivElement | null) => {
    faqItemRefs.current[index] = el;
  };
  
  const faqItemVisible = faqs.map((_, index) => 
    useScrollAnimation({ current: faqItemRefs.current[index] }, { threshold: 0.1 })
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef}
      className={`dagestan-section dagestan-faq scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-faq-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <h2 className="dagestan-section-title">Frequently asked questions</h2>
          <h3 className="dagestan-section-subtitle">about the tour</h3>
        </div>

        <div className="dagestan-faq-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              ref={setFaqItemRef(index)}
              className={`dagestan-faq-item scroll-animate faq-item ${faqItemVisible[index] ? 'animate-in' : ''}`}
            >
              <button onClick={() => toggleFAQ(index)} className="dagestan-faq-question">
                <span>{faq.question}</span>
                <div className="dagestan-faq-icon">
                  <i className={`bi ${openIndex === index ? 'bi-dash' : 'bi-plus'}`} style={{fontSize: '14px'}}></i>
                </div>
              </button>
              <div className={`dagestan-faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ TESTIMONIALS SECTION ============
const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  
  const setTestimonialRef = (index: number) => (el: HTMLDivElement | null) => {
    testimonialRefs.current[index] = el;
  };
  
  const testimonialVisible = testimonials.map((_, index) => 
    useScrollAnimation({ current: testimonialRefs.current[index] }, { threshold: 0.1 })
  );

  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className={`dagestan-section dagestan-testimonials scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-testimonials-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <span className="dagestan-section-label">Reviews</span>
          <h2 className="dagestan-section-title">People's emotions after</h2>
          <h3 className="dagestan-section-subtitle">passing the tour</h3>
        </div>

        <div className="dagestan-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              ref={setTestimonialRef(index)}
              className={`dagestan-testimonial-card scroll-animate testimonial-card ${testimonialVisible[index] ? 'animate-in' : ''}`}
            >
              <p className="dagestan-testimonial-text">"{testimonial.text}"</p>
              <div className="dagestan-testimonial-author">
                <div className="dagestan-testimonial-avatar">{testimonial.avatar}</div>
                <span className="dagestan-testimonial-name">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ PRICING SECTION ============
const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pricingCardRef = useRef<HTMLDivElement>(null);
  
  const sectionVisible = useScrollAnimation(sectionRef);
  const headerVisible = useScrollAnimation(headerRef, { threshold: 0.1 });
  const pricingCardVisible = useScrollAnimation(pricingCardRef, { threshold: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className={`dagestan-section dagestan-pricing scroll-animate ${sectionVisible ? 'animate-in' : ''}`}
    >
      <div className="dagestan-section-inner">
        <div 
          ref={headerRef}
          className={`dagestan-pricing-header scroll-animate delay-1 ${headerVisible ? 'animate-in' : ''}`}
        >
          <h2 className="dagestan-section-title">What is included</h2>
          <h3 className="dagestan-section-subtitle">in the price?</h3>
        </div>

        <div 
          ref={pricingCardRef}
          className={`dagestan-pricing-card scroll-animate pricing-card ${pricingCardVisible ? 'animate-in' : ''}`}
        >
          <div className="dagestan-pricing-inclusions">
            {inclusions.map((item, index) => (
              <div key={index} className="dagestan-pricing-item">
                <div className="dagestan-pricing-check">
                  <i className="bi bi-check" style={{fontSize: '14px'}}></i>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="dagestan-pricing-footer">
            <div>
              <span className="dagestan-pricing-label">Starting from</span>
              <div className="dagestan-pricing-amount">
                <strong>$299</strong>
                <span>/person</span>
              </div>
            </div>
            <button className="dagestan-pricing-btn">Book your tour</button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ FOOTER ============
const Footer = () => {
  return (
    <footer className="dagestan-footer">
      <div className="dagestan-footer-inner">
        <div className="dagestan-footer-grid">
          <div className="dagestan-footer-brand">
            <a href="/">TourDay</a>
            <p>
              Discover the breathtaking beauty of TourDay's mountains, ancient villages, and rich cultural heritage with our expertly guided tours.
            </p>
          </div>

          <div className="dagestan-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#tours">Tours</a></li>
              <li><a href="#testimonials">Reviews</a></li>
            </ul>
          </div>

          <div className="dagestan-footer-col">
            <h4>Contact</h4>
            <ul>
              <li>info@tourday.com</li>
              <li>+7 (123) 456-7890</li>
            </ul>
          </div>
        </div>

        <div className="dagestan-footer-bottom">
          <p>© 2024 TourDay. All rights reserved.</p>
          <div className="dagestan-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============ MAIN COMPONENT ============
const Dagestan = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <ToursSection />
      <PhotoCarousel />
      <FAQSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  );
};

export default Dagestan;
