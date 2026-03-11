import { ImageSlider, ServiceIcon, ServiceCard } from '../components';
import { services, sliderImages } from '../data';
import '../App.css';
import { useNavigate, useOutletContext } from 'react-router';
import { useEffect, useState } from 'react';
import { getCategories } from '../services/api/Instance';

const Home = () => {
  const navigate = useNavigate()
  const { verificationComplete, reopenVerification } = useOutletContext<{ 
    verificationComplete: boolean
    reopenVerification: () => void 
  }>()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      // Check if token exists before making API call
      const session = localStorage.getItem('session')
      if (!session) {
        setLoading(false)
        return
      }
      
      try {
        const parsedSession = JSON.parse(session)
        if (!parsedSession.token) {
          setLoading(false)
          return
        }
      } catch {
        setLoading(false)
        return
      }

      try {
        const response = await getCategories()
        if (response.status === 401) {
          // Token is invalid, reopen verification modal
          reopenVerification()
          return
        }
        if (response.status === 200 && response.data.categories) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [verificationComplete])

  const handleServiceClick = (category: any) => {
    console.log('Selected service:', category);
    navigate(`/service/${category.slug}`,{
      state: { category }
    });
    // Navigate to service detail page
  };

  return (
    <div className="app">
      <ImageSlider images={sliderImages} />
      <main className="main-content">
        <section className="quick-services-section">
          <h2 className="section-title">Our Services</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          ) : (
            <div className="quick-services-grid">
              {categories.map((category) => (
                <ServiceIcon 
                  key={category.id} 
                  service={{ 
                    id: category.id, 
                    name: category.name, 
                    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
                    image: category.image
                  }} 
                  onClick={() => handleServiceClick({ 
                    id: category.id, 
                    name: category.name, 
                    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
                    image: category.image,
                    rating: null,
                    reviewCount: 0
                  })}
                />
              ))}
            </div>
          )}
        </section>
        <section className="services-section">
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
