import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import styles from "./ServiceDetails.module.css";
import layoutStyles from "./ServiceDetailsLayout.module.css";
import { getSubcategoriesByCategory } from "../services/api/Instance";
import { HousekeepingDetails } from "./components/HouseKeepingDetails";
import { NearbyAttractionsDetails } from "./components/NearbyAttractions";
import { RoomServiceDetails } from "./components/RoomServiceDetails";

const ServiceDetails = () => {
  const { slug } = useParams();
  const { state } = useLocation();
  const category = state?.category || null;
  const [subCategory, setSubCategory] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        if (category?.id) {
          const response = await getSubcategoriesByCategory(category.id);
          if (response.status === 200 && response.data.data) {
            setSubCategory(response.data.data);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategory();
  }, []);

  const typeId = parseInt(slug || "0", 10);

  if (typeId === 1) {
    return <RoomServiceDetails service={subCategory} category={category} />;
  }

  if (typeId === 2) {
    return (
      <HousekeepingDetails subCategory={subCategory} category={category} />
    );
  }

  if (typeId === 3) {
    return (
      <NearbyAttractionsDetails service={subCategory} category={category} />
    );
  }

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={category?.image}
          alt={category?.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{category?.name}</h1>
        <p className={styles.description}>More information coming soon</p>
      </div>
      <div className={layoutStyles.detailsLayout}>
        <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
          <h2>Service details coming soon!</h2>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
