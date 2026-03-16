import { ImageSlider, ServiceIcon, ServiceCard } from "../components";
import "../App.css";
import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getCarouselImages, getCategories } from "../services/api/Instance";

const Home = () => {
  const navigate = useNavigate();
  const { verificationComplete, reopenVerification } = useOutletContext<{
    verificationComplete: boolean;
    reopenVerification: () => void;
  }>();
  const [categories, setCategories] = useState<any[]>([]);
  const [carouselImages, setCarouselImages] = useState<{ id:number; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      // Check if token exists before making API call
      const session = localStorage.getItem("session");
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const parsedSession = JSON.parse(session);
        if (!parsedSession.token) {
          setLoading(false);
          return;
        }
      } catch {
        setLoading(false);
        return;
      }

      try {
        const response = await getCategories();
        const carouselResponse = await getCarouselImages();
        if (response.status === 401) {
          reopenVerification();
          return;
        }
        if (response.status === 200 && response.data.categories) {
          setCategories(response.data.categories);
        }
        
        if (carouselResponse.status === 200 && carouselResponse.data.data) {
          setCarouselImages(carouselResponse.data.data);
        }

      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [verificationComplete]);

  const handleServiceClick = (category: any) => {
    navigate(`/service/${category.slug}`, {
      state: { category },
    });
  };

  return (
    <div className="app">
      {loading ? (
        <div>
          <div className="skeleton-carousel skeleton-shimmer" />
          <div className="skeleton-carousel-dots">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-carousel-dot skeleton-shimmer" />
            ))}
          </div>
        </div>
      ) : (
        <ImageSlider images={carouselImages} />
      )}
      <main className="main-content">
        <section className="quick-services-section">
          <h2 className="section-title">Our Services</h2>
          {loading ? (
            <div className="quick-services-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-icon-card">
                  <div className="skeleton-icon-wrapper">
                    <div className="skeleton-icon-box skeleton-shimmer" />
                  </div>
                  <div className="skeleton-icon-label skeleton-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="quick-services-grid">
              {categories.map((category) => (
                <ServiceIcon
                  key={category.id}
                  service={{
                    id: category.id,
                    name: category.name,
                    slug: category.name.toLowerCase().replace(/\s+/g, "-"),
                    image: category.image,
                  }}
                  onClick={() =>
                    handleServiceClick({
                      id: category.id,
                      name: category.name,
                      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
                      image: category.image,
                      rating: null,
                      reviewCount: 0,
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>
        <section className="services-section">
          <div className="services-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-card-image skeleton-shimmer" />
                    <div className="skeleton-card-content">
                      <div className="skeleton-card-title skeleton-shimmer" />
                    </div>
                  </div>
                ))
              : categories.map((category) => (
                  <ServiceCard
                    key={category.id}
                    service={category}
                    onClick={() =>
                      handleServiceClick({
                        id: category.id,
                        name: category.name,
                        slug: category.name.toLowerCase().replace(/\s+/g, "-"),
                        image: category.image,
                        rating: null,
                        reviewCount: 0,
                      })
                    }
                  />
                ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
