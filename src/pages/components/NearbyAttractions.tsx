import styles from "../ServiceDetails.module.css";

export const NearbyAttractionsDetails = ({ service }: { service: any }) => {
  const category = Array.isArray(service) ? service[0] : null;
  const allItems = category?.items ?? [];
  const featuredAttraction = allItems[0] ?? null;
  const attractionsData = allItems.slice(1);

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        {category?.image && (
          <img
            src={category.image}
            alt={category.name}
            className={styles.headerImg}
          />
        )}
        <h1 className={styles.title}>{category?.name}</h1>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Featured Card */}
        {featuredAttraction && (
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "2.5rem",
            background: "white",
          }}
        >
          <img
            src={featuredAttraction.image}
            alt={featuredAttraction.name}
            style={{
              width: "100%",
              height: "550px",
              objectFit: "cover",
            }}
          />
          <div style={{ padding: "2rem" }}>
            <h2
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              {featuredAttraction.name}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              {featuredAttraction.description}
            </p>
          </div>
        </div>
        )}

        {/* Regular Attractions Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {attractionsData.map((attraction:any) => (
            <div
              key={attraction.id}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "white",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={attraction.image}
                alt={attraction.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {attraction.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                  }}
                >
                  {attraction.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};