import { useState } from "react";
import { Dialog, Image, Text } from "@chakra-ui/react";
import styles from "../ServiceDetails.module.css";

export const NearbyAttractionsDetails = ({ service, category }: { service: any; category: any }) => {
  const subCategories = Array.isArray(service) ? service : [];
  const featuredAttraction = subCategories[0] ?? null;
  const restAttractions = subCategories.slice(1);
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);

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
              {featuredAttraction.description && (
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
              )}
            </div>
          </div>
        )}

        {/* Remaining Attractions Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {restAttractions.map((attraction: any) => (
            <div
              key={attraction.id}
              onClick={() => setSelectedAttraction(attraction)}
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
                  height: "200px",
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
                {attraction.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "#666",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {attraction.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog.Root
        open={!!selectedAttraction}
        onOpenChange={(e) => { if (!e.open) setSelectedAttraction(null); }}
        size="lg"
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={5}>
            {selectedAttraction && (
              <>
                <Image
                  src={selectedAttraction.image}
                  alt={selectedAttraction.name}
                  width="100%"
                  height="320px"
                  objectFit="cover"
                  borderRadius={7}
                />
                <Dialog.Header>
                  <Dialog.Title>{selectedAttraction.name}</Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>
                <Dialog.Body pb={6}>
                  {selectedAttraction.description && (
                    <Text fontSize="md" color="gray.600" lineHeight="1.7">
                      {selectedAttraction.description}
                    </Text>
                  )}
                </Dialog.Body>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>
  );
};