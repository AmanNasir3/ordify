import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import styles from "./ServiceDetails.module.css";
import layoutStyles from "./ServiceDetailsLayout.module.css";
import { getSubcategoriesByCategory } from "../services/api/Instance";
import { HousekeepingDetails } from "./components/HousekeepingDetails";
import { NearbyAttractionsDetails } from "./components/NearbyAttractions";
import { RoomServiceDetails } from "./components/RoomServiceDetails";

const ServiceDetails = () => {
  const { slug } = useParams();
  const { state } = useLocation();
  const category = state?.category || null;
  const [subCategory, setSubCategory] = useState<any>(null);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await getSubcategoriesByCategory(category?.id);
        if (response.status === 200 && response.data.data) {
          setSubCategory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategory();
  }, []);

  if (slug === "house-keeping") {
    return (
      <HousekeepingDetails subCategory={subCategory} category={category} />
    );
  }

  if (slug === "room-service") {
    return <RoomServiceDetails service={subCategory} />;
  }

  if (slug === "nearby-attractions") {
    return <NearbyAttractionsDetails service={subCategory} />;
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
